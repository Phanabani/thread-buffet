import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export function getDirnameFromURL(url) {
    return dirname(fileURLToPath(url));
}
