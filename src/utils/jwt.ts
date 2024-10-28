import jwt from 'jsonwebtoken';

// Clave secreta desde variables de entorno o valor por defecto
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Genera un token JWT con un payload
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

// Verifica la validez de un token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

// Verifica si el token expirará pronto
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as { exp: number | undefined };
    const now = Math.floor(Date.now() / 1000);
    return !!decoded?.exp && decoded.exp - now < 300;
  } catch {
    return false;
  }
};