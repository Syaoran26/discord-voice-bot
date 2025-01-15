import { db } from '../utils/firestore';

interface Greeting {
    guildId: string;
    userId: string;
    message: string;
}

// Lấy câu chào từ Firestore
export async function getGreeting(guildId: string, userId: string): Promise<string> {
    const docRef = db.collection('greetings').doc(`${guildId}_${userId}`);
    const doc = await docRef.get();

    if (doc.exists) {
        return doc.data()?.message || '';
    } else {
        return '';
    }
}

// Cập nhật hoặc thêm câu chào mới vào Firestore
export async function setGreeting(guildId: string, userId: string, message: string): Promise<void> {
    const docRef = db.collection('greetings').doc(`${guildId}_${userId}`);
    await docRef.set({ message }, { merge: true });
}
