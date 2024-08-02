import { CommandInteraction } from 'discord.js';

interface ICommand {
    data: any;
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export default ICommand;
