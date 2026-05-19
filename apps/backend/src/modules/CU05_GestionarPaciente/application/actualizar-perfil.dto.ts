export interface UmbralDto {
  metricaId: string;
  valorMin: number;
  valorMax: number;
}

export class ActualizarPerfilDto {
  pacienteId!: string;
  medicoId!: string; // Auditoría
  diagnostico?: string;
  umbrales?: UmbralDto[];

  validar(): void {
    if (!this.pacienteId) {
      throw new Error("El ID del paciente es requerido");
    }
    if (!this.medicoId) {
      throw new Error("El ID del médico responsable es requerido para auditoría");
    }
    if (this.umbrales) {
      for (const u of this.umbrales) {
        if (u.valorMin < 0) throw new Error("Valor mínimo debe ser positivo");
        if (u.valorMax <= u.valorMin) throw new Error("Valor máximo debe ser mayor al mínimo");
      }
    }
  }
}
