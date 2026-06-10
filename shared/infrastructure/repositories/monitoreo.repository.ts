import { IDashboardRepository, PacienteDashboard } from '../../domain/interface/dashboard.interface';
import { AppDataSource } from '../data-source';
import { PacienteModel } from '../models/paciente.model';
import { AlertaModel } from '../models/alerta.model';
import { Paciente } from '../../domain/entities/paciente.entity';

export class MonitoreoRepository implements IDashboardRepository {
  async obtenerDashboard(
    medicoId: string,
    busqueda?: string,
    pagina: number = 1,
    limite: number = 50
  ): Promise<PacienteDashboard[]> {
    const query = AppDataSource.getRepository(PacienteModel)
      .createQueryBuilder('paciente')
      .leftJoin(AlertaModel, 'alerta', 'alerta.pacienteId = paciente.id AND alerta.atendida = :atendidaFalse')
      .select('paciente.id', 'id')
      .addSelect('paciente.codigo', 'codigo')
      .addSelect('paciente.dni', 'dni')
      .addSelect('paciente.nombres', 'nombres')
      .addSelect('paciente.edad', 'edad')
      .addSelect('paciente.diagnostico', 'diagnostico')
      .addSelect('paciente.medicoAsignadoId', 'medicoAsignadoId')
      .addSelect('paciente.telefono', 'telefono')
      .addSelect('paciente.direccion', 'direccion')
      .addSelect('COUNT(alerta.id)', 'alertasActivas')
      .addSelect("COALESCE(MIN(CASE WHEN alerta.severidad = 'CRITICO' THEN 1 WHEN alerta.severidad = 'ADVERTENCIA' THEN 2 ELSE 3 END), 3)", 'ordenseveridad')
      .where('paciente.medicoAsignadoId = :medicoId', { medicoId })
      .setParameter('atendidaFalse', false)
      .groupBy('paciente.id')
      .addGroupBy('paciente.codigo')
      .addGroupBy('paciente.dni')
      .addGroupBy('paciente.nombres')
      .addGroupBy('paciente.edad')
      .addGroupBy('paciente.diagnostico')
      .addGroupBy('paciente.medicoAsignadoId')
      .addGroupBy('paciente.telefono')
      .addGroupBy('paciente.direccion');

    if (busqueda) {
      query.andWhere('(paciente.nombres LIKE :busqueda OR paciente.dni LIKE :busqueda)', { busqueda: `%${busqueda}%` });
    }

    query.orderBy('ordenseveridad', 'ASC')
      .addOrderBy('paciente.nombres', 'ASC')
      .offset((pagina - 1) * limite)
      .limit(limite);

    const rawResults = await query.getRawMany();

    return rawResults.map((r: any) => {
      const paciente = new Paciente(
        r.id,
        r.codigo,
        r.dni,
        r.nombres,
        Number(r.edad),
        r.diagnostico,
        r.medicoAsignadoId,
        r.telefono || '',
        r.direccion || ''
      );

      let estado: 'CRITICO' | 'ADVERTENCIA' | 'NORMAL' = 'NORMAL';
      if (Number(r.ordenseveridad) === 1) estado = 'CRITICO';
      else if (Number(r.ordenseveridad) === 2) estado = 'ADVERTENCIA';

      return {
        paciente,
        estado,
        alertasActivas: Number(r.alertasActivas)
      };
    });
  }

  async obtenerKPIs(medicoId: string): Promise<{ totalPacientes: number; alertasCriticasHoy: number }> {
    const totalPacientes = await AppDataSource.getRepository(PacienteModel).count({
      where: { medicoAsignadoId: medicoId }
    });

    const alertsRaw = await AppDataSource.getRepository(AlertaModel)
      .createQueryBuilder('alerta')
      .innerJoin(PacienteModel, 'paciente', 'paciente.id = alerta.pacienteId')
      .where('paciente.medicoAsignadoId = :medicoId', { medicoId })
      .andWhere('alerta.atendida = :atendidaFalse', { atendidaFalse: false })
      .andWhere("alerta.severidad = 'CRITICO'")
      .getCount();

    return {
      totalPacientes,
      alertasCriticasHoy: alertsRaw
    };
  }
}
