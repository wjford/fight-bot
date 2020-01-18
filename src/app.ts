import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
import MessageHandler from './MessageHandler';

dotenv.config();

const { DISCORD_TOKEN, PREFIX } = process.env;

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', MessageHandler(PREFIX));

client.login(DISCORD_TOKEN);
