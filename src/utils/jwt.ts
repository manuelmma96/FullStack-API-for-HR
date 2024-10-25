import jwt from 'jsonwebtoken';

// Lee la clave secreta desde las variables de entorno o usa un valor por defecto
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

/**
 * Genera un token JWT.
 * @param payload - Datos que se incluirán en el token.
 * @returns Un token firmado.
 */
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * Verifica la validez de un token JWT.
 * @param token - El token a verificar.
 * @returns El payload del token si es válido.
 */
export const verifyToken = (token: string): object | string => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};