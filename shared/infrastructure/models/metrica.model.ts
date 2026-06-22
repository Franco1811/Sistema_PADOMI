// Modelo ORM compartido para la entidad Metrica
// Utilizado en CU-03 (Gestionar Catálogo de Métricas)
// Define la estructura física de la tabla de métricas clínicas en Supabase (PostgreSQL) usando TypeORM.
// Incluye restricciones únicas en codigo y nombre (RNF-49).

import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'Metrica' })
@Unique(['codigo', 'nombre'])
export class MetricaModel {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // UNIQUEIDENTIFIER PRIMARY KEY

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo!: string; // Ejemplo: MET-0001

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre!: string; // Ej: Glucosa, Presión Arterial, Oximetría

  @Column({ type: 'varchar', length: 20 })
  unidad!: string; // Ej: mg/dL, mmHg, %

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion!: string;

  @Column({ type: 'float' })
  rangoMin!: number;

  @Column({ type: 'float' })
  rangoMax!: number;
}
