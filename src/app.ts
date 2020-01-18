import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

const { DISCORD_TOKEN } = process.env;

const client = new Discord.Client();

client.once('ready', () => {
  console.log('Ready!');
});

client.login(DISCORD_TOKEN);
