// Modelo ORM compartido para la entidad EnfermedadCronica
// Utilizado en CU-04 (Registrar Paciente Crónico) para asociar enfermedades a pacientes
// Define la estructura física de la tabla de enfermedades crónicas en Azure SQL usando TypeORM.

import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'EnfermedadCronica' })
@Unique(['nombre'])
export class EnfermedadCronicaModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // UNIQUEIDENTIFIER PRIMARY KEY

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo!: string; // Ejemplo: ENF-0001

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre!: string; // Ej: Diabetes Mellitus, Hipertensión Arterial

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion!: string;
}
