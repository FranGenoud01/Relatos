import { Router } from 'express';
import {
  addFavoriteController,
  getFavoriteStatusController,
  getMyFavoritesController,
  removeFavoriteController,
} from './favorite.controller';
import { optionalAuth, requireAuth } from '../auth/auth.middleware';

export const favoriteRouter = Router({ mergeParams: true });

favoriteRouter.get('/', optionalAuth, getFavoriteStatusController);
favoriteRouter.post('/', requireAuth, addFavoriteController);
favoriteRouter.delete('/', requireAuth, removeFavoriteController);

export const myFavoritesRouter = Router();

myFavoritesRouter.get('/', requireAuth, getMyFavoritesController);
