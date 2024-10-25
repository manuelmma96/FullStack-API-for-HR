import { Request, Response } from 'express';
import { Employee } from '../models/Employee';
import { HorasTrabajadas } from '../models/Employee';
import { readData, writeData } from '../utils/jsonHandler';

/**
 * 1- Obtener todos los empleados.
 */
export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await readData();
    res.status(200).json(data.employees);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al obtener los empleados', error: errorMessage });
  }
};

/**
 * 2- Obtener un empleado por su ID.
 */
export const getEmployeeById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const data = await readData();
    const employee = data.employees.find((e: Employee) => e.id === parseInt(id));

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
export const getEmployeeHours = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const data = await readData();
    const hours = data.workedHours.filter((h: HorasTrabajadas) => h.employeeId === parseInt(id));

    if (hours.length === 0) {
      res.status(404).json({ message: 'No se encontraron horas trabajadas por este empleado' });
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
export const getEmployeeSalary = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const data = await readData();
    const employee = data.employees.find((e: Employee) => e.id === parseInt(id));
    const horasTrabajadas = data.workedHours.filter((h: HorasTrabajadas) => h.employeeId === parseInt(id));

    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }
    // Suma de todas las horas trabajadas
    const totalHorasTrabajadas = horasTrabajadas.reduce((acc: number, curr: HorasTrabajadas) => acc + curr.hours, 0);

    // Horas estándar por mes
    const salarioMensualStandard = 8 * 23.23;  // 185.84 horas por mes

    // Calcular el salario mensual proporcionalmente
    const salarioMensual = (totalHorasTrabajadas / salarioMensualStandard) * (employee.pricePerHour * salarioMensualStandard);

    res.status(200).json({
      totalHorasTrabajadas,
      salarioMensual: salarioMensual.toFixed(2) //2 decimales
    });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al obtener el salario', error: errorMessage });
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
    const data = await readData();

    data.employees = data.employees || [];

    if (data.employees.some((e: Employee) => e.cedula === cedula)) {
      res.status(400).json({ message: 'Cédula ya registrada' });
      return;
    }

    const newEmployee: Employee = {
      id: data.employees.length + 1,
      cedula,
      fullname,
      pricePerHour,
      activo: true
    };

    data.employees.push(newEmployee);
    await writeData(data);

    res.status(201).json(newEmployee);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al agregar empleado', error: errorMessage });
  }
};

/**
 * 6- Agregar por ID registro horas trabajadas por empleado.
 */
export const addEmployeeHours = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { hours } = req.body;

  if (typeof hours !== 'number' || hours <= 0) {
    res.status(400).json({ message: 'Horas inválidas' });
    return;
  }

  try {
    const data = await readData();
    const employee = data.employees.find((e: Employee) => e.id === parseInt(id));

    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }

    const newRecord = { employeeId: parseInt(id), hours };
    data.workedHours.push(newRecord);

    await writeData(data);
    res.status(201).json(newRecord);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al agregar horas trabajadas', error: errorMessage });
  }
};

/**
 * 7- Actualizar informacion del empleado (solo fullname y pricePerhours).
 */
export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { fullname, pricePerHour } = req.body;

  try {
    const data = await readData();
    const employee = data.employees.find((e: Employee) => e.id === parseInt(id));

    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }

    employee.fullname = fullname || employee.fullname;
    employee.pricePerHour = pricePerHour || employee.pricePerHour;

    await writeData(data);
    res.status(200).json(employee);
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al actualizar empleado', error: errorMessage });
  }
};

/**
 * 8- Soft delete de un empleado y su registro total de horas trabajadas.
 */
export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const data = await readData();
    const employee = data.employees.find((e: Employee) => e.id === parseInt(id));

    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }

    employee.activo = false;
    data.workedHours = data.workedHours.filter((h: HorasTrabajadas) => h.employeeId !== parseInt(id));

    await writeData(data);
    res.status(200).json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al eliminar empleado', error: errorMessage });
  }
};