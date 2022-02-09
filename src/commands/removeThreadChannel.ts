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

    if (!await assertInGuild(i)) return;
    if (!await assertInTextChannel(i)) return;
    if (!await assertPerms(i, PERMISSIONS_THREAD_COMMANDS)) return;

    await i.deferReply({ ephemeral: true });

    await onThreadChannelWillChange(i.client, i.guild!);
    await setThreadChannel(i.guildId!, null);
    await onThreadChannelDidChange(i.client, i.guild!);

    await i.editReply({
        content: `Removed the previously set thread channel`
    });
}

export default <DiscordCommandHandler>{
    data: new SlashCommandBuilder()
        .setName('remove-thread-channel')
        .setDescription(
            'Remove the previously set channel where active threads were ' +
            'shared (does not delete the channel).'
        ),
    execute
};
