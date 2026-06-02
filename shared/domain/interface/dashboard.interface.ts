import { Paciente } from '../entities/paciente.entity';

export interface PacienteDashboard {
  paciente: Paciente;
  estado: 'CRITICO' | 'ADVERTENCIA' | 'NORMAL';
  alertasActivas: number;
}

export interface IDashboardRepository {
  obtenerDashboard(
    medicoId: string,
    busqueda?: string,
    pagina?: number,
    limite?: number
  ): Promise<PacienteDashboard[]>;
}
