// Modelo ORM compartido para la entidad Evaluacion
// Utilizado en CU-09 (Procesar Reglas Clínicas)
// Define la tabla donde se guardan los estados de severidad y marcas de tiempo en Azure SQL.

import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'Evaluacion' })
@Unique(['codigo'])
export class EvaluacionModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // UNIQUEIDENTIFIER PRIMARY KEY

  @Column({ type: 'nvarchar', length: 20, unique: true })
  codigo!: string; // Ejemplo: EVA-0001

  @Column({ type: 'uuid' })
  pacienteId!: string; // FOREIGN KEY a Paciente(id)

  @Column({ type: 'uuid', nullable: true })
  medicoId!: string | null; // FOREIGN KEY a Usuario(id)

  @Column({ type: 'datetime2' })
  fecha!: Date;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  resumen!: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  recomendaciones!: string;

  @Column({ type: 'uuid', nullable: true })
  alertaId!: string | null; // FOREIGN KEY a Alerta(id)
}
