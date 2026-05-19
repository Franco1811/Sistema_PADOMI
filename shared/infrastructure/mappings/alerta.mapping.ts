import { Alerta } from '../../domain/entities/alerta.entity';
import { AlertaModel } from '../models/alerta.model';

export class AlertaMapping {
  static toEntity(model: AlertaModel): Alerta {
    return new Alerta(
      model.id,
      model.codigo,
      model.pacienteId,
      model.lecturaId,
      model.severidad as 'NORMAL' | 'ADVERTENCIA' | 'CRITICO',
      model.mensaje || '',
      model.fecha,
      model.atendida
    );
  }

  static toModel(entity: Alerta): AlertaModel {
    const model = new AlertaModel();
    model.id = entity.id;
    model.codigo = entity.codigo;
    model.pacienteId = entity.pacienteId;
    model.lecturaId = entity.lecturaId;
    model.severidad = entity.severidad;
    model.mensaje = entity.mensaje;
    model.fecha = entity.fecha;
    model.atendida = entity.atendida;
    return model;
  }
}
