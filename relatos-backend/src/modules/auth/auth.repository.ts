import { pool } from '../../db';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  is_admin: number | boolean;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash, is_admin FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  const users = rows as UserRecord[];
  return users[0] ?? null;
}

export async function findUserById(id: number): Promise<UserRecord | null> {
  const [rows] = await pool.query(
    'SELECT id, name, email, password_hash, is_admin FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  const users = rows as UserRecord[];
  return users[0] ?? null;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string
): Promise<UserRecord> {
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );

  // @ts-ignore
  const insertId: number = result.insertId;

  return { id: insertId, name, email, password_hash: passwordHash, is_admin: false };
}
