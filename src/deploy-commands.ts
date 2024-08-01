import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import config from './config';

const commands = [new SlashCommandBuilder().setName('ping').setDescription('Pong')];

const rest = new REST({ version: '9' }).setToken(config.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, '1189904463092252692'), {
    body: commands,
})
    .then(() => console.log('Upload commands successfully'))
    .then(() => console.log('Upload commands fail'));
