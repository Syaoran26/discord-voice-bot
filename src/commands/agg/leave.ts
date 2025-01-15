import { SlashCommandBuilder } from 'discord.js';
import ICommand from '../../interfaces/ICommand';
import { getVoiceConnection } from '@discordjs/voice';

const aggLeave: ICommand = {
    data: new SlashCommandBuilder().setName('leave').setDescription('Anh Google cút khỏi phòng'),

    execute: async (interaction) => {
        try {
            const { guild } = interaction;
            if (!guild) return;

            const connection = await getVoiceConnection(guild.id);

            if (connection) {
                await interaction.reply(`Anh Google rời khỏi kênh thoại!`);
                connection.destroy();
                return;
            }
            await interaction.reply('Anh Google chưa được quẩy ở kênh thoại nào!');
        } catch (err) {
            console.log(err);
        }
    },
};

export default aggLeave;
