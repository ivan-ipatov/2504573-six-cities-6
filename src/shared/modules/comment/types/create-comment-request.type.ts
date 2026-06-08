import { Request } from 'express';
import { RequestBody } from '../../../libs/rest/index.js';
import { CreateCommentDto } from '../dto/create-comment.dto.js';
import { OfferIdRequestParam } from '../../offer/types/offerId-request-param.type.js';

export type CreateCommentRequest = Request<OfferIdRequestParam, RequestBody, CreateCommentDto>;
