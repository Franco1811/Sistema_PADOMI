import { Evaluacion } from '../../domain/entities/evaluacion.entity';
import { EvaluacionModel } from '../models/evaluacion.model';

export class EvaluacionMapping {
  static toEntity(model: EvaluacionModel): Evaluacion {
    return new Evaluacion(
      model.id,
      model.codigo,
      model.pacienteId,
      model.medicoId,
      model.fecha,
      model.resumen,
      model.recomendaciones,
      model.alertaId
    );
  }

  static toModel(entity: Evaluacion): EvaluacionModel {
    const model = new EvaluacionModel();
    model.id = entity.id;
    model.codigo = entity.codigo;
    model.pacienteId = entity.pacienteId;
    model.medicoId = entity.medicoId;
    model.fecha = entity.fecha;
    model.resumen = entity.resumen;
    model.recomendaciones = entity.recomendaciones;
    model.alertaId = entity.alertaId || null;
    return model;
  }
}
