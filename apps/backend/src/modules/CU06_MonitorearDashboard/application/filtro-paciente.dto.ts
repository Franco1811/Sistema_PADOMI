export class FiltroPacienteDto {
  medicoId!: string;
  busqueda?: string; // Puede ser nombre o DNI
  pagina?: number;
  limite?: number;

  validar(): void {
    if (!this.medicoId) {
      throw new Error("El ID del médico es obligatorio para ver el dashboard");
    }
    if (this.pagina !== undefined && (isNaN(this.pagina) || this.pagina <= 0)) {
      throw new Error("El número de página debe ser un número entero mayor a 0");
    }
    if (this.limite !== undefined && (isNaN(this.limite) || this.limite <= 0)) {
      throw new Error("El límite por página debe ser un número entero mayor a 0");
    }
  }
}
