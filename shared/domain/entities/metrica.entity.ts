import { Prototype } from '../interface/prototype.interface';

// Entidad que representa una métrica clínica monitoreada (ej: glucosa, presión arterial, oximetría).
// Permite definir los rangos normales y asociarla a enfermedades crónicas.
// Entidad utilizada en CU-03 (Gestionar Catálogo de Métricas).
export class Metrica implements Prototype<Metrica> {
  constructor(
    public readonly id: string, // UUID
    public readonly codigo: string, // Código MET-XXXX
    public readonly nombre: string,
    public readonly unidad: string, // Ej: mg/dL, %
    public readonly descripcion: string,
    public readonly rangoMin: number,
    public readonly rangoMax: number
  ) {
    this.validarRangos();
  }

  public clone(overrides?: Partial<Metrica>): Metrica {
    return new Metrica(
      overrides?.id ?? this.id,
      overrides?.codigo ?? this.codigo,
      overrides?.nombre ?? this.nombre,
      overrides?.unidad ?? this.unidad,
      overrides?.descripcion ?? this.descripcion,
      overrides?.rangoMin ?? this.rangoMin,
      overrides?.rangoMax ?? this.rangoMax
    );
  }

  private validarRangos(): void {
    if (this.rangoMin < 0 || this.rangoMax <= this.rangoMin) {
      throw new Error("Rangos de métrica inválidos.");
    }
  }
}
