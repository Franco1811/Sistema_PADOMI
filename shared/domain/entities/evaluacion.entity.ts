// Entidad compartida utilizada en CU-09 (Procesar Reglas Clínicas).
// Entidad que representa la evaluación médica realizada a un paciente por un profesional de salud.
// Permite registrar el resumen clínico y recomendaciones tras la revisión de métricas y alertas.
export class Evaluacion {
  constructor(
    public readonly id: string, // Código EVA-XXXX
    public readonly pacienteId: string,
    public readonly medicoId: string,
    public readonly fecha: Date,
    public readonly resumen: string,
    public readonly recomendaciones: string
  ) {}
}
