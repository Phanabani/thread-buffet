import * as fs from 'node:fs';
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

export function getDirnameFromURL(url: string): string {
    return path.dirname(fileURLToPath(url));
}

export function readJson(...paths: string[]) {
    const file = path.join(...paths);
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}
