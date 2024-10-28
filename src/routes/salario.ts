import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { validateId } from '../middleware/validateId';
import { getSalarios, addSalario, deleteSalario } from '../controllers/salarioController';

const router = Router();

// Rutas para Salarios
router.get('/', authenticateJWT, getSalarios);
router.post('/', authenticateJWT, addSalario);
router.delete('/:id', authenticateJWT, validateId, deleteSalario);

export default router;