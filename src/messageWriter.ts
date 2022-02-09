import { Embed } from '@discordjs/builders';
import { Client, Collection, Guild, ThreadChannel } from 'discord.js';
import { COLOR_THREADS_INFO } from './common/constants.js';
import { fetchChannel, fetchMessage } from './common/discord.js';
import { getThreadChannel, getThreadMessage, setThreadMessage } from './database/database.js';

function createThreadsEmbed(threads: Collection<string, ThreadChannel> | null): Embed {
    function compareThreads(t1: ThreadChannel, t2: ThreadChannel): number {
        const parentName1 = t1.parent?.name || '';
        const parentName2 = t2.parent?.name || '';
        return parentName1.localeCompare(parentName2);
    }

    let content = '';
    if (threads) {
        const contentParts: string[] = [];
        let lastParentName: string | null = null;
        for (const [id, thread] of threads.sorted(compareThreads)) {
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
    if (!(channelId && msgId)) return;
    const msg = await fetchMessage(client, channelId, msgId);
    if (!msg) return;

    // Edit the message with active threads
    const threads = await guild.channels.fetchActiveThreads(true);
    if (threads.hasMore) {
        console.warn('fetchActiveThreads.hasMore is true. idk what this means.');
    }
    const embed = createThreadsEmbed(threads.threads);
    await msg.edit({ embeds: [embed] })
}
