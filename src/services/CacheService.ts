import { RedisClientType } from '@node-redis/client';
import redis = require('redis');
import Environment from '../util/Environment';


export class CacheService {
  private readonly client: RedisClientType;

  constructor(env: Environment) {
    this.client = redis.createClient({url: env.REDIS_URL});
  }

  public init = async () => {
    await this.client.connect();
  }

  public get = async (key: string) => {
    if (!this.client.isOpen)
    return this.client.get(key);
  }

  public set = async (key: string, value: string) => {
    return this.client.set(key, value);
  }

}





