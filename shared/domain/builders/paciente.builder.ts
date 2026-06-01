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

  public conMedicoAsignadoId(medicoAsignadoId: string): this {
    this.medicoAsignadoId = medicoAsignadoId;
    return this;
  }

  public build(): Paciente {
    return new Paciente(
      this.id,
      this.codigo,
      this.dni,
      this.nombres,
      this.edad,
      this.diagnostico,
      this.medicoAsignadoId
    );
  }
}
