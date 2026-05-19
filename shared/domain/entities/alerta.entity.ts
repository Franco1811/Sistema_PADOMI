// Entidad compartida utilizada en CU-06 (Monitorear Dashboard Clínico) y CU-07 (Atender Emergencia Médica).
// Representa una alerta clínica y contiene la lógica de negocio para su gestión y visualización.

// Entidad que representa una alerta generada cuando una métrica clínica supera un umbral crítico.
// Se asocia a un paciente y a una lectura específica, permitiendo la gestión de eventos críticos en salud.

export class Alerta {
  constructor(
    public readonly id: string, // UUID
    public readonly codigo: string, // Código ALT-XXXX
    public readonly pacienteId: string,
    public readonly lecturaId: string,
    public readonly severidad: 'NORMAL' | 'ADVERTENCIA' | 'CRITICO',
    public readonly mensaje: string,
    public readonly fecha: Date,
    public readonly atendida: boolean = false
  ) {}

  public marcarComoAtendida(): Alerta {
    if (this.atendida) {
      throw new Error("Esta alerta ya ha sido atendida.");
    }
    
    // Retorna una nueva instancia inmutable con el estado modificado
    return new Alerta(
      this.id,
      this.codigo,
      this.pacienteId,
      this.lecturaId,
      this.severidad,
      this.mensaje,
      this.fecha,
      true
    );
  }
}
