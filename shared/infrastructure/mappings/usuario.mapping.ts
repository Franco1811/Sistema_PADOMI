// Mapping entre el modelo ORM y la entidad de dominio Usuario (CU-01, CU-02)
// Traduce la entidad (con lógica de negocio) al modelo de base de datos y viceversa.
// Se reutiliza en todos los casos de uso que requieran lógica de usuario.

import { Usuario } from '../../domain/entities/usuario.entity';
import { Rol } from '../../domain/entities/rol.entity';
import { Especialidad } from '../../domain/entities/especialidad.entity';
import { UsuarioBuilder } from '../../domain/builders/usuario.builder';
import { UsuarioModel } from '../models/usuario.model';

export class UsuarioMapping {
  static toEntity(model: UsuarioModel): Usuario {
    const rolDominio = model.rol 
      ? new Rol(
          model.rol.id,
          model.rol.nombre as 'ADMIN' | 'MEDICO',
          model.rol.permisos ? model.rol.permisos.map(p => p.nombre) : [],
          model.rol.recursos ? model.rol.recursos.map(r => ({ nombre: r.nombre, ruta: r.ruta })) : []
        )
      : new Rol(2, 'MEDICO'); // Fallback seguro

    const especialidadDominio = model.especialidadRelation
      ? new Especialidad(
          model.especialidadRelation.id,
          model.especialidadRelation.nombre,
          model.especialidadRelation.descripcion || undefined
        )
      : undefined;

    return new UsuarioBuilder()
      .conId(model.id)
      .conCodigo(model.codigo || '')
      .conDni(model.dni)
      .conNombre(model.nombre)
      .conApellido(model.apellido)
      .conEmail(model.email)
      .conPasswordHash(model.passwordHash)
      .conRol(rolDominio)
      .conActivo(model.activo)
      .conEspecialidad(especialidadDominio)
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
    model.rolId = entity.rol.id;
    model.activo = entity.activo;
    model.especialidadId = entity.especialidad ? entity.especialidad.id : null;
    return model;
  }
}
