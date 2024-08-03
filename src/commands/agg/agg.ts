import { SlashCommandBuilder, VoiceChannel } from 'discord.js';
import ICommand from '../../interfaces/ICommand';
import { getConnection, speak, textToSpeech } from '../../utils/voice-connection';

const agg: ICommand = {
    data: new SlashCommandBuilder()
        .setName('agg')
        .setDescription('Anh Google sẽ nói gì đó')
        .addStringOption((builder) =>
            builder.setName('content').setDescription('Nội dung anh sẽ nói').setRequired(true),
        ),

    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const { member, guild, options } = interaction;

        if (!member || !guild || !('voice' in member) || !member.voice.channel) {
            await interaction.reply('Bạn chưa tham gia kênh thoại nào!');
            return;
        }

        const voiceChannel = member.voice.channel;

        const connection = await getConnection(guild, voiceChannel);
        const content = options.getString('content');

        if (connection && content) {
            const output = await textToSpeech(content, 'custom.mp3');
            Promise.all([await interaction.reply(`Anh Google nói: ${content}`), await speak(connection, output)]);
        } else {
            await interaction.reply(`Đã có lỗi xảy ra`);
        }
    },
};

export default agg;
