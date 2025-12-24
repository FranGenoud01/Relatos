import { Router } from 'express';
import {
  createExamController,
  getRandomExamController,
  deleteExamController,
  findAllExamsController,
} from './exam.controller';

export const examRouter = Router();

examRouter.post('/', createExamController);
examRouter.get('/random', getRandomExamController);
examRouter.delete('/:id', deleteExamController);
examRouter.get('/', findAllExamsController);
