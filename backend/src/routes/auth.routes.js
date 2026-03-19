import express from 'express';
import { 
  registerOptions, 
  loginOptions, 
  verifyRegistration,
  verifyLogin
} from '../controllers/authController.js';

const router = express.Router();

// TEST
router.get('/', (req, res) => {
  res.send("AUTH ROUTER FUNCIONANDO");
});

// 🔐 REGISTRO
router.post('/register/options', registerOptions);
router.post('/register/verify', verifyRegistration);

// 🔐 LOGIN
router.post('/login/options', loginOptions);
router.post('/login/finish', verifyLogin);

export default router;