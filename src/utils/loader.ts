import { Client, REST, Routes } from 'discord.js';
import config from '../config';
import * as commandModules from '../commands';
import * as eventModules from '../events';
import IEvent from '../interfaces/IEvent';
import ICommand from '../interfaces/ICommand';

export const loadCommands = async () => {
    const commands = [];

    for (const module of Object.values<ICommand>(commandModules)) {
        commands.push(module.data);
    }

    const rest = new REST({ version: '9' }).setToken(config.DISCORD_TOKEN);
    const user = await rest.get(Routes.user());
    rest.put(Routes.applicationCommands((user as any)?.id), {
        body: commands,
    })
        .then(() => console.log('Upload commands successfully'))
        .catch((err) => console.log('Upload commands fail', err));
};

export const loadEvents = async (client: Client<true>) => {
    for (const event of Object.values<IEvent<any>>(eventModules)) {
        client[event.once ? 'once' : 'on'](event.name, event.execute);
    }
};
