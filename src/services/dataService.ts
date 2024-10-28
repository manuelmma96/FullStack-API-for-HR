import { readData, writeData } from '../utils/jsonHandler'; 
import bcrypt from 'bcryptjs';
import { Account } from '../models/Account';
import { Employee } from '../models/Employee';
import { Cargo } from '../models/Cargo';
import { WorkedHour } from '../models/WorkedHour';
import { Salario } from '../models/Salario';
import { Nomina } from '../models/Nomina';


export class DataService {

// *** MÉTODO PARA ACCOUNT ***
  async getAccounts(): Promise<Account[]> {
    const data = await readData();
    return data.accounts || [];
  }

  async saveAccounts(accounts: Account[]): Promise<void> {
    const data = await readData();
    data.accounts = accounts;
    await writeData(data);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }


  // ** MÉTODOS PARA EMPLOYEE ***

  async getEmployees(): Promise<Employee[]> {
    const data = await readData();
    return data.employees || [];
  }

  async saveEmployees(employees: Employee[]): Promise<void> {
    const data = await readData();
    data.employees = employees;
    await writeData(data);
  }

  async getEmployeeById(id: number): Promise<Employee | undefined> {
    const employees = await this.getEmployees();
    return employees.find((e) => e.id === id);
  }

  async updateEmployee(updatedEmployee: Employee): Promise<void> {
    const employees = await this.getEmployees();
    const index = employees.findIndex((e) => e.id === updatedEmployee.id);

    if (index !== -1) {
      employees[index] = updatedEmployee;
      await this.saveEmployees(employees);
    }
  }

  // *** MÉTODOS WORKED HOURS ***

  async getWorkedHours(employee_id?: number): Promise<WorkedHour[]> {
    const data = await readData();
    const hours = data.workedHours || [];
    return employee_id ? hours.filter((h: WorkedHour) => h.employee_id === employee_id) : hours;
  }

  async saveWorkedHours(workedHours: WorkedHour[]): Promise<void> {
    const data = await readData();
    data.workedHours = workedHours;
    await writeData(data);
  }

  async addWorkedHour(newRecord: WorkedHour): Promise<void> {
    const data = await readData();
    data.workedHours.push(newRecord);
    await writeData(data);
  }

  // *** MÉTODOS PARA CARGOS ***

  async getCargos(): Promise<Cargo[]> {
    const data = await readData();
    return data.cargos || [];
  }

  async saveCargos(cargos: Cargo[]): Promise<void> {
    const data = await readData();
    data.cargos = cargos;
    await writeData(data);
  }

  async getCargoById(id: number): Promise<Cargo | undefined> {
    const cargos = await this.getCargos();
    return cargos.find((c) => c.id === id);
  }

  async addCargo(newCargo: Cargo): Promise<void> {
    const cargos = await this.getCargos();
    cargos.push(newCargo);
    await this.saveCargos(cargos);
  }

  async updateCargo(updatedCargo: Cargo): Promise<void> {
    const cargos = await this.getCargos(); 
    const index = cargos.findIndex((c) => c.id === updatedCargo.id); 
  
    if (index !== -1) {
      cargos[index] = updatedCargo; 
      await this.saveCargos(cargos); 
    } else {
      throw new Error('Cargo no encontrado para actualizar');
    }
  }

  async hasEmployeesWithCargo(cargoId: number): Promise<boolean> {
    const employees = await this.getEmployees();
    return employees.some((e) => e.cargo_id === cargoId);
  }

  // *** MÉTODOS PARA SALARIOS ***



  async getSalarios(): Promise<Salario[]> {
    const data = await readData();
    return data.salarios || [];
  }


  async saveSalarios(salarios: Salario[]): Promise<void> {
    const data = await readData();
    data.salarios = salarios;
    await writeData(data);
  }


  async getNominas(): Promise<Nomina[]> {
      const data = await readData();
      return data.nominas || [];
  }

  async addNomina(newNomina: Nomina): Promise<void> {
      const data = await readData();
      data.nominas.push(newNomina);
      await writeData(data);
  }
  

  async saveNomina(nomina: Nomina): Promise<void> {
      const data = await readData();
      data.nominas.push(nomina);
      await writeData(data);
  }

  
}
     
