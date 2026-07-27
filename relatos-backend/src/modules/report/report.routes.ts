import { Router } from 'express';
import { createReportController } from './report.controller';
import { requireAuth } from '../auth/auth.middleware';

export const reportRouter = Router({ mergeParams: true });

reportRouter.post('/', requireAuth, createReportController);
