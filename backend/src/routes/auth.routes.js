import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send("AUTH ROUTER FUNCIONANDO");
});

router.post('/register/options', (req, res) => {
  res.send("REGISTER OPTIONS FUNCIONA");
});

router.post('/login/options', (req, res) => {
  res.send("LOGIN OPTIONS FUNCIONA");
});

export default router;
