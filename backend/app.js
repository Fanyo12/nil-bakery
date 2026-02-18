import express from 'express';
import authRoutes from './src/routes/auth.routes.js';

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: "NIL BAKERY API funcionando 🍰" });
});

export default app;
