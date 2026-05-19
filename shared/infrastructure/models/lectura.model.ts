// Modelo ORM compartido para la entidad Lectura
// Utilizado en CU-08 (Ingestar Datos Biométricos)
// Define la estructura física de la tabla de lecturas en Azure SQL usando TypeORM.

import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'Lectura' })
@Unique(['codigo'])
export class LecturaModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // UNIQUEIDENTIFIER PRIMARY KEY

  @Column({ type: 'nvarchar', length: 20, unique: true })
  codigo!: string; // Ejemplo: LEC-0001

  @Column({ type: 'uuid' })
  pacienteId!: string; // FOREIGN KEY a Paciente(id)

  @Column({ type: 'uuid' })
  metricaId!: string; // FOREIGN KEY a Metrica(id)

  @Column({ type: 'float' })
  valor!: number;

  @Column({ type: 'datetime2' })
  fecha!: Date;
}
