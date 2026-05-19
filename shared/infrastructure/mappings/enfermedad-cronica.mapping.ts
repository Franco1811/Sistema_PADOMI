// Mapping entre el modelo ORM y la entidad de dominio EnfermedadCronica (CU-04)
// Traduce la entidad al modelo de base de datos y viceversa.

import { EnfermedadCronica } from '../../domain/entities/enfermedad-cronica.entity';
import { EnfermedadCronicaModel } from '../models/enfermedad-cronica.model';

export class EnfermedadCronicaMapping {
  static toEntity(model: EnfermedadCronicaModel): EnfermedadCronica {
    return new EnfermedadCronica(
      model.id,
      model.codigo,
      model.nombre,
      model.descripcion || ''
    );
  }

  static toModel(entity: EnfermedadCronica): EnfermedadCronicaModel {
    const model = new EnfermedadCronicaModel();
    model.id = entity.id;
    model.codigo = entity.codigo;
    model.nombre = entity.nombre;
    model.descripcion = entity.descripcion;
    return model;
  }
}
