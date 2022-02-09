import { BaseCommandInteraction } from 'discord.js';

export async function assertInGuild(
    interaction: BaseCommandInteraction
): Promise<boolean> {
    const i = interaction;
    if (i.guild) return true;
    await i.reply({
        content: 'This is a server-only command.', ephemeral: true
    });
    return false;
}

export async function assertPerms(
    interaction: BaseCommandInteraction, permissions: bigint
): Promise<boolean> {
    const i = interaction;
    if (i.memberPermissions === null) {
        await i.reply({
            content: 'Unable to get your permissions.', ephemeral: true
        });
        return false;
    }
    if (!i.memberPermissions.has(permissions)) {
        await i.reply({
            content: 'Insufficient permissions.', ephemeral: true
        });
        return false;
    }
    return true;
}
