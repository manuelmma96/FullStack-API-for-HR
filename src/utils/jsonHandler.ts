import fs from 'fs/promises';

const DATA_PATH = './src/database/data.json';

/**
 * Lee los datos desde el archivo JSON.
 * @returns {Promise<any>} - Los datos parseados del archivo JSON.
 */
export const readData = async (): Promise<any> => {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    throw new Error('No se pudo leer la base de datos');
  }
};

/**
 * Escribe nuevos datos en el archivo JSON.
 * @param newData - La nueva estructura de datos que se guardará.
 */
export const writeData = async (newData: any): Promise<void> => {
  try {
    const jsonData = JSON.stringify(newData, null, 2);
    await fs.writeFile(DATA_PATH, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error al escribir en el archivo:', error);
    throw new Error('No se pudo actualizar la base de datos');
  }
};