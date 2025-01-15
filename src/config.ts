import dotenv from 'dotenv';

dotenv.config();

const { DISCORD_TOKEN, CLIENT_ID, GOOGLE_APPLICATION_CREDENTIALS, MY_ID, TAMMINH_ID, OPENAI_API_KEY } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GOOGLE_APPLICATION_CREDENTIALS || !MY_ID || !TAMMINH_ID || !OPENAI_API_KEY) {
    throw new Error('Missing environment variables');
}

const config = {
    DISCORD_TOKEN,
    CLIENT_ID,
    GOOGLE_APPLICATION_CREDENTIALS,
    MY_ID,
    TAMMINH_ID,
    OPENAI_API_KEY,
};

export default config;
