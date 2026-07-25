import { Router } from 'express';
import {
  createExamController,
  getRandomExamController,
  deleteExamController,
  findAllExamsController,
} from './exam.controller';
import { optionalAuth } from '../auth/auth.middleware';

export const examRouter = Router();

examRouter.post('/', optionalAuth, createExamController);
examRouter.get('/random', getRandomExamController);
examRouter.delete('/:id', deleteExamController);
examRouter.get('/', findAllExamsController);
