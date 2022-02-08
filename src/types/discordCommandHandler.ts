import { SlashCommandBuilder } from '@discordjs/builders';

export interface DiscordCommandHandler {
    data: SlashCommandBuilder;
    execute: (Interaction) => void;
}
