import { Client, GatewayIntentBits } from 'discord.js';
import { config } from './config';
import { loadCommands, loadEvents } from './utils/loader';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

// client.commands = new Collection();
loadEvents(client);
loadCommands();

client.once('ready', () => {
    console.log('Discord bot is ready! 🤖');
});

client.login(config.DISCORD_TOKEN);
