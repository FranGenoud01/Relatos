import { ResultSetHeader } from 'mysql2';
import { pool } from '../../db';
import { CreateExamDTO } from './exam.types';

export async function createExamRepo(dto: CreateExamDTO): Promise<number> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      'INSERT INTO exams (subject_id, title, text, date_exam) VALUES (?, ?, ?, ?)',
      [dto.subjectId, dto.title, dto.text, dto.dateExamen || null]
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
    WHERE e.subject_id = ?
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
    GROUP BY e.id
    ORDER BY RAND()
    LIMIT 1
  `;

  const [rows] = await pool.query(sql, params);
  // @ts-ignore
  return rows[0] || null;
}

export async function deleteExamById(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM exams WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

export async function findAllExamsRepo() {
  const [rows] = await pool.query(`
    SELECT e.id, e.title, e.text, DATE_FORMAT(e.date_exam, '%Y-%m-%d') AS date_exam, e.subject_id,
           m.name AS subject,
            GROUP_CONCAT(p.name SEPARATOR ', ') AS teachers
    FROM exams e
    JOIN subjects m ON e.subject_id = m.id
    LEFT JOIN exam_teacher rp ON rp.exam_id = e.id
    LEFT JOIN teachers p ON p.id = rp.teacher_id
    GROUP BY e.id
    ORDER BY e.id DESC
  `);

  // @ts-ignore
  return rows;
}
