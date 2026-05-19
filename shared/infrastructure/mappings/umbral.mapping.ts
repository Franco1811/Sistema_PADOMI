// Mapping entre el modelo ORM y la entidad de dominio Umbral (CU-05)
// Traduce la entidad (con lógica de rangos) al modelo de base de datos y viceversa.

import { Umbral } from '../../domain/entities/umbral.entity';
import { UmbralModel } from '../models/umbral.model';

export class UmbralMapping {
  static toEntity(model: UmbralModel): Umbral {
    return new Umbral(
      model.id,
      model.codigo || '',
      model.pacienteId,
      model.metricaId,
      Number(model.valorMin),
      Number(model.valorMax)
    );
  }

  static toModel(entity: Umbral): UmbralModel {
    const model = new UmbralModel();
    model.id = entity.id;
    model.codigo = entity.codigo;
    model.pacienteId = entity.pacienteId;
    model.metricaId = entity.metricaId;
    model.valorMin = entity.valorMin;
    model.valorMax = entity.valorMax;
    return model;
  }
}
