import { SlashCommandBuilder } from 'discord.js';
import ICommand from '../../interfaces/ICommand';
import { getConnection, speak, textToSpeech } from '../../utils/voice-connection';
import { openai } from '../../utils/openai';

const join: ICommand = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Anh Google thông thái sẽ trả lời')
        .addStringOption((builder) => builder.setName('content').setDescription('Muốn hỏi gì nào').setRequired(true)),

    execute: async (interaction) => {
        try {
            if (!interaction.isChatInputCommand()) return;
            const { member, guild, options } = interaction;
            if (!member || !guild || !('voice' in member)) {
                return;
            }

            const voiceChannel = member.voice.channel;

            const content = options.getString('content');

            await interaction.deferReply();

            // Sử dụng OpenAI để tạo câu trả lời
            const aiResponse = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Bạn là Anh Google Bot của Discord.' },
                    { role: 'user', content: content || '' },
                ],
            });

            const reply = aiResponse.choices[0]?.message?.content || 'Xin lỗi, tôi không có câu trả lời.';
            const promises: Promise<any>[] = [interaction.editReply(reply)];

            if (voiceChannel) {
                const connection = await getConnection(guild, voiceChannel);

                if (connection && reply) {
                    const output = await textToSpeech(reply, 'response.mp3');
                    promises.push(speak(connection, output));
                }
            }

            await Promise.all(promises);
        } catch (err) {
            console.log(err);
        }
    },
};

export default join;
