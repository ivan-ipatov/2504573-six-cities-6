import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod, HttpRequest, RequestQuery, ValidateDtoMiddleware, ValidateObjectIdMiddleware, PrivateRouteMiddleware, HttpError } from '../../libs/rest/index.js';
import { City, Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { PreviewOfferRdo } from './rdo/preview-offer.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { OfferIdRequestParam } from './types/offerId-request-param.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CommentRdo, CommentService, CreateCommentDto, CreateCommentRequest } from '../comment/index.js';
import { CityRequestParam } from './types/city-request-param.type.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { DocumentOwnerMiddleware } from '../../libs/rest/middleware/document-owner.middleware.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);

    this.logger.info('Registering routes for OfferController...');
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create, middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateOfferDto)] });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.indexPremium });
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.indexFavorite, middlewares: [new PrivateRouteMiddleware()] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.show, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDto), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'), new DocumentOwnerMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'), new DocumentOwnerMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId/favorite', method: HttpMethod.Post, handler: this.addToFavorite, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId/favorite', method: HttpMethod.Delete, handler: this.removeFromFavorite, middlewares: [new PrivateRouteMiddleware(), new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Get, handler: this.getComments, middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
    this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Post, handler: this.createComment, middlewares: [new PrivateRouteMiddleware(),new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(CreateCommentDto), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')] });
  }

  public async index({ query, tokenPayload }: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const offers = await this.offerService.find(query.limit, tokenPayload?.id);
    this.ok(res, fillDTO(PreviewOfferRdo, offers));
  }

  public async show({ params, tokenPayload }: Request<OfferIdRequestParam>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId, tokenPayload?.id);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async create({ body, tokenPayload }: HttpRequest<CreateOfferDto>, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, userId: tokenPayload.id });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async delete({ params }: Request<OfferIdRequestParam>, res: Response): Promise<void> {
    await this.offerService.deleteById(params.offerId);

    await this.commentService.deleteByOfferId(params.offerId);
    this.noContent(res, void 0);
  }

  public async update({ params, body }: Request<OfferIdRequestParam, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async indexPremium({ params, tokenPayload }: Request<CityRequestParam>, res: Response): Promise<void> {
    const city = params.city;
    if (!this.isCityExists(city)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'City must be in Paris, Cologne, Brussels, Amsterdam, Hamburg or Dusseldorf',
        'OfferController'
      );
    }

    const premiumOffers = await this.offerService.findPremiumByCity(city, tokenPayload?.id);
    this.ok(res, fillDTO(PreviewOfferRdo, premiumOffers));
  }

  private cities = new Set<string>(Object.values(City));
  private isCityExists(city: string): boolean {
    return this.cities.has(city);
  }

  public async indexFavorite({ tokenPayload }: Request, res: Response): Promise<void> {
    const favoriteOffers = await this.offerService.findFavorite(tokenPayload.id);
    this.ok(res, fillDTO(PreviewOfferRdo, favoriteOffers));
  }

  public async addToFavorite({ params, tokenPayload }: Request<OfferIdRequestParam>, res: Response): Promise<void> {
    await this.offerService.addToFavorite(params.offerId, tokenPayload.id);
    this.created(res, void 0);
  }

  public async removeFromFavorite({ params, tokenPayload }: Request<OfferIdRequestParam>, res: Response): Promise<void> {
    await this.offerService.removeFromFavorite(params.offerId, tokenPayload.id);
    this.noContent(res, void 0);
  }

  public async getComments({ params }: Request<OfferIdRequestParam>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async createComment({ body, params, tokenPayload }: CreateCommentRequest, res: Response): Promise<void> {
    const comment = await this.commentService.create(params.offerId, { ...body, userId: tokenPayload.id });
    await this.offerService.incCommentCount(params.offerId);
    await this.offerService.calculateRating(params.offerId);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
