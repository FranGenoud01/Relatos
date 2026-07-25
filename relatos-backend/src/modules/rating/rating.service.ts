import { getRatingSummaryRepo, upsertRatingRepo } from './rating.repository';
import { RatingSummary } from './rating.types';

function validateExamId(examId: number): void {
  if (!Number.isFinite(examId) || examId <= 0) {
    throw new Error('INVALID_EXAM_ID');
  }
}

export async function getRatingSummaryService(
  examId: number,
  userId?: number
): Promise<RatingSummary> {
  validateExamId(examId);
  return getRatingSummaryRepo(examId, userId);
}

export async function rateExamService(
  examId: number,
  userId: number,
  stars: number
): Promise<RatingSummary> {
  validateExamId(examId);

  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    throw new Error('STARS_INVALIDO');
  }

  await upsertRatingRepo(examId, userId, stars);
  return getRatingSummaryRepo(examId, userId);
}
