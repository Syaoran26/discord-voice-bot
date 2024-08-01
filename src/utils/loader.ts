import { readdir } from 'fs/promises';
import { Client, Collection, REST, Routes } from 'discord.js';
import { config } from '../config';

const commandCollection = new Collection<string, any>();

const srcDir = process.env.NODE_ENV === 'development' ? 'src' : 'dist';
const fileExtension = process.env.NODE_ENV === 'development' ? '.ts' : '.js';

async function loadFiles(directory: string, extension: string) {
    const dirs = (await readdir(directory, { withFileTypes: true })).filter((target) => target.isDirectory());
    const files = [];

    for (const dir of dirs) {
        const dirFiles = (await readdir(`${directory}/${dir.name}`, { withFileTypes: true })).filter(
            (target) => target.isFile() && target.name.endsWith(extension),
        );
        files.push(...dirFiles.map((file) => `${directory}/${dir.name}/${file.name}`));
    }

    return files;
}

async function loadEventFiles(client: Client, files: string[]) {
    for (const file of files) {
        try {
            const { default: event } = await import(file);
            client[event.once ? 'once' : 'on'](event.name, event.execute);
        } catch (error) {
            console.error(`Failed to load event file: ${file}`, error);
        }
    }
}

async function loadCommandFiles(files: string[]) {
    for (const file of files) {
        try {
            const { default: command } = await import(file);
            command.applicationCommands = [];
            command.register?.(command.applicationCommands);
            commandCollection.set(command.name, command);
        } catch (error) {
            console.error(`Failed to load command file: ${file}`, error);
        }
    }
}

async function registerCommands() {
    const commands = commandCollection.map((command) => command.applicationCommands).flat();
    const rest = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

    try {
        const user = await rest.get(Routes.user());
        await rest.put(Routes.applicationCommands((user as any).id), { body: commands });
    } catch (error) {
        console.error('Failed to register commands:', error);
    }
}

export async function loadEvents(client: Client) {
    const eventFiles = await loadFiles(`${srcDir}/events`, fileExtension);
    await loadEventFiles(client, eventFiles);
}

export async function loadCommands() {
    const commandFiles = await loadFiles(`${srcDir}/commands`, fileExtension);
    await loadCommandFiles(commandFiles);
    await registerCommands();
}

console.log(srcDir, fileExtension);
