import { ResultSetHeader } from 'mysql2';
import { pool } from '../../db';
import { CreateExamRepoDTO } from './exam.types';

export async function createExamRepo(dto: CreateExamRepoDTO): Promise<number> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO exams (subject_id, title, text, date_exam, created_by, status, duplicate_of, similarity_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.subjectId,
        dto.title,
        dto.text,
        dto.dateExamen || null,
        dto.createdBy ?? null,
        dto.status,
        dto.duplicateOf ?? null,
        dto.similarityScore ?? null,
      ]
    );

    // @ts-ignore
    const examId: number = result.insertId;

    if (dto.teachersIds && dto.teachersIds.length > 0) {
      const values = dto.teachersIds.map((id) => [examId, id]);
      await conn.query(
        'INSERT INTO exam_teacher (exam_id, teacher_id) VALUES ?',
        [values]
      );
    }

    await conn.commit();
    return examId;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function getRandomExamBySubjectRepo(
  subjectId: number,
  teacherId?: number,
  excludeIds: number[] = []
) {
  let sql = `
    SELECT e.id, e.title, e.text, DATE_FORMAT(e.date_exam, '%Y-%m-%d') AS date_exam, e.subject_id,
           m.name AS subjects,
           GROUP_CONCAT(p.name SEPARATOR ', ') AS teachers
    FROM exams e
    JOIN subjects m ON e.subject_id = m.id
    LEFT JOIN exam_teacher rp ON rp.exam_id = e.id
    LEFT JOIN teachers p ON p.id = rp.teacher_id
    WHERE e.subject_id = ? AND e.status = 'approved' AND e.deleted_at IS NULL
  `;

  const params: any[] = [subjectId];

  if (teacherId) {
    sql += ` AND EXISTS (
      SELECT 1 FROM exam_teacher et2 
      WHERE et2.exam_id = e.id AND et2.teacher_id = ?
    )`;
    params.push(teacherId);
  }

  if (excludeIds.length > 0) {
    sql += ` AND e.id NOT IN (${excludeIds.map(() => '?').join(',')})`;
    params.push(...excludeIds);
  }

  sql += `
    GROUP BY e.id, e.title, e.text, e.date_exam, e.subject_id, m.name
    ORDER BY RAND()
    LIMIT 1
  `;

  const [rows] = await pool.query(sql, params);
  // @ts-ignore
  return rows[0] || null;
}

export interface FindAllExamsParams {
  subjectId?: number | undefined;
  teacherId?: number | undefined;
  search?: string | undefined;
  page: number;
  limit: number;
}

export interface PaginatedExams {
  items: any[];
  total: number;
}

export async function findAllExamsRepo(params: FindAllExamsParams): Promise<PaginatedExams> {
  const conditions: string[] = [`e.status = 'approved'`, `e.deleted_at IS NULL`];
  const values: any[] = [];

  if (params.subjectId) {
    conditions.push('e.subject_id = ?');
    values.push(params.subjectId);
  }

  if (params.teacherId) {
    conditions.push(`EXISTS (
      SELECT 1 FROM exam_teacher et2
      WHERE et2.exam_id = e.id AND et2.teacher_id = ?
    )`);
    values.push(params.teacherId);
  }

  if (params.search) {
    conditions.push('(e.text LIKE ? OR e.title LIKE ?)');
    const like = `%${params.search}%`;
    values.push(like, like);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM exams e ${whereClause}`,
    values
  );
  // @ts-ignore
  const total: number = countRows[0]?.total ?? 0;

  const offset = (params.page - 1) * params.limit;

  const [rows] = await pool.query(
    `
    SELECT e.id, e.title, e.text, DATE_FORMAT(e.date_exam, '%Y-%m-%d') AS date_exam, e.subject_id,
           m.name AS subject_name,
           GROUP_CONCAT(DISTINCT p.name SEPARATOR ', ') AS teachers
    FROM exams e
    JOIN subjects m ON e.subject_id = m.id
    LEFT JOIN exam_teacher rp ON rp.exam_id = e.id
    LEFT JOIN teachers p ON p.id = rp.teacher_id
    ${whereClause}
    GROUP BY e.id, e.title, e.text, e.date_exam, e.subject_id, m.name
    ORDER BY e.id DESC
    LIMIT ? OFFSET ?
    `,
    [...values, params.limit, offset]
  );

  // @ts-ignore
  return { items: rows, total };
}

export async function findCandidateExamsBySubjectRepo(
  subjectId: number
): Promise<{ id: number; text: string }[]> {
  const [rows] = await pool.query(
    `SELECT id, text FROM exams WHERE subject_id = ? AND status = 'approved' AND deleted_at IS NULL`,
    [subjectId]
  );
  return rows as { id: number; text: string }[];
}

export async function findPendingExamsRepo() {
  const [rows] = await pool.query(`
    SELECT
      e.id, e.title, e.text, DATE_FORMAT(e.date_exam, '%Y-%m-%d') AS date_exam,
      e.similarity_score, e.created_at,
      m.name AS subject_name,
      u.name AS author_name,
      d.id AS duplicate_id, d.title AS duplicate_title, d.text AS duplicate_text
    FROM exams e
    JOIN subjects m ON e.subject_id = m.id
    LEFT JOIN users u ON u.id = e.created_by
    LEFT JOIN exams d ON d.id = e.duplicate_of
    WHERE e.status = 'pending' AND e.deleted_at IS NULL
    ORDER BY e.created_at ASC
  `);
  return rows;
}

export async function updateExamStatusRepo(
  examId: number,
  status: 'approved' | 'rejected'
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE exams SET status = ? WHERE id = ? AND status = 'pending'`,
    [status, examId]
  );
  return result.affectedRows > 0;
}

export async function softDeleteExamRepo(id: number, deletedBy: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE exams SET deleted_at = NOW(), deleted_by = ? WHERE id = ? AND deleted_at IS NULL`,
    [deletedBy, id]
  );
  return result.affectedRows > 0;
}

export async function restoreExamRepo(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE exams SET deleted_at = NULL, deleted_by = NULL WHERE id = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  return result.affectedRows > 0;
}

export async function findDeletedExamsRepo() {
  const [rows] = await pool.query(`
    SELECT
      e.id, e.title, e.text, DATE_FORMAT(e.date_exam, '%Y-%m-%d') AS date_exam,
      e.deleted_at,
      m.name AS subject_name,
      u.name AS deleted_by_name
    FROM exams e
    JOIN subjects m ON e.subject_id = m.id
    LEFT JOIN users u ON u.id = e.deleted_by
    WHERE e.deleted_at IS NOT NULL
    ORDER BY e.deleted_at DESC
  `);
  return rows;
}
