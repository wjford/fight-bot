export default class Environment {
  public readonly DISCORD_TOKEN: string;
  public readonly PAPERTRAIL_API_TOKEN: string;
  public readonly NODE_ENV: string;
  public readonly LOGGING_LEVEL: string;
  public readonly CLIENT_ID: string;
  public readonly GUILD_ID: string;
  public readonly REDIS_URL: string;

  public constructor(env: NodeJS.ProcessEnv) {
    this.DISCORD_TOKEN = env.DISCORD_TOKEN || '';
    this.PAPERTRAIL_API_TOKEN = env.PAPERTRAIL_API_TOKEN || '';
    this.NODE_ENV = env.NODE_ENV || 'development';
    this.LOGGING_LEVEL = env.LOGGING_LEVEL || 'info';
    this.CLIENT_ID = env.CLIENT_ID || '';
    this.GUILD_ID = env.GUILD_ID || '';
    this.REDIS_URL = env.REDIS_URL || '';
  }
}
