import { ThreadChannel } from 'discord.js';
import { onThreadsUpdated } from '../messageWriter.js';
import { DiscordEventHandler } from '../types/discordEventHandler';

export default <DiscordEventHandler<[ThreadChannel, ThreadChannel]>>{
    name: 'threadUpdate',
    once: false,
    async execute(oldThread, newThread) {
        await onThreadsUpdated(newThread.client, newThread.guild);
    }
};
