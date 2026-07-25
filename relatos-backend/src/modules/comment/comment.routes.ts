import { Router } from 'express';
import { getCommentsController, createCommentController } from './comment.controller';
import { requireAuth } from '../auth/auth.middleware';

export const commentRouter = Router({ mergeParams: true });

commentRouter.get('/', getCommentsController);
commentRouter.post('/', requireAuth, createCommentController);
