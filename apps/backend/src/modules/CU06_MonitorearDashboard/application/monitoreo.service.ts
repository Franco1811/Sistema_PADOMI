import { repositoryFactory } from '../../../../../../shared/infrastructure/repositories/repository.factory';
import { IDashboardRepository, PacienteDashboard } from '../../../../../../shared/domain/interface/dashboard.interface';
import { FiltroPacienteDto } from './filtro-paciente.dto';

export class MonitoreoService {
  private dashboardRepository: IDashboardRepository;

  constructor() {
    this.dashboardRepository = repositoryFactory.getDashboardRepository();
  }

  async obtenerDashboard(dto: FiltroPacienteDto): Promise<PacienteDashboard[]> {
    dto.validar();
    return await this.dashboardRepository.obtenerDashboard(
      dto.medicoId,
      dto.busqueda,
      dto.pagina,
      dto.limite
    );
  }
}
