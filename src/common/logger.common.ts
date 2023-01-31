import { Logger } from '@nestjs/common';
import dayjs from 'dayjs';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

class CommonLogger extends Logger {
  private winstonLogger: winston.Logger;

  constructor(context?: string) {
    super(context);
    const winstonTransports = new winston.transports.DailyRotateFile({
      filename: '%DATE%.log',
      dirname: './logs/',
      datePattern: 'YYYY-MM-DD',
      maxSize: '10m',
      maxFiles: '7d',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    });
    this.winstonLogger = winston.createLogger({
      transports: winstonTransports,
    });
  }

  customError(message: string, trace: string) {
    this.winstonLogger.error(message);
    super.error(message, trace);
  }

  log(context: string, ...messages: any[]) {
    const message = messages.map((mess) => JSON.stringify(mess)).join('\n');
    super.log(`${dayjs().format('YYYY-MM-DD HH:mm:ss')} ${message}`, context);
  }
}

export const commonLogger = new CommonLogger();
