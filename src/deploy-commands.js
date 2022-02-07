import fs from 'node:fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId, token } from './config.js';
import { getDirnameFromURL } from './common/file.js';

const __dirname = getDirnameFromURL(import.meta.url);

async function loadCommands() {
	const commands = [];
	const commandFiles = fs.readdirSync(
		`${__dirname}/commands`).filter(file => file.endsWith('.js')
	);
	for (const file of commandFiles) {
		const command = (await import(`./commands/${file}`)).default;
		commands.push(command.data.toJSON());
	}
	return commands;
}

async function registerCommands() {
	const commands = await loadCommands();
	const rest = new REST({ version: '9' }).setToken(token);

	rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
}

registerCommands();
