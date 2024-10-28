import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import employeeRoutes from './routes/employee';
import cargoRoutes from './routes/cargo';
import salarioRoutes from './routes/salario';
//import poncheRoutes from './routes/ponche';
import nominaRoutes from './routes/nomina';
import accountRoutes from './routes/account';


const app = express();
const PORT = process.env.PORT || 5100;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Rutas
app.use('/employee', employeeRoutes);
app.use('/cargo', cargoRoutes);
app.use('/salarios', salarioRoutes); 
//app.use('/ponche', poncheRoutes);
app.use('/nomina', nominaRoutes);
app.use('/account', accountRoutes);


//Ruta Raíz
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).json({ message: 'API funcionando correctamente' });
});

app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});