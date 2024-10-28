import { Router } from 'express';
import { authenticateJWT, authorizeAdmin } from '../middleware/auth';
import { getNominas, getNominaByEmployeeId, getNominaByIdAndEmployee, saveNomina } from '../controllers/nominaController';

const router = Router();

// Rutas de Nómina
router.get('/', authenticateJWT, getNominas);  
router.get('/employee/:id', authenticateJWT, getNominaByEmployeeId);  
router.get('/:id/employee/:employeeId', authenticateJWT, getNominaByIdAndEmployee);  
router.post('/', authenticateJWT, authorizeAdmin, saveNomina);  

export default router;