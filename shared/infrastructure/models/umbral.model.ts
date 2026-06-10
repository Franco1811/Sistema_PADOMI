// Modelo ORM compartido para la entidad Umbral
// Utilizado en CU-04 (Registrar Paciente Crónico) para configurar umbrales personalizados
// Define la estructura física de la tabla de umbrales en Azure SQL usando TypeORM.
// Incluye restricción única compuesta (pacienteId, metricaId).

import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'Umbral' })
@Unique(['pacienteId', 'metricaId'])
export class UmbralModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // UNIQUEIDENTIFIER PRIMARY KEY

  @Column({ type: 'varchar', length: 20, nullable: true, unique: true })
  codigo!: string; // Ejemplo: UMB-0001 (opcional)

  @Column({ type: 'uuid' })
  pacienteId!: string; // FOREIGN KEY a Paciente(id)

  @Column({ type: 'uuid' })
  metricaId!: string; // FOREIGN KEY a Metrica(id)

  @Column({ type: 'float' })
  valorMin!: number;

  @Column({ type: 'float' })
  valorMax!: number;
}
