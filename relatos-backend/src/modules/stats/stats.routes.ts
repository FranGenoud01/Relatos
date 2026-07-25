import { Router } from 'express';
import { getStatsController } from './stats.controller';

export const statsRouter = Router();

statsRouter.get('/', getStatsController);
