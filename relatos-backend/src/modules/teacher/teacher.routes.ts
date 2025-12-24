import { Router } from 'express';
import {
  createTeacherController,
  deleteTeacherController,
  getTeachersController,
} from './teacher.controller';

export const teacherRouter = Router();

teacherRouter.get('/', getTeachersController);
teacherRouter.post('/', createTeacherController);
teacherRouter.delete('/:id', deleteTeacherController);
