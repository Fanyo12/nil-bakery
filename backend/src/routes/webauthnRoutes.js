import express from 'express';
import { 
  generateRegistration,
  verifyRegistration
} from '../controllers/webauthnController.js';

const router = express.Router();

// iniciar registro biométrico
router.post('/register/begin', generateRegistration);

// completar registro biométrico
router.post('/register/complete', verifyRegistration);

export default router;