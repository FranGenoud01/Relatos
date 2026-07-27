import { pool } from '../../db';
import { FavoriteExamItem } from './favorite.types';

export async function isFavoriteRepo(examId: number, userId: number): Promise<boolean> {
  const [rows] = await pool.query(
    'SELECT 1 FROM exam_favorites WHERE exam_id = ? AND user_id = ? LIMIT 1',
    [examId, userId]
  );
  return (rows as unknown[]).length > 0;
}

export async function addFavoriteRepo(examId: number, userId: number): Promise<void> {
  await pool.query(
    'INSERT IGNORE INTO exam_favorites (exam_id, user_id) VALUES (?, ?)',
    [examId, userId]
  );
}

export async function removeFavoriteRepo(examId: number, userId: number): Promise<void> {
  await pool.query('DELETE FROM exam_favorites WHERE exam_id = ? AND user_id = ?', [
    examId,
    userId,
  ]);
}

export async function findFavoritesByUserRepo(userId: number): Promise<FavoriteExamItem[]> {
  const [rows] = await pool.query(
    `
    SELECT
      e.id, e.title, e.text, DATE_FORMAT(e.date_exam, '%Y-%m-%d') AS date_exam, e.subject_id,
      m.name AS subject_name,
      GROUP_CONCAT(DISTINCT p.name SEPARATOR ', ') AS teachers,
      DATE_FORMAT(f.created_at, '%Y-%m-%dT%H:%i:%s') AS favorited_at
    FROM exam_favorites f
    JOIN exams e ON e.id = f.exam_id
    JOIN subjects m ON e.subject_id = m.id
    LEFT JOIN exam_teacher rp ON rp.exam_id = e.id
    LEFT JOIN teachers p ON p.id = rp.teacher_id
    WHERE f.user_id = ? AND e.deleted_at IS NULL
    GROUP BY e.id, e.title, e.text, e.date_exam, e.subject_id, m.name, f.created_at
    ORDER BY f.created_at DESC
    `,
    [userId]
  );
  return rows as FavoriteExamItem[];
}
