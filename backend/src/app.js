import express from 'express';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());

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

export default app;
