import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar .env desde la carpeta backend (dos niveles arriba)
dotenv.config({ path: join(__dirname, '../../.env') });

console.log('DB_USER:', process.env.DB_USER); // 👈 AGREGAR ESTO PARA DEBUG
console.log('DB_HOST:', process.env.DB_HOST);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,      // 🔥 AGREGAR
  keepAliveInitialDelay: 0    // 🔥 AGREGAR
});

export default pool;