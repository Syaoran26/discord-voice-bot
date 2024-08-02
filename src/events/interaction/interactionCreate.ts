import IEvent from '../../interfaces/IEvent';
import * as commandModules from '../../commands';

const commands = Object(commandModules);

const interactionCreate: IEvent<'interactionCreate'> = {
    name: 'interactionCreate',
    once: false,

    execute: (interaction) => {
        if (!interaction.isCommand()) {
            return;
        }
        const { commandName } = interaction;
        commands[commandName].execute(interaction);
    },
};

export default interactionCreate;
