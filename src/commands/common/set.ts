import { SlashCommandBuilder } from 'discord.js';
import ICommand from '../../interfaces/ICommand';
import { setGreeting } from '../../db/greetings';

const join: ICommand = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Tùy chỉnh câu chào của Anh Google')
        .addStringOption((option) => option.setName('message').setDescription('Câu chào mới').setRequired(true)),

    execute: async (interaction) => {
        try {
            if (!interaction.isChatInputCommand()) return;
            const { user, guild, options } = interaction;
            if (!guild) {
                return;
            }

            await interaction.deferReply();

            const message = options.getString('message');
            if (message) {
                await Promise.all([
                    setGreeting(guild.id, user.id, message),
                    await interaction.editReply(`Câu chào của bạn đã được cập nhật thành: "${message}"`),
                ]);
            }
        } catch (err) {
            await interaction.followUp('Đã xảy ra lỗi khi đặt câu chào.');
            console.log(err);
        }
    },
};

export default join;
