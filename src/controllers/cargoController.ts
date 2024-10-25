// controllers/cargoController.ts
import { Request, Response } from 'express';
import { readData, writeData } from '../utils/jsonHandler';
import { Cargo } from '../models/Cargo';

// Obtener todos los cargos
export const getCargos = async (req: Request, res: Response) => {
  try {
    const data = await readData();
    res.json(data.cargos);
  } catch (error) {
    //res.status(500).json({ message: error.message });
  }
};

// Agregar un nuevo cargo
export const addCargo = async (req: Request, res: Response) => {
  const { cargo, activo, isByPass } = req.body;

  try {
    const data = await readData();

    const newCargo: Cargo = {
      id: data.cargos.length + 1,
      cargo,
      activo,
      isByPass
    };

    data.cargos.push(newCargo);
    await writeData(data);

    res.status(201).json(newCargo);
  } catch (error) {
    //res.status(500).json({ message: error.message });
  }
};