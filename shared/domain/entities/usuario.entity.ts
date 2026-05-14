export class Usuario {
  // Entidad compartida utilizada en CU-01 (Iniciar Sesión) y CU-02 (Gestionar Cuentas de Personal).
  // Representa al usuario del sistema y contiene la lógica de validación de negocio.
  constructor(
    public readonly id: string, // Puede ser el DNI o UUID
    public readonly nombre: string,
    public readonly apellido: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly rol: 'MEDICO' | 'ENFERMERO' | 'ADMINISTRATIVO',
    public readonly activo: boolean = true,
    public readonly especialidad?: string // Opcional, solo para médicos
  ) {
    this.validarReglasNegocio();
  }

  // Reglas de Negocio (Capa 3)
  private validarReglasNegocio(): void {
    if (!this.email.includes('@')) {
      throw new Error("Formato de email institucional de EsSalud inválido.");
    }
    
    if (this.rol === 'MEDICO' && !this.especialidad) {
      throw new Error("Un usuario con rol MEDICO debe tener una especialidad asignada.");
    }
  }

  // Método de dominio para el CU-01 (Mencionado en tu texto)
  public estaHabilitado(): boolean {
    return this.activo;
  }
}