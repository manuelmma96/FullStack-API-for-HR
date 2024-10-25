export interface Nomina {
    empleadoId: number;
    salario: number;
    horasTrabajadas: number;
    horasExtras: number;
    totalDineroHorasExtras: number;
    fechaGeneracionNomina: Date;
    corteNomina: string;
    generadoPor: number; 
    totalAPagar: number;
  }