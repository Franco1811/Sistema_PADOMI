
// Modelo ORM compartido para la entidad Paciente
// Utilizado en CU-04 (Registrar Paciente Crónico) y CU-05 (Gestionar Perfil del Paciente).
// Define la estructura física de la tabla de pacientes en Azure SQL usando TypeORM.


import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'Paciente' })
export class PacienteModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // UNIQUEIDENTIFIER PRIMARY KEY

  @Column({ type: 'nvarchar', length: 20, unique: true })
  codigo!: string; // Ejemplo: PAC-0001

  @Column({ type: 'char', length: 8, unique: true })
  dni!: string;

  @Column({ type: 'nvarchar', length: 100 })
  nombres!: string;

  @Column({ type: 'int' })
  edad!: number;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  diagnostico!: string;

  @Column({ type: 'uuid' })
  medicoAsignadoId!: string; // FOREIGN KEY a Usuario(id)
}