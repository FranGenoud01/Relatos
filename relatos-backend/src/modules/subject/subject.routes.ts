import { Router } from 'express';
import {
  createSubjectController,
  deleteSubjectController,
  getSubjectsController,
} from './subject.controller';

export const subjectRouter = Router();

subjectRouter.get('/', getSubjectsController);
subjectRouter.post('/', createSubjectController);
subjectRouter.delete('/:id', deleteSubjectController);
