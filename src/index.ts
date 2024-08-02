import { Client, GatewayIntentBits } from 'discord.js';
import config from './config';
import { loadCommands, loadEvents } from './utils';

export const client = new Client<true>({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

loadCommands();
loadEvents(client);

client.login(config.DISCORD_TOKEN);
