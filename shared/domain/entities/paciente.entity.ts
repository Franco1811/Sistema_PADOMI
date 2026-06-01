import { Prototype } from '../interface/prototype.interface';

export class Paciente implements Prototype<Paciente> {
  constructor(
    public readonly id: string, // UUID
    public readonly codigo: string, // Código PAC-XXXX
    public readonly dni: string,
    public readonly nombres: string,
    public readonly edad: number,
    public readonly diagnostico: string,
    public readonly medicoAsignadoId: string
  ) {
    this.validarDatosClínicos();
  }

  public clone(overrides?: Partial<Paciente>): Paciente {
    return new Paciente(
      overrides?.id ?? this.id,
      overrides?.codigo ?? this.codigo,
      overrides?.dni ?? this.dni,
      overrides?.nombres ?? this.nombres,
      overrides?.edad ?? this.edad,
      overrides?.diagnostico ?? this.diagnostico,
      overrides?.medicoAsignadoId ?? this.medicoAsignadoId
    );
  }

  private validarDatosClínicos(): void {
    // Validación de DNI (8 dígitos exactos)
    if (!/^\d{8}$/.test(this.dni)) {
      throw new Error("El DNI debe contener exactamente 8 dígitos numéricos.");
    }

    // Validación de edad lógica
    if (this.edad < 0 || this.edad > 120) {
      throw new Error("La edad ingresada no es válida para un paciente de PADOMI.");
    }
  }
}