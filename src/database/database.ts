import * as path from 'node:path';
import { Low, JSONFile } from 'lowdb';
import { getDirnameFromURL } from '../common/file.js';

const __dirname = getDirnameFromURL(import.meta.url);

interface Model {
    guilds: {
        [guildId: string]: {
            threadChannel: string | null;
            threadMessage: string | null;
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

async function tryAddGuild(guildId: string): Promise<void> {
    if (db.data === null) await initDatabase();
    if (db.data!.guilds.hasOwnProperty(guildId)) return;
    db.data!.guilds[guildId] = {
        threadChannel: null, threadMessage: null
    };
    await db.write();
}

export async function getThreadChannel(guildId: string): Promise<string | null> {
    await tryAddGuild(guildId);
    return db.data!.guilds[guildId]!.threadChannel;
}

export async function setThreadChannel(guildId: string, channelId: string): Promise<void> {
    await tryAddGuild(guildId);
    db.data!.guilds[guildId]!.threadChannel = channelId;
    await db.write();
}

export async function getThreadMessage(guildId: string): Promise<string | null> {
    await tryAddGuild(guildId);
    return db.data!.guilds[guildId]!.threadMessage;
}

export async function setThreadMessage(guildId: string, msgId: string): Promise<void> {
    await tryAddGuild(guildId);
    db.data!.guilds[guildId]!.threadMessage = msgId;
    await db.write();
}
