// Entidad compartida utilizada en CU-06 (Monitorear Dashboard Clínico) y CU-07 (Atender Emergencia Médica).
// Representa una alerta clínica y contiene la lógica de negocio para su gestión y visualización.

// Entidad que representa una alerta generada cuando una métrica clínica supera un umbral crítico.
// Se asocia a un paciente y a una métrica específica, permitiendo la gestión de eventos críticos en salud. 

export class Alerta {
  constructor(
    public readonly id: string, // Código ALT-XXXX
    public readonly pacienteId: string,
    public readonly tipo: 'GLUCOSA' | 'OXIMETRIA' | 'TEMPERATURA' | 'FRECUENCIA_CARDIACA',
    public readonly valor: number,
    public readonly fecha: Date,
    public readonly mensaje: string,
    public readonly atendida: boolean = false
  ) {}
}
