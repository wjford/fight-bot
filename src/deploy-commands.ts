import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import * as dotenv from 'dotenv';
import Environment from './util/Environment';

dotenv.config();

const env = new Environment(process.env);

const commands = [
  new SlashCommandBuilder()
    .setName('fight')
    .setDescription('Replies with upcoming fight card'),
  new SlashCommandBuilder()
    .setName('fights')
    .setDescription('Replies with links to upcoming fights'),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(Routes.applicationCommands(env.CLIENT_ID), {
      body: commands,
    });

    await rest.put(
      Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID),
      {
        body: commands,
      }
    );

    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
})();
