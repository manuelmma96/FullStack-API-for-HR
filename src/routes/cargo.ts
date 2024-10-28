import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { validateId } from '../middleware/validateId';
import { 
  getCargos, 
  getCargoById, 
  getEmpleadosByCargoId, 
  addCargo, 
  addCargoToEmployee, 
  updateCargo, 
  deleteCargo 
} from '../controllers/cargoController';

const router = Router();

// Rutas para Cargo
router.get('/', authenticateJWT, getCargos);
router.get('/:id', authenticateJWT, validateId, getCargoById);
router.get('/:id/employees', authenticateJWT, validateId, getEmpleadosByCargoId);
router.post('/', authenticateJWT, addCargo);
router.post('/:id/employees', authenticateJWT, validateId, addCargoToEmployee);
router.put('/:id', authenticateJWT, validateId, updateCargo);
router.delete('/:id', authenticateJWT, validateId, deleteCargo);

export default router;