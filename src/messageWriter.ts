import { Embed } from '@discordjs/builders';
import { Client, Guild } from 'discord.js';
import { COLOR_THREADS_INFO } from './common/constants.js';
import { fetchChannel, fetchMessage } from './common/discord.js';
import { getThreadChannel, getThreadMessage, setThreadMessage } from './database/database.js';

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
    const msg = await channel.send('.');
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
    const msgContentParts: string[] = [];
    for (const [id, thread] of threads.threads) {
        msgContentParts.push(`<#${id}>`);
    }
    const embed = (
        new Embed()
            .setTitle('Active threads')
            .setDescription(msgContentParts.join('\n'))
            .setColor(COLOR_THREADS_INFO)
            .setFooter({ text: 'hi 💕' })
    );
    await msg.edit({ embeds: [embed] })
}
