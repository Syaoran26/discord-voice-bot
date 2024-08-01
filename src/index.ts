import { Client, GatewayIntentBits } from 'discord.js';
import config from './config';

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log('Anh Google đã sẵn sàng!');
});

client.login(config.DISCORD_TOKEN);
