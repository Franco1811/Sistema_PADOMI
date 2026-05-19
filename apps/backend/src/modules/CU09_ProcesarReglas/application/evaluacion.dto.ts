export class EvaluacionDto {
  constructor(
    public readonly pacienteId: string,
    public readonly metricaId: string,
    public readonly estado: 'NORMAL' | 'ADVERTENCIA' | 'CRITICO',
    public readonly lecturaId: string
  ) {}
}
