import { IUsuarioRepository } from '../../domain/interface/usuario.interface';
import { IPacienteRepository } from '../../domain/interface/paciente.interface';
import { IUmbralRepository } from '../../domain/interface/umbral.interface';
import { ILecturaRepository } from '../../domain/interface/lectura.interface';
import { IEvaluacionRepository } from '../../domain/interface/evaluacion.interface';
import { IAlertaRepository } from '../../domain/interface/alerta.interface';
import { IMetricaRepository } from '../../domain/interface/metrica.interface';
import { IDashboardRepository, PacienteDashboard } from '../../domain/interface/dashboard.interface';

import { Usuario } from '../../domain/entities/usuario.entity';
import { Paciente } from '../../domain/entities/paciente.entity';
import { Umbral } from '../../domain/entities/umbral.entity';
import { Lectura } from '../../domain/entities/lectura.entity';
import { Evaluacion } from '../../domain/entities/evaluacion.entity';
import { Alerta } from '../../domain/entities/alerta.entity';
import { Metrica } from '../../domain/entities/metrica.entity';

export class InMemoryUsuarioRepository implements IUsuarioRepository {
  private items: Usuario[] = [];

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.items.find(x => x.email === email) || null;
  }
  async buscarPorDni(dni: string): Promise<Usuario | null> {
    return this.items.find(x => x.dni === dni) || null;
  }
  async guardar(usuario: Usuario): Promise<Usuario> {
    this.items.push(usuario);
    return usuario;
  }
  async actualizar(usuario: Usuario): Promise<Usuario> {
    const idx = this.items.findIndex(x => x.id === usuario.id);
    if (idx !== -1) {
      this.items[idx] = usuario;
    }
    return usuario;
  }
  async listarTodos(especialidad?: string): Promise<Usuario[]> {
    if (especialidad) {
      return this.items.filter(x => x.especialidad?.nombre === especialidad);
    }
    return this.items;
  }
  async buscarPorId(id: string): Promise<Usuario | null> {
    return this.items.find(x => x.id === id) || null;
  }
  async generarCodigo(): Promise<string> {
    return `USU-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

export class InMemoryPacienteRepository implements IPacienteRepository {
  private items: Paciente[] = [];

  async guardar(paciente: Paciente): Promise<Paciente> {
    this.items.push(paciente);
    return paciente;
  }
  async actualizar(paciente: Paciente): Promise<Paciente> {
    const idx = this.items.findIndex(x => x.id === paciente.id);
    if (idx !== -1) {
      this.items[idx] = paciente;
    }
    return paciente;
  }
  async buscarPorDni(dni: string): Promise<Paciente | null> {
    return this.items.find(x => x.dni === dni) || null;
  }
  async buscarPorId(id: string): Promise<Paciente | null> {
    return this.items.find(x => x.id === id) || null;
  }
  async generarCodigo(): Promise<string> {
    return `PAC-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  async contarPorMedicoAsignado(medicoId: string): Promise<number> {
    return this.items.filter(x => x.medicoAsignadoId === medicoId).length;
  }
  async listarPorMedicoAsignado(medicoId: string): Promise<Paciente[]> {
    return this.items.filter(x => x.medicoAsignadoId === medicoId);
  }
}

export class InMemoryUmbralRepository implements IUmbralRepository {
  private items: Umbral[] = [];

  async guardar(umbral: Umbral): Promise<Umbral> {
    this.items.push(umbral);
    return umbral;
  }
  async actualizar(umbral: Umbral): Promise<Umbral> {
    const idx = this.items.findIndex(x => x.id === umbral.id);
    if (idx !== -1) {
      this.items[idx] = umbral;
    }
    return umbral;
  }
  async generarCodigo(): Promise<string> {
    return `UMB-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  async buscarPorPacienteId(pacienteId: string): Promise<Umbral[]> {
    return this.items.filter(x => x.pacienteId === pacienteId);
  }
  async eliminar(id: string): Promise<void> {
    this.items = this.items.filter(x => x.id !== id);
  }
}

export class InMemoryLecturaRepository implements ILecturaRepository {
  private items: Lectura[] = [];

  async guardar(lectura: Lectura): Promise<Lectura> {
    this.items.push(lectura);
    return lectura;
  }
  async generarCodigo(): Promise<string> {
    return `LEC-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  async buscarPorPaciente(pacienteId: string, limit: number = 50): Promise<Lectura[]> {
    return this.items
      .filter(item => item.pacienteId === pacienteId)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
      .slice(0, limit);
  }
}

export class InMemoryEvaluacionRepository implements IEvaluacionRepository {
  private items: Evaluacion[] = [];

  async guardar(evaluacion: Evaluacion): Promise<Evaluacion> {
    this.items.push(evaluacion);
    return evaluacion;
  }
  async generarCodigo(): Promise<string> {
    return `EVA-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

export class InMemoryAlertaRepository implements IAlertaRepository {
  private items: Alerta[] = [];

  async buscarPorId(id: string): Promise<Alerta | null> {
    return this.items.find(x => x.id === id) || null;
  }
  async buscarActivasPorPaciente(pacienteId: string): Promise<Alerta[]> {
    return this.items.filter(x => x.pacienteId === pacienteId && !x.atendida);
  }
  async guardar(alerta: Alerta): Promise<Alerta> {
    this.items.push(alerta);
    return alerta;
  }
  async atenderTransaccionalmente(alertaId: string): Promise<boolean> {
    const idx = this.items.findIndex(x => x.id === alertaId);
    if (idx !== -1 && !this.items[idx].atendida) {
      this.items[idx] = this.items[idx].marcarComoAtendida();
      return true;
    }
    return false;
  }
  async generarCodigo(): Promise<string> {
    return `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

export class InMemoryMetricaRepository implements IMetricaRepository {
  private items: Metrica[] = [];

  async guardar(metrica: Metrica): Promise<Metrica> {
    this.items.push(metrica);
    return metrica;
  }
  async actualizar(metrica: Metrica): Promise<Metrica> {
    const idx = this.items.findIndex(x => x.id === metrica.id);
    if (idx !== -1) {
      this.items[idx] = metrica;
    }
    return metrica;
  }
  async buscarPorId(id: string): Promise<Metrica | null> {
    return this.items.find(x => x.id === id) || null;
  }
  async generarCodigo(): Promise<string> {
    return `MET-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  async buscarPorNombre(nombre: string): Promise<Metrica | null> {
    return this.items.find(x => x.nombre.toLowerCase() === nombre.toLowerCase()) || null;
  }
  async listarTodas(): Promise<Metrica[]> {
    return this.items;
  }
  async inactivar(id: string): Promise<void> {
    // Para simplificar, lo removemos de la lista
    this.items = this.items.filter(x => x.id !== id);
  }
  async estaEnUso(id: string): Promise<boolean> {
    return false;
  }
}

export class InMemoryDashboardRepository implements IDashboardRepository {
  constructor(
    private pacienteRepo: InMemoryPacienteRepository,
    private alertaRepo: InMemoryAlertaRepository
  ) {}

  async obtenerDashboard(
    medicoId: string,
    busqueda?: string,
    pagina: number = 1,
    limite: number = 50
  ): Promise<PacienteDashboard[]> {
    // 1. Obtener pacientes del médico asignado
    let pacientes = await this.pacienteRepo.listarPorMedicoAsignado(medicoId);

    // 2. Aplicar filtro si existe
    if (busqueda) {
      const b = busqueda.toLowerCase();
      pacientes = pacientes.filter(p =>
        p.nombres.toLowerCase().includes(b) || p.dni.includes(b)
      );
    }

    const dashboard: PacienteDashboard[] = [];

    // 3. Obtener alertas y determinar severidad
    for (const paciente of pacientes) {
      const alertas = await this.alertaRepo.buscarActivasPorPaciente(paciente.id);
      
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

    // 4. Ordenar: CRITICO > ADVERTENCIA > NORMAL
    const prioridad = { 'CRITICO': 1, 'ADVERTENCIA': 2, 'NORMAL': 3 };
    dashboard.sort((a, b) => prioridad[a.estado] - prioridad[b.estado]);

    // 5. Paginar
    const start = (pagina - 1) * limite;
    return dashboard.slice(start, start + limite);
  }

  async obtenerKPIs(medicoId: string): Promise<{ totalPacientes: number; alertasCriticasHoy: number }> {
    const pacientes = await this.pacienteRepo.listarPorMedicoAsignado(medicoId);
    let alertasCriticasHoy = 0;
    for (const paciente of pacientes) {
      const alertas = await this.alertaRepo.buscarActivasPorPaciente(paciente.id);
      alertasCriticasHoy += alertas.filter(a => a.severidad === 'CRITICO').length;
    }
    return {
      totalPacientes: pacientes.length,
      alertasCriticasHoy
    };
  }
}
