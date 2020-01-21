import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
import MessageHandler from './discord/MessageHandler';
import DataService from './services/DataService';
import LoggerFactor from './services/Logging/LoggerFactory';
import Environment from './util/Environment';

dotenv.config();

const env = new Environment(process.env);

const logger = LoggerFactor.createLogger(env);
const dataService = new DataService(logger);
const messageHandler = new MessageHandler(env, logger, dataService);

const client = new Discord.Client();

client.once('ready', () => {
  logger.info('Ready to accept commands');
});

client.on('message', messageHandler.handleMessage);

client.login(env.DISCORD_TOKEN);
