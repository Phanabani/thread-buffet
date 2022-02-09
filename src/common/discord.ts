import { BaseCommandInteraction } from 'discord.js';

export async function checkPerms(
    interaction: BaseCommandInteraction, permissions: bigint
): Promise<boolean> {
    const i = interaction;
    if (i.guildId === null || i.memberPermissions === null) {
        await i.reply({
            content: 'This is a server-only command.', ephemeral: true
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
