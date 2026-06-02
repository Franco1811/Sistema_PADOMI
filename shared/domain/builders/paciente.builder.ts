import { Paciente } from '../entities/paciente.entity';

export class PacienteBuilder {
  private id!: string;
  private codigo!: string;
  private dni!: string;
  private nombres!: string;
  private edad!: number;
  private diagnostico!: string;
  private medicoAsignadoId!: string;

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

  public conNombres(nombres: string): this {
    this.nombres = nombres;
    return this;
  }

  public conEdad(edad: number): this {
    this.edad = edad;
    return this;
  }

  public conDiagnostico(diagnostico: string): this {
    this.diagnostico = diagnostico;
    return this;
  }

  private telefono?: string;
  private direccion?: string;

  public conTelefono(telefono: string): this {
    this.telefono = telefono;
    return this;
  }

  public conDireccion(direccion: string): this {
    this.direccion = direccion;
    return this;
  }

  public conMedicoAsignadoId(medicoAsignadoId: string): this {
    this.medicoAsignadoId = medicoAsignadoId;
    return this;
  }

  public build(): Paciente {
    // Validación explícita de campos requeridos por el negocio
    if (!this.id) throw new Error("Builder Error: 'id' es requerido para construir un Paciente.");
    if (!this.codigo) throw new Error("Builder Error: 'codigo' es requerido para construir un Paciente.");
    if (!this.dni) throw new Error("Builder Error: 'dni' es requerido para construir un Paciente.");
    if (!this.nombres) throw new Error("Builder Error: 'nombres' es requerido para construir un Paciente.");
    if (this.edad === undefined || this.edad === null) throw new Error("Builder Error: 'edad' es requerido para construir un Paciente.");
    if (!this.medicoAsignadoId) throw new Error("Builder Error: 'medicoAsignadoId' es requerido para construir un Paciente.");

    return new Paciente(
      this.id,
      this.codigo,
      this.dni,
      this.nombres,
      this.edad,
      this.diagnostico,
      this.medicoAsignadoId,
      this.telefono,
      this.direccion
    );
  }
}
