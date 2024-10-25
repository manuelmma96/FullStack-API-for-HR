import { Router } from 'express';
import { getCargos, addCargo } from '../controllers/cargoController';

const router = Router();

router.get('/', getCargos);      // Obtener todos los cargos
router.post('/', addCargo);      // Agregar un nuevo cargo

export default router;