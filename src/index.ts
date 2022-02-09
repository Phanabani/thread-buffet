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
            client.once(event.name, async (...args) => await event.execute(...args));
        } else {
            // @ts-ignore
            client.on(event.name, async (...args) => await event.execute(...args));
        }
    }
}

process.on('uncaughtException', error => {
	console.error('Unhandled exception: ', error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection: ', error);
});

client.on('error', error => {
	console.error('The client encountered an error:', error);
});

client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
});

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

main();
