export class AtencionDto {
  alertaId!: string;
  medicoId!: string;
  comentario?: string;

  validar(): void {
    if (!this.alertaId) {
      throw new Error("El ID de la alerta es requerido");
    }
    if (!this.medicoId) {
      throw new Error("El ID del médico es requerido para la auditoría");
    }
  }
}
