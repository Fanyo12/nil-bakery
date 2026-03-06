import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import authBasicRoutes from './routes/authBasicRoutes.js';
import productRoutes from './routes/productRoutes.js';
import pool from './config/db.js';

const app = express();
import webauthnRoutes from './routes/webauthnRoutes.js';
/* ============================
   MIDDLEWARES
============================ */

// Permitir JSON en requests
app.use(express.json());

// Configuración CORS (permite al frontend conectarse)
app.use(
  cors({
    origin: "https://nil-bakery-frontend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.options('*', cors())

/* ============================
   RUTAS
============================ */

// Autenticación básica (email + password)
app.use('/api/auth', authBasicRoutes);

// Autenticación biométrica (WebAuthn)
app.use('/api/auth', authRoutes);

app.use('/api/webauthn', webauthnRoutes);

app.use('/api/products', productRoutes);
/* ============================
   RUTA BASE
============================ */

app.get('/', (req, res) => {
  res.json({ message: "NIL BAKERY API funcionando 🍰" });
});

/* ============================
   IP DE RENDER
============================ */

app.get('/api/ip', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  res.json({ 
    message: '🌐 IP de Render para HostGator', 
    ip: ip,
    timestamp: new Date().toISOString()
  });
});

/* ============================
   TEST CONEXIÓN BD
============================ */

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
