import {
    createAudioPlayer,
    createAudioResource,
    entersState,
    getVoiceConnection,
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import { Guild, VoiceBasedChannel } from 'discord.js';
import { protos, TextToSpeechClient } from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';

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
        } catch {
            connection.destroy();
        }
    });

    return connection;
};

export const textToSpeech = async (text: string, outputFile: string) => {
    const client = new TextToSpeechClient();
    const audioPath = path.join(__dirname, '..', 'audio');

    if (!fs.existsSync(audioPath)) {
        fs.mkdirSync(audioPath);
    }

    const badWords: { [key: string]: string } = {
        cặc: 'chim',
        lồn: 'bướm',
        đụ: 'quan hệ',
        mạ: 'mẫu hậu',
        mẹ: 'mẫu thân',
        má: 'mẫu hậu',
    };

    const regexString = Object.keys(badWords).join('|');
    const regex = new RegExp(regexString, 'g');

    text = text.replace(regex, (match) => {
        return badWords[match];
    });

    const output = path.join(audioPath, outputFile);

    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
        input: { text },
        voice: { languageCode: 'vi-VN', name: 'vi-VN-Wavenet-D', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    if (response.audioContent) {
        fs.writeFileSync(output, response.audioContent, 'binary');
    }
    return output;
};

export const speak = async (connection: VoiceConnection | null, audio: string) => {
    if (!connection) return;

    const audioPlayer = createAudioPlayer();
    const subscription = connection.subscribe(audioPlayer);
    if (subscription) {
        const audioResource = createAudioResource(audio);
        audioPlayer.play(audioResource);
    }
};
