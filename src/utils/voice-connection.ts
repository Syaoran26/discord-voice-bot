import {
    entersState,
    getVoiceConnection,
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import { Guild, VoiceBasedChannel } from 'discord.js';

export const getConnection = async (
    guild: Guild,
    channel?: VoiceBasedChannel,
    reconnect = false,
): Promise<VoiceConnection | null> => {
    if (!reconnect) {
        const existingConnection = getVoiceConnection(guild.id);
        if (existingConnection) {
            return existingConnection;
        } else if (!channel) {
            return null;
        }
    }

    if (!channel) return null;

    const connection = joinVoiceChannel({
        channelId: channel?.id,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
    } catch (error) {
        console.error(error);
        connection.destroy();
    }

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
        } catch (error) {
            connection.destroy();
        }
    });

    return connection;
};
