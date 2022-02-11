import { Snowflake } from 'discord.js';
import { JSONFile, Low } from 'lowdb';
import * as path from 'node:path';
import { getDirnameFromURL } from '../common/file.js';

const __dirname = getDirnameFromURL(import.meta.url);

interface Model {
    guilds: {
        [guildId: Snowflake]: {
            threadChannel: Snowflake | null;
            threadMessage: Snowflake | null;
            viewAsRole: Snowflake | null;
        }
    };
}

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile<Model>(file);
const db = new Low<Model>(adapter);

async function initDatabase(): Promise<void> {
    await db.read();
    // If db.json doesn't exist, db.data will be null
    db.data ||= { guilds: {} };
    await db.write();
}

initDatabase().catch((e) => console.error(`Uncaught in initDatabase: ${e}`));

async function tryAddGuild(guildId: Snowflake): Promise<void> {
    if (db.data === null) await initDatabase();
    if (db.data!.guilds.hasOwnProperty(guildId)) return;
    db.data!.guilds[guildId] = {
        threadChannel: null, threadMessage: null, viewAsRole: null
    };
    await db.write();
}

export async function getThreadChannel(guildId: Snowflake): Promise<Snowflake | null> {
    await tryAddGuild(guildId);
    return db.data!.guilds[guildId]!.threadChannel;
}

export async function setThreadChannel(
    guildId: Snowflake, channelId: Snowflake | null
): Promise<void> {
    await tryAddGuild(guildId);
    db.data!.guilds[guildId]!.threadChannel = channelId;
    await db.write();
}

export async function getThreadMessage(guildId: Snowflake): Promise<Snowflake | null> {
    await tryAddGuild(guildId);
    return db.data!.guilds[guildId]!.threadMessage;
}

export async function setThreadMessage(
    guildId: Snowflake, msgId: Snowflake | null
): Promise<void> {
    await tryAddGuild(guildId);
    db.data!.guilds[guildId]!.threadMessage = msgId;
    await db.write();
}

export async function getViewAsRole(guildId: Snowflake): Promise<Snowflake | null> {
    await tryAddGuild(guildId);
    return db.data!.guilds[guildId]!.viewAsRole;
}

export async function setViewAsRole(
    guildId: Snowflake, role: Snowflake | null
): Promise<void> {
    await tryAddGuild(guildId);
    db.data!.guilds[guildId]!.viewAsRole = role;
    await db.write();
}
