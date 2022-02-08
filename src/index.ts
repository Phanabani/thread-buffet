import { Client, Collection, Intents } from 'discord.js';
import { token } from './config.js';
import { importAllDefault } from './common/dynamicImport.js';
import { getDirnameFromURL } from './common/file.js';
import { DiscordCommandHandler } from "./types/discordCommandHandler";

const __dirname = getDirnameFromURL(import.meta.url);

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

async function loadCommands() {
	client.commands = new Collection();
	const commands = await importAllDefault<DiscordCommandHandler>(`${__dirname}/commands`);
	for (const command of commands) {
		client.commands.set(command.data.name, command);
	}
}

async function loadEvents() {
	const events = await importAllDefault<DiscordEventHandler<any>>(`${__dirname}/events`);
	for (const event of events) {
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true
		});
	}
});

async function main() {
	await loadCommands();
	await loadEvents();
	await client.login(token);
}

main().catch((e) => console.error(`Uncaught in main: ${e}`));
