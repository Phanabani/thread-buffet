import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types';
import { BaseCommandInteraction, CommandInteractionOptionResolver, TextBasedChannel, TextChannel } from 'discord.js';
import { PERMISSIONS_THREAD_COMMANDS } from '../common/constants.js';
import { assertPerms } from '../common/discord.js';
import { setThreadChannel } from '../database/database.js';
import { DiscordCommandHandler } from '../types/discordCommandHandler';

async function execute(interaction: BaseCommandInteraction) {
    const i = interaction;
    const options = i.options as CommandInteractionOptionResolver;

    if (!await assertPerms(i, PERMISSIONS_THREAD_COMMANDS)) return;

    const channel = (options.getChannel('channel') || i.channel) as TextChannel;
    await setThreadChannel(i.guildId!, channel.id);

    await i.reply({
        content: `Set thread channel to <#${channel.id}>`,
        ephemeral: true
    });
}

export default <DiscordCommandHandler>{
    data: new SlashCommandBuilder()
        .setName('set-thread-channel')
        .setDescription('Set the channel where active threads will be shared.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to write active threads in.')
                .setRequired(false)
                .addChannelType(ChannelType.GuildText)
        ),
    execute
};
