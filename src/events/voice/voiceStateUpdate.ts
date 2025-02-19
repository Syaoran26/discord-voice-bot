import config from '../../config';
import { getGreeting } from '../../db/greetings';
import IEvent from '../../interfaces/IEvent';
import { getConnection, speak, textToSpeech } from '../../utils/voice-connection';
import { VoiceConnection } from '@discordjs/voice';

let disconnectTimeout: NodeJS.Timeout | null;

const voiceStateUpdate: IEvent<'voiceStateUpdate'> = {
    name: 'voiceStateUpdate',
    once: false,

    execute: async (oldState, newState) => {
        let connection: VoiceConnection | null;

        const { guild, channel, member } = newState;

        //  Kiểm tra không phải là bot
        if (!guild || !member || member.user.bot || oldState.channel === channel) {
            return;
        }
        const _this = guild.members.cache.get(config.CLIENT_ID);
        if (!_this) return;

        if (channel) {
            connection = await getConnection(guild);

            if (!connection) {
                connection = await getConnection(guild, channel);
                await speak(connection, 'dist/audio/welcome.mp3');
            }

            // Kiểm tra người chơi có vào kênh mà Anh Google đang join không
            if (_this.voice.channel === channel) {
                const user = guild.members.cache.get(member.user.id);
                const content =
                    (await getGreeting(guild.id, member.user.id)) ||
                    `Hello ${user?.nickname || member.user.globalName}`;

                const output = await textToSpeech(content, 'hello.mp3');

                setTimeout(async () => {
                    await speak(connection, output);
                }, 1_500);

                // Clear timeout khi có người mới vào
                if (disconnectTimeout) {
                    clearTimeout(disconnectTimeout);
                    disconnectTimeout = null;
                }
            }
        } else {
            if (_this.voice.channel === oldState.channel) {
                connection = await getConnection(guild);
                let content = '';

                const user = guild.members.cache.get(member.user.id);
                content = `Bái bai ${user?.nickname || member.user.globalName}`;
                const output = await textToSpeech(content, 'goodbye.mp3');
                await speak(connection, output);

                // Tự động tắt kênh thoại khi chưa có người nào đang join nữa
                if (_this.voice.channel?.members.filter((member) => !member.user.bot).size === 0) {
                    disconnectTimeout = setTimeout(() => {
                        connection?.destroy();
                        disconnectTimeout = null;
                    }, 3_000);
                }
            }
        }
    },
};

export default voiceStateUpdate;
