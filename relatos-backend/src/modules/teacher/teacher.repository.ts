import { ResultSetHeader } from 'mysql2';
import { pool } from '../../db';

export interface Teacher {
  id: number;
  name: string;
}

export async function findAllTeacheres(): Promise<Teacher[]> {
  const [rows] = await pool.query(
    'SELECT id, name FROM teachers WHERE deleted_at IS NULL ORDER BY name'
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

export async function softDeleteTeacherById(id: number, deletedBy: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE teachers SET deleted_at = NOW(), deleted_by = ? WHERE id = ? AND deleted_at IS NULL',
    [deletedBy, id]
  );
  return result.affectedRows > 0;
}

export async function restoreTeacherById(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE teachers SET deleted_at = NULL, deleted_by = NULL WHERE id = ? AND deleted_at IS NOT NULL',
    [id]
  );
  return result.affectedRows > 0;
}

export async function findDeletedTeachersRepo() {
  const [rows] = await pool.query(`
    SELECT t.id, t.name, t.deleted_at, u.name AS deleted_by_name
    FROM teachers t
    LEFT JOIN users u ON u.id = t.deleted_by
    WHERE t.deleted_at IS NOT NULL
    ORDER BY t.deleted_at DESC
  `);
  return rows;
}
