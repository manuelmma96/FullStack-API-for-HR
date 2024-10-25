// controllers/poncheController.ts
import { Request, Response } from 'express';
import { readData, writeData } from '../utils/jsonHandler';
import { Ponche } from '../models/Ponche';

// Obtener todos los ponches
export const getPonches = async (req: Request, res: Response) => {
  try {
    const data = await readData();
    res.json(data.ponches);
  } catch (error) {
    //res.status(500).json({ message: error.message });
  }
};

// Registrar un nuevo ponche
export const addPonche = async (req: Request, res: Response) => {
  const { fechaEntrada, fechaSalida, empleadoId } = req.body;

  try {
    const data = await readData();

    const newPonche: Ponche = {
      poncheId: data.ponches.length + 1,
      fechaEntrada: new Date(fechaEntrada),
      fechaSalida: new Date(fechaSalida),
      empleadoId
    };

    data.ponches.push(newPonche);
    await writeData(data);

    res.status(201).json(newPonche);
  } catch (error) {
    //res.status(500).json({ message: error.message });
  }
};