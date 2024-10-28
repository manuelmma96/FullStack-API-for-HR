import { Request, Response, NextFunction } from 'express';
import { generateToken, verifyToken, isTokenExpiringSoon } from '../utils/jwt';

// Middleware de autenticación JWT
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'Acceso no autorizado, token no proporcionado' });
    return;
  }

  try {
    const decoded: any = verifyToken(token);

    // Verificar si el token está cerca de expirar
    if (isTokenExpiringSoon(token)) {
      const newToken = generateToken({ user: decoded.user, role: decoded.role });
      res.cookie('token', newToken, { httpOnly: true });
    }

    req.user = decoded; // Almacena el usuario en la solicitud
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware para verificar si el usuario es administrador
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'Admin123') {
    res.status(403).json({ message: 'Acceso denegado. Solo administradores pueden acceder.' });
    return;
  }
  next();
};