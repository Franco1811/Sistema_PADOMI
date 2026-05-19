// DTO para el registro de personal en el caso de uso Gestionar Cuentas de Personal (CU-02)
// Valida los datos recibidos en la petición (DNI, correo, rol, etc.).

export class RegistroPersonalDto {
  dni!: string;
  nombre!: string;
  apellido!: string;
  email!: string;
  password!: string;
  rol!: 'MEDICO' | 'ENFERMERO' | 'ADMINISTRATIVO';
  especialidad?: string;

  validar(): void {
    if (!this.dni || !/^\d{8}$/.test(this.dni)) {
      throw new Error("DNI inválido");
    }
    if (!this.nombre || this.nombre.length < 2) {
      throw new Error("Nombre inválido");
    }
    if (!this.apellido || this.apellido.length < 2) {
      throw new Error("Apellido inválido");
    }
    if (!this.email || !this.email.includes('@')) {
      throw new Error("Email institucional inválido");
    }
    if (!this.password || this.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }
    if (!this.rol || !['MEDICO', 'ENFERMERO', 'ADMINISTRATIVO'].includes(this.rol)) {
      throw new Error("Rol inválido");
    }
    if (this.rol === 'MEDICO' && !this.especialidad) {
      throw new Error("Médico debe tener especialidad");
    }
  }
}
