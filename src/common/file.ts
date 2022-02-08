import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export function getDirnameFromURL(url: string): string {
    return dirname(fileURLToPath(url));
}
