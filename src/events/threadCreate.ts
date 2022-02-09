import { ThreadChannel } from 'discord.js';
import { onThreadsUpdated } from '../messageWriter.js';
import { DiscordEventHandler } from '../types/discordEventHandler';

export default <DiscordEventHandler<[ThreadChannel]>>{
    name: 'threadCreate',
    once: false,
    async execute(thread) {
        await onThreadsUpdated(thread.client, thread.guild);
    }
};
