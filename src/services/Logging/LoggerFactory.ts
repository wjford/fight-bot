import * as Winston from 'winston';
import Environment from '../../util/Environment';
import Logger from './Logger';

export default class LoggerFactor {
  public static createLogger(env: Environment): Logger {
    const logger = Winston.createLogger({
      level: env.LOGGING_LEVEL,
      exitOnError: false,
      transports: [
        new Winston.transports.Console({
          format: Winston.format.simple(),
        }),
      ],
    });

    return new Logger(logger);
  }
}
