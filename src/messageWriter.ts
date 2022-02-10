import { Embed } from '@discordjs/builders';
import { Client, Collection, Guild, ThreadChannel, Permissions, RoleResolvable } from 'discord.js';
import { COLOR_THREADS_INFO } from './common/constants.js';
import { fetchChannel, fetchMessage } from './common/discord.js';
import { getThreadChannel, getThreadMessage, getViewAsRole, setThreadMessage } from './database/database.js';

function prepareThreads(
    threads: Collection<string, ThreadChannel>,
    viewAsRole: RoleResolvable | null | undefined = undefined
): Collection<string, ThreadChannel> {

    function filterVisibility(t: ThreadChannel): boolean {
        let shouldPass = true;

        // Remove if archived or archival status is null
        shouldPass &&= !(t.archived ?? true);

        // Remove if the specified role (or @everyone)
        let rolePerms: Readonly<Permissions> | null = null;
        if (viewAsRole) {
            rolePerms = t.permissionsFor(viewAsRole);
        }
        const everyonePerms = t.permissionsFor(t.guild.roles.everyone);
        shouldPass &&= (rolePerms || everyonePerms).has(Permissions.FLAGS.VIEW_CHANNEL);

        return shouldPass;
    }

    function compareThreadNames(t1: ThreadChannel, t2: ThreadChannel): number {
        return t1.name.localeCompare(t2.name);
    }

    function compareThreadParentNames(t1: ThreadChannel, t2: ThreadChannel): number {
        const parentName1 = t1.parent?.name || '';
        const parentName2 = t2.parent?.name || '';
        return parentName1.localeCompare(parentName2);
    }

    let newThreads = threads.clone();

    // Remove archived or non-visible threads
    newThreads = newThreads.filter(filterVisibility);

    // Sort by thread name, then by their parent threads
    newThreads.sort(compareThreadNames);
    newThreads.sort(compareThreadParentNames);
    return newThreads;
}

function createThreadsEmbed(
    threads: Collection<string, ThreadChannel> | null,
    viewAsRole: RoleResolvable | null | undefined = undefined
): Embed {
    let content = '';
    if (threads) {
        const contentParts: string[] = [];
        let lastParentName: string | null = null;
        const preparedThreads = prepareThreads(threads, viewAsRole);

        for (const [id, thread] of preparedThreads) {
            let parentName = thread.parent?.name;
            if (parentName && parentName !== lastParentName) {
                if (lastParentName !== null) contentParts.push('');
                lastParentName = parentName;
                contentParts.push(`#${parentName}`)
            }
            contentParts.push(`• <#${id}>`);
        }
        content = contentParts.join('\n');
    }

    content ||= 'None';
    return new Embed()
        .setTitle('Active threads')
        .setDescription(content)
        .setColor(COLOR_THREADS_INFO)
        .setFooter({ text: 'Made by Angie 💕' });
}

async function deleteOldThreadMessage(client: Client, guild: Guild) {
    const channelId = await getThreadChannel(guild.id);
    const msgId = await getThreadMessage(guild.id);
    if (!(channelId && msgId)) return;

    const msg = await fetchMessage(client, channelId, msgId);
    if (!msg) return;
    await msg.delete();
    await setThreadMessage(guild.id, null);
}

export async function onThreadChannelWillChange(client: Client, guild: Guild) {
    await deleteOldThreadMessage(client, guild);
}

export async function onThreadChannelDidChange(client: Client, guild: Guild) {
    const channelId = await getThreadChannel(guild.id);
    const msgId = await getThreadMessage(guild.id);
    if (msgId) {
        console.error("Old thread message wasn't deleted properly.");
        await deleteOldThreadMessage(client, guild);
    }
    if (!channelId) return;

    // Channel is set, so create a new message
    const channel = await fetchChannel(client, channelId);
    if (!(channel && channel.isText())) return;
    const embed = createThreadsEmbed(null);
    const msg = await channel.send({ embeds: [embed] });
    await setThreadMessage(guild.id, msg.id);
    await onThreadsUpdated(client, guild);
}

export async function onThreadsUpdated(client: Client, guild: Guild) {
    const channelId = await getThreadChannel(guild.id);
    const msgId = await getThreadMessage(guild.id);
    const viewAsRole = await getViewAsRole(guild.id);
    if (!(channelId && msgId)) return;
    const msg = await fetchMessage(client, channelId, msgId);
    if (!msg) return;

    // Edit the message with active threads
    const threads = await guild.channels.fetchActiveThreads(true);
    if (threads.hasMore) {
        console.warn('fetchActiveThreads.hasMore is true. idk what this means.');
    }
    const embed = createThreadsEmbed(threads.threads, viewAsRole);
    await msg.edit({ embeds: [embed] })
}
