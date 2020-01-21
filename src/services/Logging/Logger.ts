import * as Winston from 'winston';

export default class Logger {
  private readonly logger: Winston.Logger;

  public constructor(logger: Winston.Logger) {
    this.logger = logger;
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public http(message: string): void {
    this.logger.http(message);
  }

  public verbose(message: string): void {
    this.logger.verbose(message);
  }

  public silly(message: string): void {
    this.logger.silly(message);
  }
}
