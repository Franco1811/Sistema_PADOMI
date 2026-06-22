// Modelo ORM para la tabla de relación PacienteEnfermedad (N:M)
// Relación muchos a muchos entre Paciente y EnfermedadCronica
// Define la estructura física de la tabla de relación en Supabase (PostgreSQL) usando TypeORM.

import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'PacienteEnfermedad' })
export class PacienteEnfermedadModel {
  @PrimaryColumn({ type: 'uuid' })
  pacienteId!: string; // FOREIGN KEY a Paciente(id)

  @PrimaryColumn({ type: 'uuid' })
  enfermedadId!: string; // FOREIGN KEY a EnfermedadCronica(id)
}
