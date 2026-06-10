import { Paciente } from '../entities/paciente.entity';

export interface PacienteDashboard {
  paciente: Paciente;
  estado: 'CRITICO' | 'ADVERTENCIA' | 'NORMAL';
  alertasActivas: number;
}

export interface DashboardKPIs {
  totalPacientes: number;
  alertasCriticasHoy: number;
}

export interface IDashboardRepository {
  obtenerDashboard(
    medicoId: string,
    busqueda?: string,
    pagina?: number,
    limite?: number
  ): Promise<PacienteDashboard[]>;

  obtenerKPIs(medicoId: string): Promise<DashboardKPIs>;
}
