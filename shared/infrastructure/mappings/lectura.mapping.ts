import { Lectura } from '../../domain/entities/lectura.entity';
import { LecturaModel } from '../models/lectura.model';

export class LecturaMapping {
  static toEntity(model: LecturaModel): Lectura {
    return new Lectura(
      model.id,
      model.codigo,
      model.pacienteId,
      model.metricaId,
      model.valor,
      model.fecha
    );
  }

  static toModel(entity: Lectura): LecturaModel {
    const model = new LecturaModel();
    model.id = entity.id;
    model.codigo = entity.codigo;
    model.pacienteId = entity.pacienteId;
    model.metricaId = entity.metricaId;
    model.valor = entity.valor;
    model.fecha = entity.fecha;
    return model;
  }
}
