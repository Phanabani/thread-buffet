import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as Process from 'node:process';
import { clientId, guildId, token } from './config.js';
import { importAllDefault } from './common/dynamicImport.js';
import { getDirnameFromURL } from './common/file.js';
import { DiscordCommandHandler } from './types/discordCommandHandler';

const __dirname = getDirnameFromURL(import.meta.url);

async function loadCommands() {
    const commands = await importAllDefault<DiscordCommandHandler>(`${__dirname}/commands`);
    return commands.map(x => x.data.toJSON());
}

async function registerCommands(global: boolean = false) {
    const commands = await loadCommands();
    const rest = new REST({ version: '9' }).setToken(token);

    if (global) {
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
    } else {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    }
    console.log('Successfully registered application commands.');
}

process.on('uncaughtException', error => {
	console.error('Unhandled exception: ', error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection: ', error);
});

const global = Process.argv[2] === 'global';
registerCommands(global);
