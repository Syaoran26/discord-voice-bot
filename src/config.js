"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var _a = process.env, DISCORD_TOKEN = _a.DISCORD_TOKEN, CLIENT_ID = _a.CLIENT_ID;
if (!DISCORD_TOKEN || !CLIENT_ID) {
    throw new Error('Missing environment variables');
}
var config = {
    DISCORD_TOKEN: DISCORD_TOKEN,
    CLIENT_ID: CLIENT_ID,
};
exports.default = config;
