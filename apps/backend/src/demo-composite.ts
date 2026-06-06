import { AppDataSource } from '../../../shared/infrastructure/data-source';
import { UsuarioModel } from '../../../shared/infrastructure/models/usuario.model';

interface IPersonalNode {
  mostrar(indent?: string): void;
}

class UsuarioLeaf implements IPersonalNode {

  constructor(
    private nombre: string,
    private rol: string,
    private especialidad?: string | null
  ) {}

  mostrar(indent: string = ''): void {

    if (this.rol === 'MEDICO') {
      console.log(`${indent}🩺 ${this.nombre} - MEDICO (${this.especialidad})`);
    } else {
      console.log(`${indent}👤 ${this.nombre} - ${this.rol}`);
    }
  }
}

class GrupoPersonal implements IPersonalNode {

  private hijos: IPersonalNode[] = [];

  constructor(private nombre: string) {}

  agregar(nodo: IPersonalNode) {
    this.hijos.push(nodo);
  }

  mostrar(indent: string = ''): void {

    console.log(`\n${indent}📁 ${this.nombre}`);

    for (const h of this.hijos) {
      h.mostrar(indent + '   ');
    }
  }
}

class PersonalCompositeService {

  async construirArbol(): Promise<GrupoPersonal> {

    const repo = AppDataSource.getRepository(UsuarioModel);

    const usuarios = await repo.find();

    const hospital = new GrupoPersonal('HOSPITAL PADOMI');

    const medicos = new GrupoPersonal('MÉDICOS');
    const enfermeros = new GrupoPersonal('ENFERMEROS');
    const administrativos = new GrupoPersonal('ADMINISTRATIVOS');

    const cardiologia = new GrupoPersonal('CARDIOLOGÍA');
    const neumologia = new GrupoPersonal('NEUMOLOGÍA');


    for (const u of usuarios) {

      const nodo = new UsuarioLeaf(
        `${u.nombre} ${u.apellido}`,
        u.rol,
        u.especialidad
      );

      if (u.rol === 'MEDICO') {

        medicos.agregar(nodo);

        const esp = (u.especialidad || '')
             .normalize('NFD')
             .replace(/[\u0300-\u036f]/g, '') // quita tildes
             .trim()
             .toUpperCase();

        if (esp === 'CARDIOLOGIA') {
          cardiologia.agregar(nodo);
        }

        if (esp === 'NEUMOLOGIA') {
         neumologia.agregar(nodo);
        }

      }

      if (u.rol === 'ENFERMERO') {
        enfermeros.agregar(nodo);
      }

      if (u.rol === 'ADMINISTRATIVO') {
        administrativos.agregar(nodo);
      }
    }

    // ensamblar árbol final
    medicos.agregar(cardiologia);
    medicos.agregar(neumologia);

    hospital.agregar(medicos);
    hospital.agregar(enfermeros);
    hospital.agregar(administrativos);

    return hospital;
  }
}

// ==================================================
// 5. DEMO PRINCIPAL
// ==================================================
async function probarComposite() {

  console.log('==================================================');
  console.log('     PRUEBA DEL PATRÓN DE DISEÑO: COMPOSITE');
  console.log('==================================================\n');

  try {

    // 1. CONEXIÓN BD
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✔ Base de datos conectada correctamente.');
    }

    // 2. CONSTRUIR ÁRBOL
    const service = new PersonalCompositeService();

    console.log('2. Construyendo estructura jerárquica...\n');

    const arbol = await service.construirArbol();

    // 3. MOSTRAR RESULTADO
    arbol.mostrar();

  } catch (error: any) {

    console.log('[ERROR]:', error.message);

  } finally {

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('✔ Composite REAL usando datos de la BD');
  console.log('✔ No se crean registros nuevos');
  console.log('✔ Se reorganiza el personal en estructura jerárquica');
  console.log('✔ Médicos agrupados por especialidad');
  console.log('✔ Arquitectura limpia y escalable');
  console.log('==================================================');
}

probarComposite();