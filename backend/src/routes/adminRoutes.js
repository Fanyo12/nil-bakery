import express from 'express';
import { 
  getAllPedidos, 
  updatePedidoEstado,
  getAllUsuarios 
} from '../controllers/adminController.js';

const router = express.Router();

// ── PEDIDOS ──────────────────────────────
router.get('/pedidos', getAllPedidos);
router.put('/pedidos/:id', updatePedidoEstado);

// ── USUARIOS ──────────────────────────────
router.get('/usuarios', getAllUsuarios);

export default router;