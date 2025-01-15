import admin from 'firebase-admin';
import config from '../config';

const serviceAccount = require(`../../${config.GOOGLE_APPLICATION_CREDENTIALS}`);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://tactical-runway-409806.firebaseio.com',
});

const db = admin.firestore();

export { db };
