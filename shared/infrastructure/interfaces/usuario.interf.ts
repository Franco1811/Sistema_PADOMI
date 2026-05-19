// Implementación real de la persistencia de usuarios usando TypeORM
// Compartida y utilizada en CU-01 (Iniciar Sesión) y CU-02 (Gestionar Cuentas de Personal)
// Gestiona las operaciones CRUD de usuarios en Azure SQL.

import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { UsuarioModel } from '../models/usuario.model';
import { UsuarioMapping } from '../mappings/usuario.mapping';
import { IUsuarioRepository } from '../../domain/repositories/usuario.repository';
import { Usuario } from '../../domain/entities/usuario.entity';

export class UsuarioRepository implements IUsuarioRepository {
  private repository: Repository<UsuarioModel>;

  constructor() {
    this.repository = AppDataSource.getRepository(UsuarioModel);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const model = await this.repository.findOne({ where: { email } });
    return model ? UsuarioMapping.toEntity(model) : null;
  }

  async buscarPorDni(dni: string): Promise<Usuario | null> {
    const model = await this.repository.findOne({
      where: { dni }
    });
    return model ? UsuarioMapping.toEntity(model) : null;
  }

  async guardar(usuario: Usuario): Promise<Usuario> {
    const model = UsuarioMapping.toModel(usuario);
    const savedModel = await this.repository.save(model);
    return UsuarioMapping.toEntity(savedModel);
  }

  async actualizar(usuario: Usuario): Promise<Usuario> {
    const model = UsuarioMapping.toModel(usuario);
    const updatedModel = await this.repository.save(model);
    return UsuarioMapping.toEntity(updatedModel);
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const model = await this.repository.findOne({ where: { id } });
    return model ? UsuarioMapping.toEntity(model) : null;
  }

  async listarTodos(especialidad?: string): Promise<Usuario[]> {
    const whereClause = especialidad ? { especialidad } : {};
    const models = await this.repository.find({ where: whereClause });
    return models.map(model => UsuarioMapping.toEntity(model));
  }
}
