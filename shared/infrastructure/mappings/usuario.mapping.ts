// Mapping entre el modelo ORM y la entidad de dominio Usuario (CU-01, CU-02)
// Traduce la entidad (con lógica de negocio) al modelo de base de datos y viceversa.
// Se reutiliza en todos los casos de uso que requieran lógica de usuario.

import { Usuario } from '../../domain/entities/usuario.entity';
import { UsuarioBuilder } from '../../domain/builders/usuario.builder';
import { UsuarioModel } from '../models/usuario.model';

export class UsuarioMapping {
  static toEntity(model: UsuarioModel): Usuario {
    return new UsuarioBuilder()
      .conId(model.id)
      .conCodigo(model.codigo || '')
      .conDni(model.dni)
      .conNombre(model.nombre)
      .conApellido(model.apellido)
      .conEmail(model.email)
      .conPasswordHash(model.passwordHash)
      .conRol(model.rol as 'MEDICO' | 'ENFERMERO' | 'ADMINISTRATIVO')
      .conActivo(model.activo)
      .conEspecialidad(model.especialidad || undefined)
      .build();
  }

  static toModel(entity: Usuario): UsuarioModel {
    const model = new UsuarioModel();
    model.id = entity.id;
    model.codigo = entity.codigo;
    model.dni = entity.dni;
    model.nombre = entity.nombre;
    model.apellido = entity.apellido;
    model.email = entity.email;
    model.passwordHash = entity.passwordHash;
    model.rol = entity.rol;
    model.activo = entity.activo;
    model.especialidad = entity.especialidad || null;
    return model;
  }
}
