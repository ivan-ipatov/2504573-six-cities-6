import { inject, injectable } from 'inversify';
import { CommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { OfferModel } from '../offer/offer.entity.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const commentData = {
      text: dto.text,
      rating: dto.rating,
      offerId: new Types.ObjectId(dto.offerId),
      userId: new Types.ObjectId(dto.userId)
    };

    const result = await this.commentModel.create(commentData);
    this.logger.info(`New comment created for offer: ${dto.offerId}`);

    await this.updateOfferRating(dto.offerId);
    await this.incrementCommentCount(dto.offerId);

    return result;
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId: new Types.ObjectId(offerId) })
      .populate('userId')
      .exec();
  }

  public async deleteById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) {
      return null;
    }

    const offerId = comment.offerId.toString();
    const result = await this.commentModel.findByIdAndDelete(commentId).exec();

    if (result) {
      await this.updateOfferRating(offerId);
      await this.decrementCommentCount(offerId);
    }

    return result;
  }

  public async findById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    return this.commentModel
      .findById(commentId)
      .populate('userId')
      .exec();
  }

  private async updateOfferRating(offerId: string): Promise<void> {
    const comments = await this.commentModel.find({ offerId: new Types.ObjectId(offerId) }).exec();

    if (comments.length === 0) {
      await OfferModel.findByIdAndUpdate(offerId, { rating: 0 });
      return;
    }

    const totalRating = comments.reduce((sum: number, comment: CommentEntity) => sum + comment.rating, 0);
    const averageRating = parseFloat((totalRating / comments.length).toFixed(1));

    await OfferModel.findByIdAndUpdate(offerId, { rating: averageRating });
  }

  private async incrementCommentCount(offerId: string): Promise<void> {
    await OfferModel.findByIdAndUpdate(offerId, { $inc: { commentCount: 1 } });
  }

  private async decrementCommentCount(offerId: string): Promise<void> {
    await OfferModel.findByIdAndUpdate(offerId, { $inc: { commentCount: -1 } });
  }
}
