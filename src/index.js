import { Client, Collection, Intents } from 'discord.js';
import { token } from './config.js';
import { importAllDefault } from './common/dynamic-import.js';
import { getDirnameFromURL } from './common/file.js';

const __dirname = getDirnameFromURL(import.meta.url);

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

async function loadCommands() {
	client.commands = new Collection();
	const commands = await importAllDefault(`${__dirname}/commands`);
	for (const command of commands) {
		client.commands.set(command.data.name, command);
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
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

async function main() {
	await loadCommands();
	await client.login(token);
}

main().catch((e) => console.error(`Uncaught in main: ${e}`));
