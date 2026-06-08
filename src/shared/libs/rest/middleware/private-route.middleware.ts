import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export class PrivateRouteMiddleware implements Middleware {
  constructor(
    private readonly isForbiddenForAuthorized?: boolean
  ) {}

  public async execute({ tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!this.isForbiddenForAuthorized && !tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }

    if (this.isForbiddenForAuthorized && tokenPayload) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'This route is for unauthorized users only',
        'PrivateRouteMiddleware'
      );
    }

    return next();
  }
}
