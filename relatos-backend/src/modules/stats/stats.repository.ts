import { pool } from '../../db';
import { SubjectStat, StatsTotals, TeacherStat } from './stats.types';

export async function getSubjectStatsRepo(): Promise<SubjectStat[]> {
  const [rows] = await pool.query(
    `SELECT s.id, s.name, COUNT(e.id) AS exam_count
     FROM subjects s
     LEFT JOIN exams e ON e.subject_id = s.id
     GROUP BY s.id, s.name
     ORDER BY exam_count DESC, s.name ASC`
  );
  return rows as SubjectStat[];
}

export async function getTeacherStatsRepo(): Promise<TeacherStat[]> {
  const [rows] = await pool.query(
    `SELECT t.id, t.name, COUNT(et.exam_id) AS exam_count
     FROM teachers t
     LEFT JOIN exam_teacher et ON et.teacher_id = t.id
     GROUP BY t.id, t.name
     ORDER BY exam_count DESC, t.name ASC`
  );
  return rows as TeacherStat[];
}

async function countRows(table: string): Promise<number> {
  const [rows] = await pool.query(`SELECT COUNT(*) AS total FROM ${table}`);
  // @ts-ignore
  return Number(rows[0].total);
}

export async function getTotalsRepo(): Promise<StatsTotals> {
  const [exams, subjects, teachers, users, ratings, comments] = await Promise.all([
    countRows('exams'),
    countRows('subjects'),
    countRows('teachers'),
    countRows('users'),
    countRows('exam_ratings'),
    countRows('exam_comments'),
  ]);

  return { exams, subjects, teachers, users, ratings, comments };
}
