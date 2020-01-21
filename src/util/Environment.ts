export default class Environment {
  public readonly DISCORD_TOKEN: string;
  public readonly PREFIX: string;
  public readonly PAPERTRAIL_API_TOKEN: string;
  public readonly NODE_ENV: string;
  public readonly LOGGING_LEVEL: string;

  public constructor(env: NodeJS.ProcessEnv) {
    this.DISCORD_TOKEN = env.DISCORD_TOKEN || '';
    this.PREFIX = env.PREFIX || '$';
    this.PAPERTRAIL_API_TOKEN = env.PAPERTRAIL_API_TOKEN || '';
    this.NODE_ENV = env.NODE_ENV || 'development';
    this.LOGGING_LEVEL = env.LOGGING_LEVEL || 'info';
  }
}
