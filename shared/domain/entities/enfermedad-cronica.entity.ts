// Enfermedades crónicas más frecuentes y sus métricas asociadas

// Entidad que representa una enfermedad crónica frecuente en el contexto de PADOMI.
// Permite asociar métricas clínicas relevantes para su monitoreo y facilitar la personalización del seguimiento.
export class EnfermedadCronica {
  constructor(
    public readonly id: string, // Código ENF-XXXX
    public readonly nombre: string, // Ej: Diabetes Mellitus, Hipertensión Arterial
    public readonly descripcion: string,
    // IDs de métricas asociadas a la enfermedad (ej: glucosa, presión arterial, oximetría, etc.)
    public readonly metricasAsociadas: string[]
  ) {}
}

// Ejemplos de enfermedades crónicas frecuentes y métricas asociadas:
// - Diabetes Mellitus: glucosa en sangre
// - Hipertensión Arterial: presión arterial sistólica y diastólica
// - Insuficiencia Cardíaca: frecuencia cardíaca, presión arterial, oximetría
// - EPOC: oximetría, frecuencia respiratoria
// - Dislipidemia: colesterol, triglicéridos
//
// Puedo agregar nuevas enfermedades y asociar las métricas que correspondan sin modificar la estructura principal.