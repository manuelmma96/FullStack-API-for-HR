import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';
import { Account } from '../models/Account'; 

const dataService = new DataService(); 

//Login de usuario 

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const accounts = await dataService.getAccounts();
    const user = accounts.find((acc) => acc.username === username);

    if (!user) {
      res.status(401).json({ message: 'Usuario no encontrado.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Contraseña incorrecta.' });
      return;
    }

    const token = generateToken({ user: user.username, role: user.role });

    res.cookie('token', token, { httpOnly: true }).json({ message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: (error as Error).message });
  }
};
  
 //Registro de usuario  
 export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, firstName, lastName, role } = req.body;

  // Validamos que todos los campos estén presentes
  if (!username || !password || !firstName || !lastName || !role) {
    res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    return;
  }

  try {
    const accounts = await dataService.getAccounts();

    // Verificamos si ya existe un usuario con el mismo username
    const existingUser = accounts.find((acc) => acc.username === username);
    if (existingUser) {
      res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
      return;
    }

    // Encriptamos la contraseña
    const hashedPassword = await dataService.hashPassword(password);

    // Creamos un nuevo objeto Account, asegurando que todas las propiedades estén asignadas
    const newAccount: Account = {
      id: accounts.length + 1,
      username: username, // Uso explícito de las propiedades
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      role: role, // Asignación explícita del role
    };

    // Guardamos el nuevo usuario
    accounts.push(newAccount);
    await dataService.saveAccounts(accounts);

    res.status(201).json({ message: 'Usuario registrado exitosamente.', account: newAccount });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario.', error: (error as Error).message });
  }
};