import { Router } from 'express';
import {
  createExamController,
  getRandomExamController,
  findAllExamsController,
} from './exam.controller';
import { optionalAuth } from '../auth/auth.middleware';

export const examRouter = Router();

examRouter.post('/', optionalAuth, createExamController);
examRouter.get('/random', getRandomExamController);
examRouter.get('/', findAllExamsController);
