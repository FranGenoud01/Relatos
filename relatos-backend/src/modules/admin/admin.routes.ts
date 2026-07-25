import { Router } from 'express';
import {
  approveExamController,
  getPendingExamsController,
  rejectExamController,
} from './admin.controller';
import { requireAdmin, requireAuth } from '../auth/auth.middleware';

export const adminRouter = Router();

adminRouter.get('/exams/pending', requireAuth, requireAdmin, getPendingExamsController);
adminRouter.post('/exams/:id/approve', requireAuth, requireAdmin, approveExamController);
adminRouter.post('/exams/:id/reject', requireAuth, requireAdmin, rejectExamController);
