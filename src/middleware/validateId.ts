import { Request, Response, NextFunction } from 'express';

// Middleware para validar que el ID sea un número válido
export const validateId = (req: Request<{ id: string }>, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    res.status(400).json({ message: 'ID inválido. Favor proveer un valor numérico valido.' });
    return;
  }

  next(); 
};