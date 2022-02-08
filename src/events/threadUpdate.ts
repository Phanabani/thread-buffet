import { ThreadChannel } from 'discord.js';
import { DiscordEventHandler } from '../types/discordEventHandler';

export default <DiscordEventHandler<[ThreadChannel, ThreadChannel]>>{
    name: 'threadUpdate',
    once: false,
    execute(oldThread, newThread) {
        console.log(`Thread updated: ${oldThread.name} ${newThread.name}`)
    },
};
