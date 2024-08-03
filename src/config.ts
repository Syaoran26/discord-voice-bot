import dotenv from 'dotenv';

dotenv.config();

const { DISCORD_TOKEN, CLIENT_ID, GOOGLE_APPLICATION_CREDENTIALS, MY_ID, TAMMINH_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GOOGLE_APPLICATION_CREDENTIALS || !MY_ID || !TAMMINH_ID) {
    throw new Error('Missing environment variables');
}

const config = {
    DISCORD_TOKEN,
    CLIENT_ID,
    GOOGLE_APPLICATION_CREDENTIALS,
    MY_ID,
    TAMMINH_ID,
};

export default config;
