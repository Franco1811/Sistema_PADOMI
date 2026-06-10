// Implementación real de la persistencia de usuarios usando TypeORM
// Compartida y utilizada en CU-01 (Iniciar Sesión) y CU-02 (Gestionar Cuentas de Personal)
// Gestiona las operaciones CRUD de usuarios en Azure SQL.

import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { UsuarioModel } from '../models/usuario.model';
import { UsuarioMapping } from '../mappings/usuario.mapping';
import { IUsuarioRepository } from '../../domain/interface/usuario.interface';
import { Usuario } from '../../domain/entities/usuario.entity';

export class UsuarioRepository implements IUsuarioRepository {
  private repository: Repository<UsuarioModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(UsuarioModel);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const model = await this.repository.findOne({ 
      where: { email },
      relations: ['rol', 'rol.permisos', 'rol.recursos', 'especialidadRelation']
    });
    return model ? UsuarioMapping.toEntity(model) : null;
  }

  async buscarPorDni(dni: string): Promise<Usuario | null> {
    const model = await this.repository.findOne({
      where: { dni },
      relations: ['rol', 'rol.permisos', 'rol.recursos', 'especialidadRelation']
    });
    return model ? UsuarioMapping.toEntity(model) : null;
  }

  async guardar(usuario: Usuario): Promise<Usuario> {
    const model = UsuarioMapping.toModel(usuario);
    const savedModel = await this.repository.save(model);
    // Para retornar el objeto con sus relaciones cargadas:
    return this.buscarPorId(savedModel.id) as Promise<Usuario>;
  }

  async actualizar(usuario: Usuario): Promise<Usuario> {
    const model = UsuarioMapping.toModel(usuario);
    const updatedModel = await this.repository.save(model);
    // Para retornar el objeto con sus relaciones cargadas:
    return this.buscarPorId(updatedModel.id) as Promise<Usuario>;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const model = await this.repository.findOne({ 
      where: { id },
      relations: ['rol', 'rol.permisos', 'rol.recursos', 'especialidadRelation']
    });
    return model ? UsuarioMapping.toEntity(model) : null;
  }

  async listarTodos(especialidad?: string): Promise<Usuario[]> {
    const whereClause = especialidad ? { especialidadRelation: { nombre: especialidad } } as any : {};
    const models = await this.repository.find({ 
      where: whereClause,
      relations: ['rol', 'rol.permisos', 'rol.recursos', 'especialidadRelation']
    });
    return models.map(model => UsuarioMapping.toEntity(model));
  }

  async generarCodigo(): Promise<string> {
    const lastUser = await this.repository.find({
      order: { codigo: 'DESC' },
      take: 1
    });

    if (lastUser.length === 0) {
      return 'USU-0001';
    }

    const codigo = lastUser[0].codigo;
    if (!codigo) {
      return 'USU-0001';
    }

    const match = codigo.match(/USU-(\d+)/);
    if (!match) {
      return 'USU-0001';
    }

    const nextNumber = parseInt(match[1], 10) + 1;
    return `USU-${String(nextNumber).padStart(4, '0')}`;
  }
}
