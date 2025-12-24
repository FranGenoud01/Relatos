import { ResultSetHeader } from 'mysql2';
import { pool } from '../../db';

export interface Subject {
  id: number;
  name: string;
}

export async function findAllSubjects(): Promise<Subject[]> {
  const [rows] = await pool.query(
    'SELECT id, name FROM subjects ORDER BY name'
  );
  return rows as Subject[];
}

export async function createSubject(name: string): Promise<Subject> {
  const [result] = await pool.query('INSERT INTO subjects (name) VALUES (?)', [
    name,
  ]);

  // @ts-ignore
  const insertId: number = result.insertId;

  return { id: insertId, name: name };
}

export async function deleteSubjectById(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM subjects WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}
