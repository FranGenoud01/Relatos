import { NextFunction, Request, Response } from 'express';
import { verifyAuthToken } from './auth.service';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  return header.slice('Bearer '.length).trim();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  try {
    const payload = verifyAuthToken(token);
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      const payload = verifyAuthToken(token);
      req.userId = payload.id;
    } catch {
      // Token inválido/expirado: seguimos como usuario anónimo.
    }
  }
  next();
}
