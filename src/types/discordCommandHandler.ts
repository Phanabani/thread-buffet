import { BaseCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export interface DiscordCommandHandler {
    data: SlashCommandBuilder;
    execute: (interaction: BaseCommandInteraction) => Promise<void>;
}
