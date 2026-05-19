export class IngestaDto {
  pacienteId!: string;
  metricaId!: string;
  valor!: number;

  validar(): void {
    if (!this.pacienteId || typeof this.pacienteId !== 'string') {
      throw new Error("El ID del paciente es requerido y debe ser texto.");
    }
    if (!this.metricaId || typeof this.metricaId !== 'string') {
      throw new Error("El ID de la métrica es requerido y debe ser texto.");
    }
    if (this.valor === undefined || typeof this.valor !== 'number') {
      throw new Error("El valor biométrico es requerido y debe ser un número.");
    }
  }
}
