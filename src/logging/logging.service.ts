import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logLevels: LogLevel[] = [
    'log',
    'error',
    'warn',
    'debug',
    'verbose',
  ];

  private readonly maxFileSize: number;
  private readonly logLevel: number;

  constructor() {
    this.maxFileSize = parseInt(process.env.LOG_FILE_MAX_SIZE || '1024');
    this.logLevel = parseInt(process.env.LOG_LEVEL || '2');
  }

  private shouldLog(level: number) {
    return level <= this.logLevel;
  }

  error(message: string, trace?: string, context?: string) {
    if (this.shouldLog(0)) {
      this.writeLog('error', message, context, trace);
    }
  }

  warn(message: string, context?: string) {
    if (this.shouldLog(1)) {
      this.writeLog('warn', message, context);
    }
  }

  log(message: string, context?: string) {
    if (this.shouldLog(2)) {
      this.writeLog('log', message, context);
    }
  }

  debug?(message: string, context?: string) {
    if (this.shouldLog(3)) {
      this.writeLog('debug', message, context);
    }
  }

  verbose?(message: string, context?: string) {
    if (this.shouldLog(4)) {
      this.writeLog('verbose', message, context);
    }
  }

  private writeLog(
    level: LogLevel,
    message: string,
    context?: string,
    trace?: string,
  ) {
    const date = this.getFormattedDate();
    const logMessage = `${date} [${level.toUpperCase()}] ${
      context ? `[${context}] ` : ''
    }${message}${trace ? `\n${trace}` : ''}`;

    console.log(logMessage);

    this.writeToFile(level, logMessage);
  }

  private writeToFile(level: LogLevel, message: string) {
    const logDir = path.join(__dirname, '../logs');

    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

    const logFile =
      level === 'error'
        ? path.join(logDir, 'error.log')
        : path.join(logDir, 'application.log');

    if (
      fs.existsSync(logFile) &&
      fs.statSync(logFile).size > this.maxFileSize * 1024
    ) {
      fs.renameSync(logFile, `${logFile}.${Date.now()}`);
    }

    fs.appendFileSync(logFile, message + '\n');
  }

  private getFormattedDate(): string {
    return new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }
}
