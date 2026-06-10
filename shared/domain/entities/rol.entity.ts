export class Rol {
  constructor(
    public readonly id: number,
    public readonly nombre: 'ADMIN' | 'MEDICO',
    public readonly permisos: string[] = [], // Nombres de los permisos asignados
    public readonly recursos: { nombre: string; ruta: string }[] = [] // Recursos/vistas
  ) {
    this.validarReglasNegocio();
  }

  private validarReglasNegocio(): void {
    if (this.nombre !== 'ADMIN' && this.nombre !== 'MEDICO') {
      throw new Error('El nombre de rol debe ser ADMIN o MEDICO.');
    }
  }
}
