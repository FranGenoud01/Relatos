import { ResultSetHeader } from 'mysql2';
import { pool } from '../../db';
import { OpenReportItem, ReportReason } from './report.types';

export async function createReportRepo(
  examId: number,
  reporterId: number,
  reason: ReportReason,
  comment: string | null
): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO exam_reports (exam_id, reporter_id, reason, comment) VALUES (?, ?, ?, ?)',
    [examId, reporterId, reason, comment]
  );
  return result.insertId;
}

export async function findOpenReportsRepo(): Promise<OpenReportItem[]> {
  const [rows] = await pool.query(
    `
    SELECT
      r.id, r.exam_id, r.reason, r.comment,
      DATE_FORMAT(r.created_at, '%Y-%m-%dT%H:%i:%s') AS created_at,
      u.name AS reporter_name,
      m.name AS subject_name,
      e.text AS exam_text
    FROM exam_reports r
    JOIN users u ON u.id = r.reporter_id
    JOIN exams e ON e.id = r.exam_id
    JOIN subjects m ON e.subject_id = m.id
    WHERE r.status = 'open'
    ORDER BY r.created_at ASC
    `
  );
  return rows as OpenReportItem[];
}

export async function resolveReportRepo(id: number, resolvedBy: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE exam_reports SET status = 'resolved', resolved_at = NOW(), resolved_by = ?
     WHERE id = ? AND status = 'open'`,
    [resolvedBy, id]
  );
  return result.affectedRows > 0;
}

export async function resolveReportsForExamRepo(examId: number, resolvedBy: number): Promise<void> {
  await pool.query(
    `UPDATE exam_reports SET status = 'resolved', resolved_at = NOW(), resolved_by = ?
     WHERE exam_id = ? AND status = 'open'`,
    [resolvedBy, examId]
  );
}
