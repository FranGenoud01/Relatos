import dotenv from 'dotenv';
import app from './app';
import { pool } from './db';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.execute('SELECT 1');
    console.log('✅ Conectado a MySQL');

    const PORT = Number(process.env.PORT || 3000);
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    process.exit(1);
  }
}

start();
