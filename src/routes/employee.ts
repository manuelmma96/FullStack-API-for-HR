import { Router } from 'express';
import { 
  getEmployees, 
  getEmployeeById, 
  getEmployeeHours, 
  getEmployeeSalary, 
  addEmployee, 
  addEmployeeHours, 
  updateEmployee, 
  deleteEmployee 
} from '../controllers/employeeController';
import { validateId } from '../middleware/validateId';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Rutas de empleados protegidas por autenticación JWT
router.get('/', authenticateJWT, getEmployees);  
router.get('/:id', authenticateJWT, validateId, getEmployeeById);  
router.get('/:id/hours', authenticateJWT, validateId, getEmployeeHours); 
router.get('/:id/salary', authenticateJWT, validateId, getEmployeeSalary); 
router.post('/', authenticateJWT, addEmployee);  
router.post('/:id/hours', authenticateJWT, validateId, addEmployeeHours);  
router.put('/:id', authenticateJWT, validateId, updateEmployee); 
router.delete('/:id', authenticateJWT, validateId, deleteEmployee);  
export default router;