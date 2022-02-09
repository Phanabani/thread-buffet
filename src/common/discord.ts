import { AnyChannel, BaseCommandInteraction, Client, Message, Snowflake } from 'discord.js';

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

export async function assertInTextChannel(
    interaction: BaseCommandInteraction
): Promise<boolean> {
    const i = interaction;
    if (i.channel) return true;
    await i.reply({
        content: 'This command must be run in a text channel.', ephemeral: true
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

export async function fetchChannel(
    client: Client, channelId: Snowflake
): Promise<AnyChannel | null> {
    let channel: AnyChannel | null | undefined = client.channels.cache.get(channelId);
    if (!channel) {
        // We couldn't get a cached channel, so try to fetch it
        channel = await client.channels.fetch(channelId);
        if (!channel) return null;
    }
    return channel;
}

export async function fetchMessage(
    client: Client, channelId: Snowflake, msgId: Snowflake
): Promise<Message | null> {
    if (!(channelId && msgId)) return null;
    const channel = await fetchChannel(client, channelId);
    if (!(channel && channel.isText())) return null;
    return await channel.messages.fetch(msgId)
}
