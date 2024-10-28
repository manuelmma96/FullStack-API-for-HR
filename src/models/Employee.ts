export interface Employee {
    id: number;
    cedula: string;
    fullname: string;
    pricePerHour: number;
    activo: boolean;
    cargo_id?: number;
  }

  export interface WorkedHour {
    employee_id: number;
    hours: number;
    horasExtra?: number;
    fechaCorte?: string;
  }