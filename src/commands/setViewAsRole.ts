import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import { PERMISSIONS_THREAD_COMMANDS } from '../common/constants.js';
import { assertInGuild, assertInTextChannel, assertPerms } from '../common/discord.js';
import { setViewAsRole } from '../database/database.js';
import { onThreadsUpdated } from '../messageWriter.js';
import { DiscordCommandHandler } from '../types/discordCommandHandler';

async function execute(interaction: BaseCommandInteraction) {
    const i = interaction;
    const options = i.options as CommandInteractionOptionResolver;

    if (!await assertInGuild(i)) return;
    if (!await assertInTextChannel(i)) return;
    if (!await assertPerms(i, PERMISSIONS_THREAD_COMMANDS)) return;

    await i.deferReply({ ephemeral: true });

    const role = options.getRole('role');
    await setViewAsRole(i.guildId!, role?.id || null);
    await onThreadsUpdated(i.client, i.guild!);

    const roleString = (role) ? `<@${role?.id}>` : '@everyone';
    await i.editReply({
        content: `Set view-as role to ${roleString}`
    });
}

export default <DiscordCommandHandler>{
    data: new SlashCommandBuilder()
        .setName('set-view-as-role')
        .setDescription(
            'Set the role which will be used to determine whether a thread ' +
            'should be visible.'
        )
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to view threads as. (default=@everyone)')
                .setRequired(false)
        ),
    execute
};
