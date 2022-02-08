import { BaseCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { DiscordCommandHandler } from '../types/discordCommandHandler';

export default <DiscordCommandHandler>{
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping the bot.'),
    async execute(interaction: BaseCommandInteraction) {
        await interaction.reply('Pong!');
    },
};
