import express from 'express';
import { generateRegistration, verifyRegistration } from '../controllers/webauthnController.js';

const router = express.Router();

// Ruta para INICIAR registro (ya existía)
router.post('/register/begin', generateRegistration);

// NUEVA RUTA: Completar registro
router.post('/register/complete', verifyRegistration);

export default router;