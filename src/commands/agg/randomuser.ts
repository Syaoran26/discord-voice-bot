import { SlashCommandBuilder, VoiceBasedChannel } from 'discord.js';
import { CommandInteraction } from 'discord.js';

function getRandomUserInVoiceChannel(voiceChannel: VoiceBasedChannel): string | null {
    const members = Array.from(voiceChannel.members.values()).filter((member) => !member.user.bot);
    if (members.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * members.length);
    const randomMember = Array.from(members.values())[randomIndex];
    return randomMember.id;
}

const randomUserCommand = {
    data: new SlashCommandBuilder().setName('randomuser').setDescription('Chọn ngẫu nhiên một người trong phòng thoại'),

    execute: async (interaction: CommandInteraction): Promise<void> => {
        try {
            if (!interaction.isCommand()) return;

            const { member } = interaction;

            if (!member || !('voice' in member) || !member.voice.channel) {
                await interaction.reply('Bạn cần phải ở trong phòng thoại để sử dụng lệnh này.');
                return;
            }

            const voiceChannel = member.voice.channel;
            const members = Array.from(voiceChannel.members.values()).filter((member) => !member.user.bot);
            if (members.length === 0) {
                await interaction.reply('Hiện tại không có ai trong phòng thoại.');
                return;
            }

            await interaction.deferReply();

            // Tạo hiệu ứng quay số
            const rollEffect = async () => {
                for (let i = 0; i < 20; i++) {
                    // Quay số 5 lần
                    const randomMember = members[Math.floor(Math.random() * members.length)];
                    await interaction.editReply(`Đang chọn... 🎲 <@${randomMember.id}>`);
                    await new Promise((resolve) => setTimeout(resolve, 200));
                }
            };

            await rollEffect();

            const randomUserId = getRandomUserInVoiceChannel(voiceChannel);

            if (randomUserId) {
                await interaction.editReply(`Người được chọn ngẫu nhiên là: <@${randomUserId}> 🎉`);
            } else {
                await interaction.editReply('Hiện tại không có ai trong phòng thoại.');
            }
        } catch (err) {
            console.error(err);
            await interaction.editReply('Đã xảy ra lỗi khi xử lý lệnh.');
        }
    },
};

export default randomUserCommand;
