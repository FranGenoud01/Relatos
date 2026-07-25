import { Router } from 'express';
import { loginController, meController, registerController } from './auth.controller';
import { requireAuth } from './auth.middleware';

export const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.get('/me', requireAuth, meController);
