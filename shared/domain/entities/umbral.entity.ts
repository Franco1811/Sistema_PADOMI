// Entidad compartida utilizada en CU-05 (Gestionar Perfil del Paciente).
// Valida la coherencia matemática de los límites biométricos y precisión de decimales.

export class Umbral {
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

  private validarRangos(): void {
    if (this.valorMin < 0) {
      throw new Error("El valor mínimo del umbral debe ser positivo.");
    }
    if (this.valorMax <= this.valorMin) {
      throw new Error("El valor máximo debe ser mayor al valor mínimo.");
    }
  }
}
