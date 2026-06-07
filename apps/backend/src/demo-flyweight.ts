import { AppDataSource } from '../../../shared/infrastructure/data-source';
import { UsuarioRepository } from '../../../shared/infrastructure/repositories/usuario.repository';

class EspecialidadFlyweight {
  constructor(public readonly nombre: string) {}
}

class EspecialidadFactory {
  private static especialidades = new Map<string, EspecialidadFlyweight>();
  static obtener(nombreOriginal: string): EspecialidadFlyweight {
    const clave = nombreOriginal
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toUpperCase().trim();
    if (!this.especialidades.has(clave)) {
      console.log(`[FLYWEIGHT]: Creando instancia para: ${nombreOriginal}`);
      this.especialidades.set(clave, new EspecialidadFlyweight(clave));
    }
    return this.especialidades.get(clave)!;
  }
  static cantidadObjetos(): number { return this.especialidades.size; }
}

async function probarFlyweight() {
  console.log('==================================================\n  PRUEBA DEL PATRÓN DE DISEÑO: FLYWEIGHT\n==================================================\n');
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const repo = new UsuarioRepository();
    const usuarios = await repo.listarTodos();
    console.log(`✔ Usuarios encontrados: ${usuarios.length}\n`);
    for (const u of usuarios) {
      if (u.rol === 'MEDICO' && u.especialidad) {
        const esp = EspecialidadFactory.obtener(u.especialidad);
        console.log(`${u.nombre} -> ${esp.nombre}`);
      }
    }

    console.log('\n-------------------- RESULTADO --------------------');
    console.log(`Especialidades únicas en memoria: ${EspecialidadFactory.cantidadObjetos()}`);
    console.log('✔ Los médicos comparten instancias de especialidad.');
    console.log('✔ Se evita crear objetos repetidos.');
    console.log('✔ Aplicación correcta del patrón Flyweight.');
    console.log('==================================================');
    
  } catch (error: any) {
    console.log(`[ERROR]: ${error.message}`);
  } finally {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  }
}

probarFlyweight();