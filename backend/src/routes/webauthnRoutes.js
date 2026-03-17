import express from 'express';
import {
  generateRegistration,
  verifyRegistration,
  generateAuthentication,
  verifyAuthentication
} from '../controllers/webauthnController.js';


const router = express.Router();

// iniciar registro biométrico
router.post('/register/begin', generateRegistration);

// completar registro biométrico
router.post('/register/complete', verifyRegistration);

router.post('/login/begin', generateAuthentication);
router.post('/login/complete', verifyAuthentication);
export default router;