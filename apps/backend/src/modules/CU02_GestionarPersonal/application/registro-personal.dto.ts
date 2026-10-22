// DTO para el registro de personal en el caso de uso Gestionar Cuentas de Personal (CU-02)
// Valida los datos recibidos en la petición (DNI, correo, rol, etc.).

export class RegistroPersonalDto {
  dni!: string;
  nombre!: string;
  apellido!: string;
  email!: string;
  password!: string;
  rol!: 'MEDICO' | 'ADMIN';
  especialidad?: string;
  activo?: boolean;

  static validarNombre(valor: string | undefined, campo: string): void {
    if (!valor || !/^[\p{L}]+(?:[ '\u002D][\p{L}]+)*$/u.test(valor.trim())) {
      throw new Error(`${campo} inválido. Solo se permiten letras, espacios, apóstrofes y guiones`);
    }
  }

  static validarEmail(valor: string | undefined): void {
    if (!valor || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor.trim())) {
      throw new Error('Email institucional inválido');
    }
  }

  static validarPassword(valor: string | undefined): void {
    if (!valor || valor.length < 8 || !/[a-z]/.test(valor) || !/[A-Z]/.test(valor) || !/\d/.test(valor) || !/[^\w\s]/.test(valor)) {
      throw new Error('La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo');
    }
  }

  validar(): void {
    if (!this.dni || !/^\d{8}$/.test(this.dni)) {
      throw new Error("DNI inválido");
    }
    RegistroPersonalDto.validarNombre(this.nombre, 'Nombre');
    RegistroPersonalDto.validarNombre(this.apellido, 'Apellido');
    RegistroPersonalDto.validarEmail(this.email);
    RegistroPersonalDto.validarPassword(this.password);
    if (!this.rol || !['MEDICO', 'ADMIN'].includes(this.rol)) {
      throw new Error("Rol inválido");
    }
    if (this.rol === 'MEDICO' && !this.especialidad) {
      throw new Error("Médico debe tener especialidad");
    }
  }
}
