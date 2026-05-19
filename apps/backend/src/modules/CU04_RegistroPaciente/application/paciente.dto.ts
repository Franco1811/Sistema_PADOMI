// DTO para el registro de paciente en Registrar Paciente Crónico (CU-04)
// Valida los datos recibidos en la petición (DNI, nombres, edad, diagnóstico).

export class PacienteDto {
  dni!: string;
  nombres!: string;
  edad!: number;
  diagnostico!: string;
  medicoAsignadoId!: string;

  validar(): void {
    // Validación de DNI (8 dígitos exactos) - RNF-59
    if (!/^\d{8}$/.test(this.dni)) {
      throw new Error("El DNI debe contener exactamente 8 dígitos numéricos.");
    }

    // Validación de nombres
    if (!this.nombres || this.nombres.length < 2) {
      throw new Error("El nombre del paciente es inválido.");
    }

    // Validación de edad lógica
    if (this.edad < 0 || this.edad > 120) {
      throw new Error("La edad ingresada no es válida para un paciente de PADOMI.");
    }

    // Validación de médico asignado
    if (!this.medicoAsignadoId) {
      throw new Error("Debe asignar un médico al paciente.");
    }
  }
}
