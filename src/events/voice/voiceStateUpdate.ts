import config from '../../config';
import IEvent from '../../interfaces/IEvent';
import { getConnection } from '../../utils/voice-connection';
import { VoiceConnection } from '@discordjs/voice';

const voiceStateUpdate: IEvent<'voiceStateUpdate'> = {
    name: 'voiceStateUpdate',
    once: false,

    execute: async (oldState, newState) => {
        let connection: VoiceConnection | null;

        const { guild, channel, member } = newState;

        //  Kiểm tra không phải là bot
        if (!guild || !member || member.user.bot) {
            return;
        }
        const _this = guild.members.cache.get(config.CLIENT_ID);
        if (!_this) return;

        if (channel) {
            connection = await getConnection(guild);

            if (!connection) {
                connection = await getConnection(guild, channel);
                console.log('Anh Google tới chơi đây!');
            }

            // Kiểm tra người chơi có vào kênh mà Anh Google đang join không
            if (_this.voice.channel === channel) {
                const user = guild.members.cache.get(member.user.id);
                console.log(`Hello ${user?.nickname || member.user.globalName}`);
            }
        } else {
            if (_this.voice.channel === oldState.channel) {
                let content = '';
                if (member.user.id === config.TAMMINH_ID) {
                    content = 'À con chó Tâm Minh đây rồi';
                } else {
                    const user = guild.members.cache.get(member.user.id);
                    content = `Bái bai ${user?.nickname || member.user.globalName}`;
                }
                console.log(content);
            }
        }
    },
};

export default voiceStateUpdate;
