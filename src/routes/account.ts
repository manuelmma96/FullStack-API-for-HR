import { Router, Request, Response } from 'express';
import { generateToken } from '../utils/jwt';
import { DataService } from '../services/dataService';
import { login, register } from '../controllers/accountController';
import bcrypt from 'bcryptjs';
import { Account } from '../models/Account';

const router = Router();

router.post('/login', login);

router.post('/register', register);

export default router;

const dataService = new DataService();

// Login de usuario
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const accounts = await dataService.getAccounts();
    const user = accounts.find((acc) => acc.username === username);

    if (!user) {
      res.status(401).json({ message: 'Usuario no encontrado' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = generateToken({ user: user.username, role: user.role });

      // Send the token in an HTTP-only cookie
      res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso' });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: (error as Error).message });
  }
});

// Registro de usuario
router.post('/register', async (req: Request, res: Response) => {
  const { username, password, firstName, lastName } = req.body;

  if (!username || !password || !firstName || !lastName) {
    res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    return;
  }

  try {
    const accounts = await dataService.getAccounts();
    const existingUser = accounts.find((acc) => acc.username === username);

    if (existingUser) {
    res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
    return;
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Proper hashing

    const newAccount: Account = {
      id: accounts.length + 1,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'Admin123',
    };

    accounts.push(newAccount);
    await dataService.saveAccounts(accounts);

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario.', error: (error as Error).message });
  }
});