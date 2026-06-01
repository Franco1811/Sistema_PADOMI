// Entidad compartida utilizada en CU-05 (Gestionar Perfil del Paciente).
// Valida la coherencia matemática de los límites biométricos y precisión de decimales.

import { Prototype } from '../interface/prototype.interface';

export class Umbral implements Prototype<Umbral> {
  constructor(
    public readonly id: string, // UUID
    public readonly codigo: string, // Código UMB-XXXX (opcional)
    public readonly pacienteId: string,
    public readonly metricaId: string,
    public readonly valorMin: number,
    public readonly valorMax: number
  ) {
    this.validarRangos();
  }

  public clone(overrides?: Partial<Umbral>): Umbral {
    return new Umbral(
      overrides?.id ?? this.id,
      overrides?.codigo ?? this.codigo,
      overrides?.pacienteId ?? this.pacienteId,
      overrides?.metricaId ?? this.metricaId,
      overrides?.valorMin ?? this.valorMin,
      overrides?.valorMax ?? this.valorMax
    );
  }

  private validarRangos(): void {
    if (this.valorMin < 0) {
      throw new Error("El valor mínimo del umbral debe ser positivo.");
    }
    if (this.valorMax <= this.valorMin) {
      throw new Error("El valor máximo debe ser mayor al valor mínimo.");
    }
  }
}
