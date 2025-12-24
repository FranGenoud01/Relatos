import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

// Definimos variables ya como string "puro"
const DB_HOST: string = process.env.DB_HOST ?? 'localhost';
const DB_PORT: number = Number(process.env.DB_PORT ?? 3306);
const DB_USER: string = process.env.DB_USER ?? 'root';
const DB_PASSWORD: string = process.env.DB_PASSWORD ?? '';
const DB_NAME: string = process.env.DB_NAME ?? 'relatos_examenes';

export const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
