const express = require('express');
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use('/api/auth', authRoutes);

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: "NIL BAKERY API funcionando 🍰" });
});

module.exports = app;
