// Entidad compartida utilizada en CU-09 (Procesar Reglas Clínicas).
// Entidad que representa la evaluación médica realizada a un paciente por un profesional de salud.
// Permite registrar el resumen clínico y recomendaciones tras la revisión de métricas y alertas.
export class Evaluacion {
  constructor(
    public readonly id: string, // UUID
    public readonly codigo: string, // Código EVA-XXXX
    public readonly pacienteId: string,
    public readonly medicoId: string | null,
    public readonly fecha: Date,
    public readonly resumen: string,
    public readonly recomendaciones: string,
    public readonly alertaId: string | null = null // Nueva relación directa
  ) {}

  public static calcularSeveridad(valor: number, umbralMin: number, umbralMax: number): 'NORMAL' | 'ADVERTENCIA' | 'CRITICO' {
    if (valor >= umbralMin && valor <= umbralMax) {
      return 'NORMAL';
    }

    // 10% tolerance
    const margenMin = umbralMin * 0.9;
    const margenMax = umbralMax * 1.1;

    if (valor >= margenMin && valor <= margenMax) {
      return 'ADVERTENCIA';
    }

    return 'CRITICO';
  }
}
