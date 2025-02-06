import { protos } from '@google-cloud/text-to-speech';
import { db } from '../utils/firestore';

export async function getSettings(guildId: string): Promise<protos.google.cloud.texttospeech.v1.IVoiceSelectionParams> {
    const docRef = db.collection('settings').doc(`${guildId}`);
    const doc = await docRef.get();

    const defaultVoice: protos.google.cloud.texttospeech.v1.IVoiceSelectionParams = {
        languageCode: 'vi-VN',
        name: 'vi-VN-Wavenet-D',
        ssmlGender: 'NEUTRAL',
    };

    if (doc.exists) {
        return doc.data() || defaultVoice;
    } else {
        return defaultVoice;
    }
}

export async function setSettings(
    guildId: string,
    settings: protos.google.cloud.texttospeech.v1.IVoiceSelectionParams,
): Promise<void> {
    const docRef = db.collection('settings').doc(`${guildId}`);
    await docRef.set({ ...settings }, { merge: true });
}
