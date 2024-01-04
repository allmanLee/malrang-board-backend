import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: any, res: any, next: () => void) {
    res.on('finish', () => {
      this.logger.log(
        `${req.ip} ${req.method} ${req.originalUrl} ${res.statusCode}`,
      );
    });

    next();
  }
}
