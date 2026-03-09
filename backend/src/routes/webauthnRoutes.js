import express from 'express';
import { generateRegistration } from '../controllers/webauthnController.js';

const router = express.Router();

// Ruta para INICIAR el registro biométrico
// POST /api/webauthn/register/begin
router.post('/register/begin', generateRegistration);

export default router;