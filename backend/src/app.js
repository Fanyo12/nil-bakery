import express from 'express';
import authRoutes from './routes/auth.routes.js';
import authBasicRoutes from './routes/authBasicRoutes.js';
import pool from './config/db.js';

const app = express();

// ⚠️ PRIMERO JSON
app.use(express.json());

// 🔐 Auth básica (email + password)
app.use('/api/auth', authBasicRoutes);

// 🔐 Auth biométrica (WebAuthn)
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: "NIL BAKERY API funcionando 🍰" });
});

app.get('/api/ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.json({ 
    message: '🌐 IP de Render para HostGator', 
    ip: ip,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test-db', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ 
      message: '✅ Conectado a HostGator', 
      data: result[0].solution 
    });
  } catch (error) {
    res.status(500).json({ 
      message: '❌ Error de conexión', 
      error: error.message 
    });
  }
});

export default app;