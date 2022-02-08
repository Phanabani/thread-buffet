import fs from 'node:fs';
import path from 'node:path';

export async function importAllDefault(directory) {
	const commands = [];
	const commandFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js')
	);
	for (const file of commandFiles) {
		const importPath = path.join(directory, file);
		const command = (await import(`file://${importPath}`));
		commands.push(command.default);
	}
	return commands;
}
