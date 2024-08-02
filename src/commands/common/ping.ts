import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import ICommand from '../../interfaces/ICommand';

const ping: ICommand = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Kiểm tra độ trễ của Anh Google'),

    execute: async (interaction) => {
        interaction.reply(`Pong! Ping của Anh Google là ${interaction.client.ws.ping}`);
    },
};

export default ping;
