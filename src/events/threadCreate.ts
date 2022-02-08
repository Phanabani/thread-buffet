import { ThreadChannel } from 'discord.js';
import { DiscordEventHandler } from '../types/discordEventHandler';

export default <DiscordEventHandler<[ThreadChannel]>>{
    name: 'threadCreate',
    once: false,
    execute(thread) {
        console.log(`Thread created: ${thread.name}`)
    },
};
