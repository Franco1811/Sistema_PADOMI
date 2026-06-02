export interface UmbralDto {
  metricaId: string;
  valorMin: number;
  valorMax: number;
}

export class ActualizarPerfilDto {
  pacienteId!: string;
  medicoId!: string; // Auditoría
  diagnostico?: string;
  telefono?: string;
  direccion?: string;
  umbrales?: UmbralDto[];

  validar(): void {
    if (!this.pacienteId) {
      throw new Error("El ID del paciente es requerido");
    }
    if (!this.medicoId) {
      throw new Error("El ID del médico responsable es requerido para auditoría");
    }
    if (this.diagnostico !== undefined) {
      if (this.diagnostico.trim().length < 3) {
        throw new Error("El diagnóstico debe contener al menos 3 caracteres significativos.");
      }
    }
    if (this.umbrales) {
      const metricasVistas = new Set<string>();
      for (const u of this.umbrales) {
        if (metricasVistas.has(u.metricaId)) {
          throw new Error("No se permiten métricas duplicadas en los umbrales del paciente.");
        }
        metricasVistas.add(u.metricaId);

        if (u.valorMin < 0) throw new Error("Valor mínimo debe ser positivo");
        if (u.valorMax <= u.valorMin) throw new Error("Valor máximo debe ser mayor al mínimo");
      }
    }
  }
}
