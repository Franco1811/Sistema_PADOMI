import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { PermisoModel } from './permiso.model';
import { RecursoModel } from './recurso.model';

@Entity({ name: 'rol' })
export class RolModel {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre!: string;

  @ManyToMany(() => PermisoModel)
  @JoinTable({
    name: 'rol_permiso',
    joinColumn: { name: 'rol_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permiso_id', referencedColumnName: 'id' }
  })
  permisos!: PermisoModel[];

  @ManyToMany(() => RecursoModel)
  @JoinTable({
    name: 'rol_recurso',
    joinColumn: { name: 'rol_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'recurso_id', referencedColumnName: 'id' }
  })
  recursos!: RecursoModel[];
}
