export class Paciente {
  constructor(
    public readonly id: string, // Código PAC-XXXX
    public readonly dni: string,
    public readonly nombres: string,
    public readonly edad: number,
    public readonly diagnostico: string,
    public readonly medicoAsignadoId: string,
    // Umbrales personalizados (CU-05)
    public readonly umbralGlucosaMax: number,
    public readonly umbralOxigenoMin: number
  ) {
    this.validarDatosClínicos();
  }

  private validarDatosClínicos(): void {
    // Validación de DNI (8 dígitos exactos)
    if (!/^\d{8}$/.test(this.dni)) {
      throw new Error("El DNI debe contener exactamente 8 dígitos numéricos.");
    }

    // Validación de edad lógica
    if (this.edad < 0 || this.edad > 120) {
      throw new Error("La edad ingresada no es válida para un paciente de PADOMI.");
    }

    // Validación de umbrales (Capa 3 - Dominio)
    if (this.umbralGlucosaMax <= 0) {
      throw new Error("El umbral de glucosa debe ser un valor positivo.");
    }
  }
}