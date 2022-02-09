import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType } from 'discord-api-types';
import { BaseCommandInteraction, CommandInteractionOptionResolver, TextBasedChannel } from 'discord.js';
import { PERMISSIONS_THREAD_COMMANDS } from '../common/constants.js';
import { assertInGuild, assertInTextChannel, assertPerms } from '../common/discord.js';
import { setThreadChannel } from '../database/database.js';
import { onThreadChannelDidChange, onThreadChannelWillChange } from '../messageWriter.js';
import { DiscordCommandHandler } from '../types/discordCommandHandler';

async function execute(interaction: BaseCommandInteraction) {
    const i = interaction;
    const options = i.options as CommandInteractionOptionResolver;

    if (!await assertInGuild(i)) return;
    if (!await assertInTextChannel(i)) return;
    if (!await assertPerms(i, PERMISSIONS_THREAD_COMMANDS)) return;

    await i.deferReply({ ephemeral: true });

    await onThreadChannelWillChange(i.client, i.guild!);
    const channel = <TextBasedChannel | null>options.getChannel('channel') || i.channel;
    await setThreadChannel(i.guildId!, channel!.id);
    await onThreadChannelDidChange(i.client, i.guild!);

    await i.editReply({
        content: `Set thread channel to <#${channel!.id}>`
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
