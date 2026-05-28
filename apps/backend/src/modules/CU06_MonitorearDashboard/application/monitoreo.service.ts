import { IPacienteRepository } from '../../../../../../shared/domain/repositories/paciente.interface';
import { PacienteRepository } from '../../../../../../shared/infrastructure/repositories/paciente.repository';
import { IAlertaRepository } from '../../../../../../shared/domain/repositories/alerta.interface';
import { AlertaRepository } from '../../../../../../shared/infrastructure/repositories/alerta.repository';
import { FiltroPacienteDto } from './filtro-paciente.dto';
import { Paciente } from '../../../../../../shared/domain/entities/paciente.entity';

export interface PacienteDashboard {
  paciente: Paciente;
  estado: 'CRITICO' | 'ADVERTENCIA' | 'NORMAL';
  alertasActivas: number;
}

export class MonitoreoService {
  private pacienteRepository: IPacienteRepository;
  private alertaRepository: IAlertaRepository;

  constructor() {
    this.pacienteRepository = new PacienteRepository();
    this.alertaRepository = new AlertaRepository();
  }

  async obtenerDashboard(dto: FiltroPacienteDto): Promise<PacienteDashboard[]> {
    dto.validar();

    // 1. Obtener pacientes del médico
    let pacientes = await this.pacienteRepository.listarPorMedicoAsignado(dto.medicoId);

    // 2. Aplicar filtro de búsqueda si existe
    if (dto.busqueda) {
      const b = dto.busqueda.toLowerCase();
      pacientes = pacientes.filter(p => 
        p.nombres.toLowerCase().includes(b) || p.dni.includes(b)
      );
    }

    // 3. Determinar estado de cada paciente
    const dashboard: PacienteDashboard[] = [];

    for (const paciente of pacientes) {
      const alertas = await this.alertaRepository.buscarActivasPorPaciente(paciente.id);
      
      let estado: 'CRITICO' | 'ADVERTENCIA' | 'NORMAL' = 'NORMAL';
      if (alertas.some(a => a.severidad === 'CRITICO')) {
        estado = 'CRITICO';
      } else if (alertas.some(a => a.severidad === 'ADVERTENCIA')) {
        estado = 'ADVERTENCIA';
      }

      dashboard.push({
        paciente,
        estado,
        alertasActivas: alertas.length
      });
    }

    // 4. Ordenar por prioridad: CRITICO > ADVERTENCIA > NORMAL
    const prioridad = { 'CRITICO': 1, 'ADVERTENCIA': 2, 'NORMAL': 3 };
    
    dashboard.sort((a, b) => prioridad[a.estado] - prioridad[b.estado]);

    return dashboard;
  }
}
