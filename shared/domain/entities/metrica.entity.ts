// Entidad que representa una métrica clínica monitoreada (ej: glucosa, presión arterial, oximetría).
// Permite definir los rangos normales y asociarla a enfermedades crónicas.
// Entidad utilizada en CU-03 (Gestionar Catálogo de Métricas).
export class Metrica {
  constructor(
    public readonly id: string, // Código MET-XXXX
    public readonly nombre: string,
    public readonly unidad: string, // Ej: mg/dL, %
    public readonly descripcion: string,
    public readonly rangoMin: number,
    public readonly rangoMax: number
  ) {
    this.validarRangos();
  }

  private validarRangos(): void {
    if (this.rangoMin < 0 || this.rangoMax <= this.rangoMin) {
      throw new Error("Rangos de métrica inválidos.");
    }
  }
}
