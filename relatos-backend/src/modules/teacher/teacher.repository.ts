import { ResultSetHeader } from 'mysql2';
import { pool } from '../../db';

export interface Teacher {
  id: number;
  name: string;
}

export async function findAllTeacheres(): Promise<Teacher[]> {
  const [rows] = await pool.query(
    'SELECT id, name FROM teachers ORDER BY name'
  );
  return rows as Teacher[];
}

export async function createTeacher(name: string): Promise<Teacher> {
  const [result] = await pool.query('INSERT INTO teachers (name) VALUES (?)', [
    name,
  ]);

  // @ts-ignore
  const insertId: number = result.insertId;

  return { id: insertId, name: name };
}

export async function deleteTeacherById(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM teachers WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}
