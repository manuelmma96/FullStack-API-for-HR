import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { Cargo } from '../models/Cargo';
import { Employee } from '../models/Employee';

const dataService = new DataService(); // Instancia del servicio

// 1- Obtener todos los cargos
export const getCargos = async (req: Request, res: Response): Promise<void> => {
  try {
    const cargos = await dataService.getCargos();
    res.status(200).json(cargos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cargos', error: (error as Error).message });
  }
};

// 2- Obtener un cargo por ID
export const getCargoById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const cargo = await dataService.getCargoById(parseInt(id));

    if (!cargo) {
      res.status(404).json({ message: 'Cargo no encontrado' });
      return;
    }

    res.status(200).json(cargo);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cargo', error: (error as Error).message });
  }
};

// 3- Obtener empleados por ID de cargo
export const getEmpleadosByCargoId = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const cargos = await dataService.getCargos();
    const employees = await dataService.getEmployees();

    const cargo = cargos.find((c) => c.id === parseInt(id));
    if (!cargo) {
      res.status(404).json({ message: 'Cargo no encontrado.' });
      return;
    }

    const empleadosDelCargo = employees.filter((e) => e.cargo_id === cargo.id);

    if (empleadosDelCargo.length === 0) {
      res.status(404).json({ message: 'No se encontraron empleados para este cargo.' });
      return;
    }

    res.status(200).json(empleadosDelCargo);
  } catch (error: unknown) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ message: 'Error al obtener empleados por cargo', error: errorMessage });
  }
};

// 4- Agregar un nuevo cargo
export const addCargo = async (req: Request, res: Response): Promise<void> => {
  const { titulo, salario_id } = req.body;

  if (!titulo || typeof salario_id !== 'number') {
    res.status(400).json({ message: 'Datos inválidos. Verifica el payload enviado.' });
    return;
  }

  try {
    const cargos = await dataService.getCargos();
    console.log('Cargos actuales:', cargos); // Log para ver los cargos actuales

    const newId = cargos.length > 0 ? Math.max(...cargos.map(c => c.id)) + 1 : 1;  //Usamos Math.max para generar un nuevo ID

    const newCargo: Cargo = {
      id: newId,
      titulo,
      salario_id,
      isByPass: true,
      active: true
    };

    await dataService.addCargo(newCargo);

    const updatedCargos = await dataService.getCargos();
    console.log('Cargos después de agregar:', updatedCargos); 

    res.status(201).json(newCargo);
  } catch (error) {
    console.error('Error en addCargo:', error);
    res.status(500).json({ message: 'Error al agregar cargo', error: (error as Error).message });
  }
};

// 5- Asignar cargo a un empleado
export const addCargoToEmployee = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params; 
  const { empleado_id } = req.body; 

  try {
    const cargos = await dataService.getCargos();
    const employees = await dataService.getEmployees();

    const cargo = cargos.find((c) => c.id === parseInt(id));
    if (!cargo) {
      res.status(404).json({ message: 'Cargo no encontrado' });
      return;
    }

    const employee = employees.find((e) => e.id === empleado_id);
    if (!employee) {
      res.status(404).json({ message: 'Empleado no encontrado' });
      return;
    }

    employee.cargo_id = cargo.id;

    await dataService.saveEmployees(employees);

    res.status(200).json({
      message: 'Cargo asignado al empleado exitosamente',
      empleado: employee
    });
  } catch (error) {
    console.error('Error al asignar cargo:', error);
    res.status(500).json({ message: 'Error al asignar cargo', error: (error as Error).message });
  }
};


// 6- Actualizar un cargo
export const updateCargo = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params; 
  const { titulo, salario_id } = req.body; 

  if (!titulo || typeof salario_id !== 'number') {
    res.status(400).json({ message: 'El título y el salario_id son requeridos.' });
    return;
  }

  try {
    const cargos = await dataService.getCargos(); 
    const cargo = cargos.find((c) => c.id === parseInt(id));

    if (!cargo) {
      res.status(404).json({ message: 'Cargo no encontrado.' });
      return;
    }

    cargo.titulo = titulo;
    cargo.salario_id = salario_id;

    console.log('Cargos antes de guardar:', cargos);
    await dataService.saveCargos(cargos);

    const updatedCargos = await dataService.getCargos();
    console.log('Cargos después de guardar:', updatedCargos);

    res.status(200).json({ message: 'Cargo actualizado exitosamente.', cargo });
  } catch (error) {
    console.error('Error al actualizar cargo:', error);
    res.status(500).json({ message: 'Error al actualizar cargo.', error: (error as Error).message });
  }
};


// 7- Soft delete de un cargo
export const deleteCargo = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const cargos = await dataService.getCargos();
    const cargo = cargos.find((c) => c.id === parseInt(id));

    if (!cargo) {
      res.status(404).json({ message: 'Cargo no encontrado' });
      return;
    }

    const employees = await dataService.getEmployees();
    const empleadosVinculados = employees.some((e) => e.cargo_id === parseInt(id));

    if (empleadosVinculados) {
      res.status(400).json({ message: 'No se puede eliminar, tiene empleados vinculados' });
      return;
    }

    cargo.active = false;
    await dataService.saveCargos(cargos);

    res.status(200).json({ message: 'Cargo eliminado (soft delete)' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cargo', error: (error as Error).message });
  }
};