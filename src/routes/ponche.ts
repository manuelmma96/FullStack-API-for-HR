// src/routes/ponche.ts
import { Router } from 'express';
import { getPonches, addPonche } from '../controllers/poncheController';

const router = Router();

router.get('/', getPonches);     // Obtener todos los ponches
router.post('/', addPonche);     // Registrar un nuevo ponche

export default router;