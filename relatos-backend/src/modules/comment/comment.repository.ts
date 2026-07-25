import { pool } from '../../db';
import { CommentItem } from './comment.types';

export async function findCommentsByExamRepo(examId: number): Promise<CommentItem[]> {
  const [rows] = await pool.query(
    `SELECT c.id, c.exam_id, c.text, DATE_FORMAT(c.created_at, '%Y-%m-%dT%H:%i:%s') AS created_at,
            u.name AS author_name
     FROM exam_comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.exam_id = ?
     ORDER BY c.created_at ASC`,
    [examId]
  );
  return rows as CommentItem[];
}

export async function createCommentRepo(
  examId: number,
  userId: number,
  text: string
): Promise<number> {
  const [result] = await pool.query(
    'INSERT INTO exam_comments (exam_id, user_id, text) VALUES (?, ?, ?)',
    [examId, userId, text]
  );
  // @ts-ignore
  const insertId: number = result.insertId;
  return insertId;
}
