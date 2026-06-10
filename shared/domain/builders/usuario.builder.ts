import { Usuario } from '../entities/usuario.entity';
import { Rol } from '../entities/rol.entity';
import { Especialidad } from '../entities/especialidad.entity';

export class UsuarioBuilder {
  private id!: string;
  private codigo!: string;
  private dni!: string;
  private nombre!: string;
  private apellido!: string;
  private email!: string;
  private passwordHash!: string;
  private rol!: Rol;
  private activo: boolean = true;
  private especialidad?: Especialidad | string;

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

  public conRol(rol: Rol): this {
    this.rol = rol;
    return this;
  }

  public conActivo(activo: boolean): this {
    this.activo = activo;
    return this;
  }

  public conEspecialidad(especialidad?: Especialidad | string): this {
    this.especialidad = especialidad;
    return this;
  }

  public build(): Usuario {
    // Validación explícita de campos requeridos por el negocio
    if (!this.id) throw new Error("Builder Error: 'id' es requerido para construir un Usuario.");
    if (!this.codigo) throw new Error("Builder Error: 'codigo' es requerido para construir un Usuario.");
    if (!this.dni) throw new Error("Builder Error: 'dni' es requerido para construir un Usuario.");
    if (!this.nombre) throw new Error("Builder Error: 'nombre' es requerido para construir un Usuario.");
    if (!this.apellido) throw new Error("Builder Error: 'apellido' es requerido para construir un Usuario.");
    if (!this.email) throw new Error("Builder Error: 'email' es requerido para construir un Usuario.");
    if (!this.passwordHash) throw new Error("Builder Error: 'passwordHash' es requerido para construir un Usuario.");
    if (!this.rol) throw new Error("Builder Error: 'rol' es requerido para construir un Usuario.");

    let espEntity: Especialidad | undefined;
    if (this.especialidad) {
      if (typeof this.especialidad === 'string') {
        espEntity = new Especialidad(Math.floor(Math.random() * 1000) + 1, this.especialidad);
      } else {
        espEntity = this.especialidad;
      }
    }

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
      espEntity
    );
  }
}
