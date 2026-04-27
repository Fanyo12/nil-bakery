import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import authBasicRoutes from './routes/authBasicRoutes.js';
import productRoutes from './routes/productRoutes.js';
import pool from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import webauthnRoutes from './routes/webauthnRoutes.js'; // 👈 arriba

const app = express();


/* ============================
   MIDDLEWARES
============================ */

// Permitir JSON en requests
app.use(express.json());

// Configuración CORS (permite al frontend conectarse)
app.use(
  cors({  // 👈 FALTABA EL "cors("
    origin: [
      "https://nil-bakery-1.onrender.com",
      "https://nil-bakery.onrender.com",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
/* ============================
   RUTAS
============================ */
app.use('/api/admin', adminRoutes);

// Autenticación básica (email + password)
app.use('/api/auth', authBasicRoutes);

app.use('/api/webauthn', webauthnRoutes);

app.use('/api/products', productRoutes);


/* ============================
   RUTA BASE
============================ */

app.get('/', (req, res) => {
  res.json({ message: "NIL BAKERY API funcionando 🍰" });
});


export default app;
