import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any; // Puedes definir un tipo más específico si lo deseas
  }
}