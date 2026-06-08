import { Middleware } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { DocumentOwner } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';

// Альтернативный способ проверки создателя: из tokenPayload вытаскивать id пользователя и при запросе к БД ставить фильтр и на документ и на автора.
export class DocumentOwnerMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentOwner,
    private readonly entityName: string,
    private readonly paramName: string
  ) {}

  public async execute({ params, tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    const ownerId = await this.service.getOwnerId(documentId);
    if (ownerId !== tokenPayload.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `You are not the owner of this ${this.entityName}`,
        'DocumentOwnerMiddleware'
      );
    }

    next();
  }
}
