// Mapping entre el modelo ORM y la entidad de dominio Metrica (CU-03)
// Traduce la entidad (con lógica de rangos) al modelo de base de datos y viceversa.

import { Metrica } from '../../domain/entities/metrica.entity';
import { MetricaModel } from '../models/metrica.model';

export class MetricaMapping {
  static toEntity(model: MetricaModel): Metrica {
    return new Metrica(
      model.id,
      model.codigo,
      model.nombre,
      model.unidad,
      model.descripcion || '',
      Number(model.rangoMin),
      Number(model.rangoMax)
    );
  }

  static toModel(entity: Metrica): MetricaModel {
    const model = new MetricaModel();
    model.id = entity.id;
    model.codigo = entity.codigo;
    model.nombre = entity.nombre;
    model.unidad = entity.unidad;
    model.descripcion = entity.descripcion;
    model.rangoMin = entity.rangoMin;
    model.rangoMax = entity.rangoMax;
    return model;
  }
}
