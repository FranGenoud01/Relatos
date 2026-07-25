import { Router } from 'express';
import {
  approveExamController,
  deleteExamController,
  deleteTeacherController,
  getDeletedExamsController,
  getDeletedTeachersController,
  getPendingExamsController,
  rejectExamController,
  restoreExamController,
  restoreTeacherController,
} from './admin.controller';
import { requireAdmin, requireAuth } from '../auth/auth.middleware';

export const adminRouter = Router();

adminRouter.get('/exams/pending', requireAuth, requireAdmin, getPendingExamsController);
adminRouter.post('/exams/:id/approve', requireAuth, requireAdmin, approveExamController);
adminRouter.post('/exams/:id/reject', requireAuth, requireAdmin, rejectExamController);

adminRouter.get('/exams/deleted', requireAuth, requireAdmin, getDeletedExamsController);
adminRouter.delete('/exams/:id', requireAuth, requireAdmin, deleteExamController);
adminRouter.post('/exams/:id/restore', requireAuth, requireAdmin, restoreExamController);

adminRouter.get('/teachers/deleted', requireAuth, requireAdmin, getDeletedTeachersController);
adminRouter.delete('/teachers/:id', requireAuth, requireAdmin, deleteTeacherController);
adminRouter.post('/teachers/:id/restore', requireAuth, requireAdmin, restoreTeacherController);
