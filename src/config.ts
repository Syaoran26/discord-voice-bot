import dotenv from 'dotenv';

dotenv.config();

const { DISCORD_TOKEN, CLIENT_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
    throw new Error('Missing environment variables');
}

const config = {
    DISCORD_TOKEN,
    CLIENT_ID,
};

export default config;
