import * as Winston from 'winston';

export default class Logger {
  private readonly logger: Winston.Logger;

  public constructor(logger: Winston.Logger) {
    this.logger = logger;

    this.info = this.info.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
    this.debug = this.debug.bind(this);
    this.http = this.http.bind(this);
    this.verbose = this.verbose.bind(this);
    this.silly = this.silly.bind(this);
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
