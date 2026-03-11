import express from 'express';
import { 
  registerOptions,      // 👈 antes era generateRegistration
  verifyRegistration     // 👈 este sí está bien
} from '../controllers/webauthnController.js';

const router = express.Router();

// Ruta para INICIAR registro
router.post('/register/begin', registerOptions);  // 👈 actualizado

// Ruta para COMPLETAR registro
router.post('/register/complete', verifyRegistration);

export default router;