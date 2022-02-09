import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as Process from 'node:process';
import { importAllDefault } from './common/dynamicImport.js';
import { getDirnameFromURL, readJson } from './common/file.js';
import { Config } from './types/config.js';
import { DiscordCommandHandler } from './types/discordCommandHandler';

const __dirname = getDirnameFromURL(import.meta.url);

async function loadCommands() {
    const commands = await importAllDefault<DiscordCommandHandler>(`${__dirname}/commands`);
    return commands.map(x => x.data.toJSON());
}

async function registerCommands(global: boolean = false) {
    const config = <Config>readJson(__dirname, 'config.json');
    const commands = await loadCommands();
    const rest = new REST({ version: '9' }).setToken(config.token);

    if (global) {
        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands }
        );
    } else {
        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands }
        );
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
