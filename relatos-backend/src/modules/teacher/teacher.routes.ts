import { Router } from 'express';
import {
  createTeacherController,
  getTeachersController,
} from './teacher.controller';

export const teacherRouter = Router();

teacherRouter.get('/', getTeachersController);
teacherRouter.post('/', createTeacherController);
