import * as Discord from 'discord.js';
import 'dotenv/config';
import InteractionHandler from './discord/InteractionHandler';
import { CacheService } from './services/CacheService';
import LoggerFactor from './services/Logging/LoggerFactory';
import UfcService from './services/UfcService';
import Environment from './util/Environment';

const start = async () => {
  const env = new Environment(process.env);

  const cacheService = new CacheService(env);

  await cacheService.init();

  const logger = LoggerFactor.createLogger(env);
  const dataService = new UfcService(logger);
  const interactionHandler = new InteractionHandler(logger, dataService, cacheService);

  const intents = [Discord.Intents.FLAGS.GUILDS];

  const client = new Discord.Client({ intents });

  client.once('ready', () => {
    logger.info('Ready to accept commands');
  });

  client.on('interactionCreate', interactionHandler.handleInteraction);

  client.login(env.DISCORD_TOKEN);
}
start();
