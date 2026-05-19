// Implementación real de la gestión de personal usando TypeORM (CU-02)
// Contiene la lógica específica para listar, crear y actualizar personal, incluyendo filtros por especialidad.
// Esta implementación extiende UsuarioRepository con métodos específicos para CU-02.

import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../../shared/infrastructure/data-source';
import { UsuarioModel } from '../../../../../../shared/infrastructure/models/usuario.model';
import { UsuarioMapping } from '../../../../../../shared/infrastructure/mappings/usuario.mapping';
import { Usuario } from '../../../../../../shared/domain/entities/usuario.entity';
import { IUsuarioRepository } from '../../../../../../shared/domain/repositories/usuario.repository';

export class PersonalRepository implements IUsuarioRepository {
  private repository: any;

  constructor() {
    this.repository = AppDataSource.getRepository(UsuarioModel);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const model = await this.repository.findOne({ where: { email } });
    return model ? UsuarioMapping.toEntity(model) : null;
  }

  async buscarPorDni(dni: string): Promise<Usuario | null> {
    // Nota: El modelo UsuarioModel no tiene campo DNI
    // Este método es un placeholder - si necesitas buscar por DNI, agrega el campo al modelo
    return null;
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

  async listarPorEspecialidad(especialidad: string): Promise<Usuario[]> {
    const models = await this.repository.find({ where: { especialidad } });
    return models.map((model: any) => UsuarioMapping.toEntity(model));
  }

  async listarTodos(): Promise<Usuario[]> {
    const models = await this.repository.find();
    return models.map((model: any) => UsuarioMapping.toEntity(model));
  }
}
