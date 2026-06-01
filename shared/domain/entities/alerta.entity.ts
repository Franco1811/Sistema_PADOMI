import { Prototype } from '../interface/prototype.interface';

// Entidad que representa una alerta generada cuando una métrica clínica supera un umbral crítico.
// Se asocia a un paciente y a una lectura específica, permitiendo la gestión de eventos críticos en salud.

export class Alerta implements Prototype<Alerta> {
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

  public clone(overrides?: Partial<Alerta>): Alerta {
    return new Alerta(
      overrides?.id ?? this.id,
      overrides?.codigo ?? this.codigo,
      overrides?.pacienteId ?? this.pacienteId,
      overrides?.lecturaId ?? this.lecturaId,
      overrides?.severidad ?? this.severidad,
      overrides?.mensaje ?? this.mensaje,
      overrides?.fecha ?? this.fecha,
      overrides?.atendida ?? this.atendida
    );
  }

  public marcarComoAtendida(): Alerta {
    if (this.atendida) {
      throw new Error("Esta alerta ya ha sido atendida.");
    }
    
    // Retorna una nueva instancia clonada con el estado modificado (inmutabilidad)
    return this.clone({ atendida: true });
  }
}
