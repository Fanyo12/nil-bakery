import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';
import express from 'express';
import { 
  getAllPedidos, 
  updatePedidoEstado,
  getAllUsuarios 
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/pedidos', verifyToken, isAdmin, getAllPedidos);
router.put('/pedidos/:id', verifyToken, isAdmin, updatePedidoEstado);
router.get('/usuarios', verifyToken, isAdmin, getAllUsuarios);

export default router;