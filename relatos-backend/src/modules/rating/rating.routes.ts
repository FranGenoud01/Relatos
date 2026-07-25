import { Router } from 'express';
import { getRatingSummaryController, rateExamController } from './rating.controller';
import { optionalAuth, requireAuth } from '../auth/auth.middleware';

export const ratingRouter = Router({ mergeParams: true });

ratingRouter.get('/', optionalAuth, getRatingSummaryController);
ratingRouter.put('/', requireAuth, rateExamController);
