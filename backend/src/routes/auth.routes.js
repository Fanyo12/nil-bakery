import express from 'express';
import { registerOptions, loginOptions } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register/options', registerOptions);
router.post('/login/options', loginOptions);

export default router;
