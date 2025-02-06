import { SlashCommandBuilder } from 'discord.js';
import ICommand from '../../interfaces/ICommand';
import { setSettings } from '../../db/settings';
import { protos } from '@google-cloud/text-to-speech';

const config: ICommand = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Thay đổi cài đặt giọng nói của server')
        .addStringOption((option) =>
            option.setName('language').setDescription('Mã ngôn ngữ (ví dụ: vi-VN, en-US)').setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('voice')
                .setDescription(
                    'Tên giọng đọc với cấu trúc "ngôn_ngữ-VÙNG-Wavenet/Standard-X" (ví dụ: vi-VN-Wavenet-D)',
                )
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('gender')
                .setDescription('Giới tính giọng đọc')
                .setRequired(true)
                .addChoices(
                    { name: 'Nam', value: 'MALE' },
                    { name: 'Nữ', value: 'FEMALE' },
                    { name: 'Trung tính', value: 'NEUTRAL' },
                    { name: 'Không xác định', value: 'SSML_VOICE_GENDER_UNSPECIFIED' },
                ),
        ),

    execute: async (interaction) => {
        try {
            if (!interaction.isChatInputCommand()) return;

            const { member, guild, options } = interaction;

            if (!member || !guild) {
                return;
            }

            await interaction.deferReply();

            const language = options.getString('language');
            const voice = options.getString('voice');
            const gender = options.getString('gender');

            if (language && voice && gender) {
                await Promise.all([
                    setSettings(guild.id, {
                        languageCode: language,
                        name: voice,
                        ssmlGender: gender as unknown as protos.google.cloud.texttospeech.v1.SsmlVoiceGender,
                    }),
                    interaction.editReply(`✅ **Cài đặt Anh Google đã được cập nhật**  
                - Ngôn ngữ: \`${language}\`  
                - Giọng đọc: \`${voice}\`  
                - Giới tính: \`${gender}\``),
                ]);
            }
        } catch (err) {
            await interaction.followUp('Đã xảy ra lỗi khi đặt câu chào.');
            console.log(err);
        }
    },
};

export default config;
