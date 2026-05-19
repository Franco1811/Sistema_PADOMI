// Mapping compartido entre el modelo ORM y la entidad Paciente
// Utilizado en CU-04 (Registrar Paciente Crónico) y CU-05 (Gestionar Perfil del Paciente).
// Traduce el modelo de base de datos a la entidad pura y viceversa.

import { PacienteModel } from '../models/paciente.model';
import { Paciente } from '../../domain/entities/paciente.entity';

export class PacienteMapping {
  static toEntity(model: PacienteModel): Paciente {
    return new Paciente(
      model.id,
      model.codigo,
      model.dni,
      model.nombres,
      model.edad,
      model.diagnostico || '',
      model.medicoAsignadoId
    );
  }

  static toModel(entity: Paciente): PacienteModel {
    const model = new PacienteModel();
    model.id = entity.id;
    model.codigo = entity.codigo;
    model.dni = entity.dni;
    model.nombres = entity.nombres;
    model.edad = entity.edad;
    model.diagnostico = entity.diagnostico;
    model.medicoAsignadoId = entity.medicoAsignadoId;
    return model;
  }
}
