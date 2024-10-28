import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.resolve(__dirname, '../database/data.json'); 

export const readData = async (): Promise<any> => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');

    if (!data || data.trim() === '') {
      console.warn('El archivo JSON está vacío, inicializando datos.');
      return { cargos: [], empleados: [], workedHours: [] }; 
    }

    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    throw new Error('No se pudo leer la base de datos');
  }
};

export const writeData = async (newData: any): Promise<void> => {
  try {
    const jsonData = JSON.stringify(newData, null, 2);

    await fs.writeFile(DATA_PATH, jsonData, 'utf-8');
    console.log('Datos guardados correctamente en data.json');
  } catch (error) {
    console.error('Error al escribir en el archivo:', error);
    throw new Error('No se pudo actualizar la base de datos');
  }
};