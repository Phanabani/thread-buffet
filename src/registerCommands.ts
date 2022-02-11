import { REST } from '@discordjs/rest';
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord-api-types/v9';
import * as Process from 'node:process';
import { importAllDefault } from './common/dynamicImport.js';
import { getDirnameFromURL, readJson } from './common/file.js';
import { ConfigFile } from './types/configFile.js';
import { DiscordCommandHandler } from './types/discordCommandHandler';

const __dirname = getDirnameFromURL(import.meta.url);

async function loadCommands() {
    const commands = await importAllDefault<DiscordCommandHandler>(`${__dirname}/commands`);
    return commands.map(x => x.data.toJSON());
}

async function registerCommands(global: boolean = false, unregister: boolean = false) {
    const config = <ConfigFile>readJson(__dirname, 'config.json');
    let commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
    if (!unregister) {
        commands = await loadCommands();
    }
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
    if (unregister) {
        console.log('Successfully unregistered application commands.');
    } else {
        console.log('Successfully registered application commands.');
    }
}

process.on('uncaughtException', error => {
	console.error('Unhandled exception: ', error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection: ', error);
});

const global = Process.argv.includes('global');
const unregister = Process.argv.includes('unregister');
registerCommands(global, unregister);
