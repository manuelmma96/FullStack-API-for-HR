// src/routes/nomina.ts
import { Router } from 'express';
import { getNominas, addNomina } from '../controllers/nominaController';

const router = Router();

router.get('/', getNominas);     // Obtener todas las nóminas
router.post('/', addNomina);     // Crear una nueva nómina

export default router;