export class FiltroPacienteDto {
  medicoId!: string;
  busqueda?: string; // Puede ser nombre o DNI

  validar(): void {
    if (!this.medicoId) {
      throw new Error("El ID del médico es obligatorio para ver el dashboard");
    }
  }
}
