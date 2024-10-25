export interface Employee {
    id: number;
    cedula: string;
    fullname: string;
    pricePerHour: number;
    activo: boolean;
  }

export interface HorasTrabajadas {
    employeeId: number;
    hours: number;
  }