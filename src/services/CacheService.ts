import { RedisClientType } from 'redis';
import Environment from '../util/Environment';
import Logger from './Logging/Logger';
import redis = require('redis');

export class CacheService {
  private readonly client: RedisClientType;
  private readonly logger: Logger;

  constructor(env: Environment, logger: Logger) {
    this.client = redis.createClient({ url: env.REDIS_URL });
    this.logger = logger;
  }

  private handleError = (err: Error) => {
    this.logger.error(err.message);
  };

  public init = async () => {
    this.client.on('error', this.handleError);
    await this.client.connect();
  };

  public get = async (key: string) => {
    return this.client.get(key);
  };

  public set = async (key: string, value: string) => {
    return this.client.set(key, value);
  };
}
