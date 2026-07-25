import { pool } from '../../db';
import { RatingSummary } from './rating.types';

export async function getRatingSummaryRepo(
  examId: number,
  userId?: number
): Promise<RatingSummary> {
  const [aggRows] = await pool.query(
    'SELECT AVG(stars) AS average, COUNT(*) AS count FROM exam_ratings WHERE exam_id = ?',
    [examId]
  );
  // @ts-ignore
  const { average, count } = aggRows[0];

  let myRating: number | null = null;
  if (userId) {
    const [myRows] = await pool.query(
      'SELECT stars FROM exam_ratings WHERE exam_id = ? AND user_id = ? LIMIT 1',
      [examId, userId]
    );
    // @ts-ignore
    myRating = myRows[0]?.stars ?? null;
  }

  return {
    average: average !== null ? Number(average) : null,
    count: Number(count),
    myRating,
  };
}

export async function upsertRatingRepo(
  examId: number,
  userId: number,
  stars: number
): Promise<void> {
  await pool.query(
    `INSERT INTO exam_ratings (exam_id, user_id, stars)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE stars = VALUES(stars)`,
    [examId, userId, stars]
  );
}
