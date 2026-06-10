export class Especialidad {
  constructor(
    public readonly id: number,
    public readonly nombre: string,
    public readonly descripcion?: string
  ) {
    if (!this.nombre || this.nombre.trim() === '') {
      throw new Error("El nombre de la especialidad no puede estar vacío.");
    }
  }
}
