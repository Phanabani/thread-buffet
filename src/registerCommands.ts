import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId, token } from './config.js';
import { importAllDefault } from './common/dynamicImport.js';
import { getDirnameFromURL } from './common/file.js';

const __dirname = getDirnameFromURL(import.meta.url);

async function loadCommands() {
	const commands = await importAllDefault(`${__dirname}/commands`);
	return commands.map(x => x.data.toJSON());
}

async function registerCommands() {
	const commands = await loadCommands();
	const rest = new REST({ version: '9' }).setToken(token);

	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
}

registerCommands().catch((e) => console.error(`Uncaught in registerCommands: ${e}`));
