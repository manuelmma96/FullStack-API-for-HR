import { Request, Response } from 'express';
import { HORAS_MENSUALES_STANDARD, PORCENTAJE_EXTRA } from '../utils/constants';
import { DataService } from '../services/dataService';
import { Nomina } from '../models/Nomina';

const dataService = new DataService();

// 1- Obtener todas las nóminas
export const getNominas = async (req: Request, res: Response): Promise<void> => {
  try {
    const nominas = await dataService.getNominas();
    res.status(200).json(nominas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener nóminas', error: (error as Error).message });
  }
};

// 2- Obtener nóminas de un empleado por ID
export const getNominaByEmployeeId = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const nominas = await dataService.getNominas();
    const employeeNominas = nominas.filter((n) => n.employee_id === parseInt(id));

    if (employeeNominas.length === 0) {
      res.status(404).json({ message: 'No se encontraron nóminas para este empleado.' });
      return;
    }

    res.status(200).json(employeeNominas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener nóminas del empleado', error: (error as Error).message });
  }
};

// 3- Obtener una nómina específica por ID y empleado
export const getNominaByIdAndEmployee = async (req: Request<{ id: string; employeeId: string }>, res: Response): Promise<void> => {
  const { id, employeeId } = req.params;

  try {
    const nominas = await dataService.getNominas();
    const nomina = nominas.find((n) => n.id === parseInt(id) && n.employee_id === parseInt(employeeId));

    if (!nomina) {
      res.status(404).json({ message: 'Nómina no encontrada para este empleado.' });
      return;
    }

    res.status(200).json(nomina);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la nómina', error: (error as Error).message });
  }
};

// 4- Guardar una nueva nómina
export const saveNomina = async (req: Request, res: Response): Promise<void> => {
    const { user } = req;
  
    if (user.role !== 'Admin123') {
      res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden generar nóminas.' });
      return;
    }
  
    const { employee_id, fechaGeneracion, corteNomina } = req.body;
  
    try {
      const employee = await dataService.getEmployeeById(employee_id);
      const workedHours = await dataService.getWorkedHours(employee_id);
  
      if (!employee) {
        res.status(404).json({ message: 'Empleado no encontrado.' });
        return;
      }
  
      const totalHorasTrabajadas = workedHours.reduce((acc: number, curr) => acc + curr.hours, 0);
      const horasExtra = totalHorasTrabajadas > HORAS_MENSUALES_STANDARD
        ? totalHorasTrabajadas - HORAS_MENSUALES_STANDARD
        : 0;
  
      const montoHorasExtra = horasExtra * employee.pricePerHour * PORCENTAJE_EXTRA;
      const salarioBase = HORAS_MENSUALES_STANDARD * employee.pricePerHour;
      const pagaTotal = salarioBase + montoHorasExtra;
  
      const newNomina: Nomina = {
        id: Date.now(),
        employee_id,
        salario: salarioBase,
        workedHours: totalHorasTrabajadas, // Total de horas en lugar de array
        extraHours: horasExtra,
        totalMontoExtraHours: montoHorasExtra,
        fechaGeneracion,
        corteNomina,
        pagaTotal,
      };
  
      await dataService.addNomina(newNomina);
  
      res.status(201).json({ message: 'Nómina generada exitosamente.', nomina: newNomina });
    } catch (error) {
      res.status(500).json({ message: 'Error al generar nómina.', error: (error as Error).message });
    }
  };