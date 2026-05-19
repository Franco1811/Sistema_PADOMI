// DTO para la métrica clínica en el caso de uso Gestionar Catálogo de Métricas (CU-03)
// Valida los datos recibidos en la petición (nombre, unidad, rangos, etc.).

export class MetricaDto {
  nombre!: string;
  unidad!: string;
  descripcion?: string;
  rangoMin!: number;
  rangoMax!: number;

  validar(): void {
    if (!this.nombre || this.nombre.length < 2) {
      throw new Error("Nombre de métrica inválido");
    }
    if (!this.unidad || this.unidad.length < 1) {
      throw new Error("Unidad de medida inválida");
    }
    if (this.rangoMin < 0) {
      throw new Error("El rango mínimo debe ser positivo");
    }
    if (this.rangoMax <= this.rangoMin) {
      throw new Error("El rango máximo debe ser mayor al mínimo");
    }
  }
}
