// Mapping compartido entre el modelo ORM y la entidad Paciente
// Utilizado en CU-04 (Registrar Paciente Crónico) y CU-05 (Gestionar Perfil del Paciente).
// Traduce el modelo de base de datos a la entidad pura y viceversa.

import { PacienteModel } from '../models/paciente.model';
import { Paciente } from '../../domain/entities/paciente.entity';
import { PacienteBuilder } from '../../domain/builders/paciente.builder';

export class PacienteMapping {
  static toEntity(model: PacienteModel): Paciente {
    return new PacienteBuilder()
      .conId(model.id)
      .conCodigo(model.codigo)
      .conDni(model.dni)
      .conNombres(model.nombres)
      .conEdad(model.edad)
      .conDiagnostico(model.diagnostico || '')
      .conMedicoAsignadoId(model.medicoAsignadoId)
      .conTelefono(model.telefono || '')
      .conDireccion(model.direccion || '')
      .build();
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
    model.telefono = entity.telefono;
    model.direccion = entity.direccion;
    return model;
  }
}
