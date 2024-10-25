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
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Rutas de empleados protegidas por autenticación JWT
router.get('/', authenticateJWT, getEmployees);  
router.get('/:id', authenticateJWT, getEmployeeById);  
router.get('/:id/hours', authenticateJWT, getEmployeeHours); 
router.get('/:id/salary', authenticateJWT, getEmployeeSalary); 
router.post('/', authenticateJWT, addEmployee);  
router.post('/:id/hours', authenticateJWT, addEmployeeHours);  
router.put('/:id', authenticateJWT, updateEmployee); 
router.delete('/:id', authenticateJWT, deleteEmployee);  
export default router;