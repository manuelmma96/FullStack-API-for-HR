import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import employeeRoutes from './routes/employee';
import cargoRoutes from './routes/cargo';
import poncheRoutes from './routes/ponche';
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
app.use('/ponche', poncheRoutes);
app.use('/nomina', nominaRoutes);
app.use('/account', accountRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});