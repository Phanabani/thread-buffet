import { Client, Collection, Intents } from 'discord.js';
import { token } from './config.js';
import { importAllDefault } from './common/dynamicImport.js';
import { getDirnameFromURL } from './common/file.js';
import { DiscordCommandHandler } from './types/discordCommandHandler';
import { DiscordEventHandler } from './types/discordEventHandler';

const __dirname = getDirnameFromURL(import.meta.url);

interface ClientWithCommands extends Client {
	commands: Collection<string, DiscordCommandHandler>;
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

async function loadCommands() {
	(client as ClientWithCommands).commands = new Collection();
	const commands = await importAllDefault<DiscordCommandHandler>(`${__dirname}/commands`);
	for (const command of commands) {
		(client as ClientWithCommands).commands.set(command.data.name, command);
	}
}

async function loadEvents() {
	const events = await importAllDefault<DiscordEventHandler<any>>(`${__dirname}/events`);
	for (const event of events) {
		if (event.once) {
			// @ts-ignore
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			// @ts-ignore
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = (client as ClientWithCommands).commands.get(interaction.commandName);
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
