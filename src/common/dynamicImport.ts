import * as fs from 'node:fs';
import * as path from 'node:path';

export async function importAllDefault<ImportType>(directory): Promise<ImportType[]> {
    const commands: ImportType[] = [];
    const commandFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js')
    );
    for (const file of commandFiles) {
        const importPath = path.join(directory, file);
        const command = (await import(`file://${importPath}`));
        commands.push((command.default as ImportType));
    }
    return commands;
}
