import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body, query, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const elapsedTime = Date.now() - startTime;

      this.loggingService.log(
        `${method} ${url} - Status: ${statusCode} - Time: ${elapsedTime}ms - Query: ${JSON.stringify(
          query,
        )} - Body: ${JSON.stringify(body)} - OriginalUrl: ${originalUrl}`,
        'RequestLogger',
      );
    });

    next();
  }
}
