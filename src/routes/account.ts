import { Router, Request, Response } from 'express';
import { generateToken } from '../utils/jwt';

const router = Router();
const JWT_SECRET = 'supersecretkey';

// Ruta de Login: Genera un token JWT si las credenciales son correctas
router.post('/login', (req: Request, res: Response) => {
  const { user, pass } = req.body;

  if (user === 'admin' && pass === 'admin123') {
    const token = generateToken({ user, role: 'admin' });

    // Enviamos el token en una cookie HTTP-only para seguridad
    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso' });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

export default router;