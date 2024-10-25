// controllers/nominaController.ts
import { Request, Response } from 'express';
import { readData, writeData } from '../utils/jsonHandler';
import { Nomina } from '../models/Nomina';

// Obtener todas las nóminas
export const getNominas = async (req: Request, res: Response) => {
  try {
    const data = await readData();
    res.json(data.nominas);
  } catch (error) {
    //res.status(500).json({ message: error.message });
  }
};

// Agregar una nueva nómina
export const addNomina = async (req: Request, res: Response) => {
  const {
    empleadoId,
    salario,
    horasTrabajadas,
    horasExtras,
    totalDineroHorasExtras,
    corteNomina,
    generadoPor
  } = req.body;

  try {
    const data = await readData();

    const totalAPagar = salario + totalDineroHorasExtras;

    const newNomina: Nomina = {
      empleadoId,
      salario,
      horasTrabajadas,
      horasExtras,
      totalDineroHorasExtras,
      fechaGeneracionNomina: new Date(),
      corteNomina,
      generadoPor,
      totalAPagar
    };

    data.nominas.push(newNomina);
    await writeData(data);

    res.status(201).json(newNomina);
  } catch (error) {
    //res.status(500).json({ message: error.message });
  }
};