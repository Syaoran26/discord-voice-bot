import { ChannelType, SlashCommandBuilder } from 'discord.js';
import ICommand from '../../interfaces/ICommand';
import { getConnection } from '../../utils/voice-connection';

const join: ICommand = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Anh Google tới chơi')
        .addChannelOption((builder) =>
            builder
                .setName('channel')
                .setDescription('Chọn kênh cho anh vào quẩy')
                .addChannelTypes(ChannelType.GuildVoice),
        ),

    execute: async (interaction) => {
        try {
            if (!interaction.isChatInputCommand()) return;
            const { member, guild, options } = interaction;
            if (!member || !guild || !('voice' in member)) {
                return;
            }

            const voiceChannel = options.getChannel('channel', false, [ChannelType.GuildVoice]) || member.voice.channel;

            if (!voiceChannel) {
                await interaction.reply('Bạn cần ở trong một kênh thoại hoặc chọn kênh thoại để thực hiện lệnh này.');
                return;
            }

            await getConnection(guild, voiceChannel, true);

            await interaction.reply(`Anh Google tới chơi kênh thoại <#${voiceChannel.id}>`);
        } catch (err) {
            console.log(err);
        }
    },
};

export default join;
