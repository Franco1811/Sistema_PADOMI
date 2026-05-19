// Enfermedades crónicas más frecuentes y sus métricas asociadas

// Entidad que representa una enfermedad crónica frecuente en el contexto de PADOMI.
// Permite asociar métricas clínicas relevantes para su monitoreo y facilitar la personalización del seguimiento.
export class EnfermedadCronica {
  constructor(
    public readonly id: string, // UUID
    public readonly codigo: string, // Código ENF-XXXX
    public readonly nombre: string, // Ej: Diabetes Mellitus, Hipertensión Arterial
    public readonly descripcion: string
  ) {}
}

// Nota: La relación con métricas se maneja a través de la tabla PacienteEnfermedad (N:M)
// Ejemplos de enfermedades crónicas frecuentes y métricas asociadas:
// - Diabetes Mellitus: glucosa en sangre
// - Hipertensión Arterial: presión arterial sistólica y diastólica
// - Insuficiencia Cardíaca: frecuencia cardíaca, presión arterial, oximetría
// - EPOC: oximetría, frecuencia respiratoria
// - Dislipidemia: colesterol, triglicéridos