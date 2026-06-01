import { Usuario } from '../entities/usuario.entity';

export class UsuarioBuilder {
  private id!: string;
  private codigo!: string;
  private dni!: string;
  private nombre!: string;
  private apellido!: string;
  private email!: string;
  private passwordHash!: string;
  private rol!: 'MEDICO' | 'ENFERMERO' | 'ADMINISTRATIVO';
  private activo: boolean = true;
  private especialidad?: string;

  public conId(id: string): this {
    this.id = id;
    return this;
  }

  public conCodigo(codigo: string): this {
    this.codigo = codigo;
    return this;
  }

  public conDni(dni: string): this {
    this.dni = dni;
    return this;
  }

  public conNombre(nombre: string): this {
    this.nombre = nombre;
    return this;
  }

  public conApellido(apellido: string): this {
    this.apellido = apellido;
    return this;
  }

  public conEmail(email: string): this {
    this.email = email;
    return this;
  }

  public conPasswordHash(passwordHash: string): this {
    this.passwordHash = passwordHash;
    return this;
  }

  public conRol(rol: 'MEDICO' | 'ENFERMERO' | 'ADMINISTRATIVO'): this {
    this.rol = rol;
    return this;
  }

  public conActivo(activo: boolean): this {
    this.activo = activo;
    return this;
  }

  public conEspecialidad(especialidad?: string): this {
    this.especialidad = especialidad;
    return this;
  }

  public build(): Usuario {
    return new Usuario(
      this.id,
      this.codigo,
      this.dni,
      this.nombre,
      this.apellido,
      this.email,
      this.passwordHash,
      this.rol,
      this.activo,
      this.especialidad
    );
  }
}
