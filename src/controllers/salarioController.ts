import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { Salario } from '../models/Salario';

const dataService = new DataService();

/**
 * Obtener todos los salarios.
 */
export const getSalarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const salarios = await dataService.getSalarios();
    res.status(200).json(salarios);
  } catch (error) {
    console.error('Error al obtener los salarios:', error);
    res.status(500).json({ message: 'Error al obtener los salarios', error: (error as Error).message });
  }
};

/**
 * Agregar un nuevo salario.
 */
export const addSalario = async (req: Request, res: Response): Promise<void> => {
  const { monto, cargo_id } = req.body;

  if (typeof monto !== 'number' || monto <= 0 || typeof cargo_id !== 'number') {
    res.status(400).json({ message: 'Monto y cargo_id válidos son requeridos.' });
    return;
  }

  try {
    const salarios = await dataService.getSalarios();
    const newSalario: Salario = {
      id: salarios.length + 1,
      monto,
      cargo_id,
    };

    salarios.push(newSalario);
    await dataService.saveSalarios(salarios);

    res.status(201).json({ message: 'Salario agregado exitosamente.', newSalario });
  } catch (error) {
    console.error('Error al agregar salario:', error);
    res.status(500).json({ message: 'Error al agregar salario', error: (error as Error).message });
  }
};

/**
 * Soft delete de un salario (solo si no está asignado a un cargo).
 */
export const deleteSalario = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const cargos = await dataService.getCargos();
    const salarioAsignado = cargos.some((cargo) => cargo.salario_id === parseInt(id));

    if (salarioAsignado) {
      res.status(400).json({ message: 'El salario que va a borrar ya está asignado a un cargo.' });
      return;
    }

    const salarios = await dataService.getSalarios();
    const updatedSalarios = salarios.filter((salario) => salario.id !== parseInt(id));

    await dataService.saveSalarios(updatedSalarios);

    res.status(200).json({ message: 'Salario eliminado correctamente (soft delete).' });
  } catch (error) {
    console.error('Error al eliminar salario:', error);
    res.status(500).json({ message: 'Error al eliminar salario', error: (error as Error).message });
  }
};