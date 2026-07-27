import {
  addFavoriteRepo,
  findFavoritesByUserRepo,
  isFavoriteRepo,
  removeFavoriteRepo,
} from './favorite.repository';
import { FavoriteExamItem, FavoriteStatus } from './favorite.types';

function validateExamId(examId: number): void {
  if (!Number.isFinite(examId) || examId <= 0) {
    throw new Error('INVALID_EXAM_ID');
  }
}

export async function getFavoriteStatusService(
  examId: number,
  userId?: number
): Promise<FavoriteStatus> {
  validateExamId(examId);
  if (!userId) {
    return { isFavorite: false };
  }
  return { isFavorite: await isFavoriteRepo(examId, userId) };
}

export async function addFavoriteService(examId: number, userId: number): Promise<FavoriteStatus> {
  validateExamId(examId);
  await addFavoriteRepo(examId, userId);
  return { isFavorite: true };
}

export async function removeFavoriteService(
  examId: number,
  userId: number
): Promise<FavoriteStatus> {
  validateExamId(examId);
  await removeFavoriteRepo(examId, userId);
  return { isFavorite: false };
}

export async function getMyFavoritesService(userId: number): Promise<FavoriteExamItem[]> {
  return findFavoritesByUserRepo(userId);
}
