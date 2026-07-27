import { Router } from 'express';
import {
  createExamController,
  getRandomExamController,
  findAllExamsController,
  getMyExamsController,
} from './exam.controller';
import { optionalAuth, requireAuth } from '../auth/auth.middleware';

export const examRouter = Router();

examRouter.post('/', optionalAuth, createExamController);
examRouter.get('/random', getRandomExamController);
examRouter.get('/mine', requireAuth, getMyExamsController);
examRouter.get('/', findAllExamsController);
