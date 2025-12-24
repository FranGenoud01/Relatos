import dotenv from 'dotenv';
import app from './app';
import { pool } from './db';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Conectado a MySQL');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1);
  }
}

start();
