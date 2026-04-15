import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { CommentService } from './comment-service.interface.js';
import { DefaultCommentService } from './default-comment.service.js';
import { CommentModel } from './comment.entity.js';

export function createCommentContainer(): Container {
  const container = new Container();

  container.bind(Component.CommentModel).toConstantValue(CommentModel);
  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService);

  return container;
}
