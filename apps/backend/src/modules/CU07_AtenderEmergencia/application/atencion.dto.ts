export class AtencionDto {
  alertaId!: string;
  medicoId!: string;
  resumen!: string;
  recomendaciones!: string;

  validar(): void {
    if (!this.alertaId) {
      throw new Error("El ID de la alerta es requerido");
    }
    if (!this.medicoId) {
      throw new Error("El ID del médico es requerido para la auditoría");
    }
    if (!this.resumen || this.resumen.trim().length === 0) {
      throw new Error("El diagnóstico/resumen de la evaluación es requerido");
    }
    if (!this.recomendaciones || this.recomendaciones.trim().length === 0) {
      throw new Error("Las recomendaciones clínicas de la evaluación son requeridas");
    }
  }
}
