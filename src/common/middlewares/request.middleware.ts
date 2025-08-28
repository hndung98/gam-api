import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // create if the client does not have
    if (!req.headers['x-request-id']) {
      req.headers['x-request-id'] = uuid();
    }
    next();
  }
}
