import { ThreadChannel } from 'discord.js';
import { DiscordEventHandler } from '../types/discordEventHandler';

export default <DiscordEventHandler<[ThreadChannel]>>{
    name: 'threadDelete',
    once: false,
    execute(thread) {
        console.log(`Thread deleted: ${thread.name}`)
    },
};
