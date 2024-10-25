export interface AccountRegister {
    user: string;
    pass: string;
    firstName: string;
    lastName: string;
  }
  
  export interface AccountLogin {
    token: string;
    user: string;
    pass: string;
    vigencia: Date;
    creacion: Date;
    sid: string;
    //permisos: Permiso[];
  }