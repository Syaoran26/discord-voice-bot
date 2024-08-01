"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var config_1 = require("./config");
var commands = [new discord_js_1.SlashCommandBuilder().setName('ping').setDescription('Pong')];
var rest = new discord_js_1.REST({ version: '9' }).setToken(config_1.default.DISCORD_TOKEN);
rest.put(discord_js_1.Routes.applicationGuildCommands(config_1.default.CLIENT_ID, '1189904463092252692'), {
    body: commands,
})
    .then(function () { return console.log('Upload commands successfully'); })
    .then(function () { return console.log('Upload commands fail'); });
