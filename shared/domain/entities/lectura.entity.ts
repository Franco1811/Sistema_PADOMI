// Entidad compartida utilizada en CU-08 (Ingestar Datos Biométricos).
// Entidad que representa una medición puntual de una métrica clínica tomada a un paciente.
// Permite registrar el valor, la fecha y la métrica asociada, facilitando el monitoreo histórico.
export class Lectura {
  constructor(
    public readonly id: string, // UUID
    public readonly codigo: string, // Código LEC-XXXX
    public readonly pacienteId: string,
    public readonly metricaId: string,
    public readonly valor: number,
    public readonly fecha: Date
  ) {
    this.validarValor();
  }

  private validarValor(): void {
    if (this.valor < 0) {
      throw new Error("El valor de la lectura debe ser positivo.");
    }
  }
}
