import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { Employee } from '../models/Employee';
import { WorkedHour } from '../models/WorkedHour';
//import { HORAS_DIARIAS } from '../constants';
//import { DIAS_LABORABLES_MENSUALES } from '../constants';
import { HORAS_MENSUALES_STANDARD } from '../utils/constants';



const dataService = new DataService();  

/**
 * 1- Obtener todos los empleados.
 */
export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await dataService.getEmployees();

    if (!employees || employees.length === 0) {
    res.status(404).json({ message: 'No se encontraron empleados.' });
    return;
    }

    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener empleados', error: (error as Error).message });
  }
};

/**
 * 2- Obtener un empleado por su ID.
 */
export const getEmployeeById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const employees = await dataService.getEmployees();
    const employee = employees.find((e: Employee) => e.id === parseInt(id));

    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }

    res.status(200).json(employee);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al obtener el empleado', error: errorMessage });
  }
};

/**
 * 3- Obtener por ID registro horas trabajadas por empleado.
 */
export const getEmployeeHours = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const hours = await dataService.getWorkedHours(parseInt(id));

    if (!hours || hours.length === 0) {
      res.status(404).json({ message: 'No se encontraron horas para este empleado.' });
      return;
    }

    res.status(200).json(hours);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al obtener horas trabajadas', error: errorMessage });
  }
};

/**
 * 4- Obtener el salario total por ID.
 */
export const getEmployeeSalary = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const employees = await dataService.getEmployees();
    const cargos = await dataService.getCargos();
    const salarios = await dataService.getSalarios();
    const workedHours = await dataService.getWorkedHours(parseInt(id));

    if (!Array.isArray(workedHours)) {
      res.status(500).json({ message: 'Error al obtener las horas trabajadas' });
      return;
    }

    const employee = employees.find((e: Employee) => e.id === parseInt(id));
    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }

    const cargo = cargos.find((c) => c.id === employee.cargo_id);

    if (!cargo) {
      console.warn(`Cargo con ID ${employee.cargo_id} no encontrado para el empleado ${employee.fullname}.`);
      res.status(404).json({ message: `Cargo con ID ${employee.cargo_id} no encontrado.` });
      return;
    }

    const salario = salarios.find((s) => s.id === cargo.salario_id);
    if (!salario) {
      res.status(404).json({ message: 'Salario no encontrado para este cargo.' });
      return;
    }

    // Suma total de horas trabajadas por el empleado
    const totalHorasTrabajadas = workedHours.reduce(
      (acc: number, curr: WorkedHour) => acc + curr.hours,
      0
    );

    // Calcular el salario mensual
    const salarioMensual = totalHorasTrabajadas > 0 
      ? (totalHorasTrabajadas / HORAS_MENSUALES_STANDARD) * salario.monto 
      : 0;

    // Respuesta al cliente
    res.status(200).json({
      id: employee.id,
      totalHorasTrabajadas,
      salarioBase: salario.monto, 
      salarioMensual: salarioMensual.toFixed(2) 
    });
  } catch (error: unknown) {
    console.error('Error al obtener el salario:', error);
    res.status(500).json({ 
      message: 'Error al obtener el salario', 
      error: (error as Error).message 
    });
  }
};

/**
 * 5- Agregar un nuevo empleado.
 */
export const addEmployee = async (req: Request, res: Response): Promise<void> => {
  const { cedula, fullname, pricePerHour } = req.body;

  if (!cedula || !fullname || typeof pricePerHour !== 'number') {
    res.status(400).json({ message: 'Datos inválidos. Verifica el payload enviado.' });
    return;
  }

  try {
    const employees = await dataService.getEmployees();

    if (employees.some((e: Employee) => e.cedula === cedula)) {
      res.status(400).json({ message: 'Cédula ya registrada' });
      return;
    }

    const newEmployee: Employee = {
      id: employees.length + 1,
      cedula,
      fullname,
      pricePerHour,
      activo: true
    };

    employees.push(newEmployee);
    await dataService.saveEmployees(employees);
    res.status(201).json(newEmployee);
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al agregar empleado', error: errorMessage });
  }
};

/**
 * 6- Agregar por ID registro horas trabajadas por empleado.
 */
export const addEmployeeHours = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const { hours } = req.body;

  if (typeof hours !== 'number' || hours <= 0) {
    res.status(400).json({ message: 'Horas inválidas' });
    return;
  }

  try {
    const employees = await dataService.getEmployees();
    const employee = employees.find((e) => e.id === parseInt(id));

    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }

    const newRecord: WorkedHour = {
      employee_id: parseInt(id),
      hours,
    };

    // Agregar el nuevo registro sin sobrescribir los existentes
    await dataService.addWorkedHour(newRecord);

    res.status(201).json({ message: 'Horas registradas correctamente', newRecord });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al registrar horas', error: errorMessage });
  }
};

/**
 * 7- Actualizar informacion del empleado (solo fullname y pricePerhours).
 */
export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { fullname, pricePerHour } = req.body;

  try {
    const employees = await dataService.getEmployees();
    const employee = employees.find((e: Employee) => e.id === parseInt(id));

    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }

    employee.fullname = fullname || employee.fullname;
    employee.pricePerHour = pricePerHour || employee.pricePerHour;

    await dataService.saveEmployees(employees);
    res.status(200).json(employee);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al actualizar empleado', error: errorMessage });
  }
};

/**
 * 8- Soft delete de un empleado y su registro total de horas trabajadas.
 */
export const deleteEmployee = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const employees = await dataService.getEmployees();
    const employee = employees.find((e) => e.id === parseInt(id));

    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }

    // Marcar al empleado como inactivo (soft delete)
    employee.activo = false;

    // Obtener todas las horas trabajadas
    const allWorkedHours = await dataService.getWorkedHours();

    // Filtrar para mantener solo las horas de empleados distintos al que se elimina
    const updatedHours = allWorkedHours.filter((h: WorkedHour) => h.employee_id !== parseInt(id));

    // Guardar las horas filtradas
    await dataService.saveWorkedHours(updatedHours);

    // Guardar la lista actualizada de empleados
    await dataService.saveEmployees(employees);

    res.status(200).json({ message: 'Empleado eliminado correctamente con (soft delete)' });
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al eliminar empleado', error: errorMessage });
  }
};

