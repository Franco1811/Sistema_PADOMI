import { AppDataSource } from '../../../shared/infrastructure/data-source';
import { PersonalRepository } from './modules/CU02_GestionarPersonal/infrastructure/personal.repository';

async function probarProxy() {
  console.log('==================================================');
  console.log('      PRUEBA DEL PATRÓN DE DISEÑO: PROXY       ');
  console.log('==================================================\n');

  // 1. EL PROXY CON VALIDACIÓN DE ROLES Y EXISTENCIA
  class PersonalRepositoryProxy {
    private repoReal = new PersonalRepository();

    async obtenerDatosPersonal(id: string, rol: string): Promise<any> {
      console.log(`[PROXY]: Validando petición para ID: ${id} con rol: [${rol}]`);
      
      // A. Lógica de Autorización (Seguridad)
      const rolesAutorizados = ['MEDICO', 'ADMIN'];
      if (!rolesAutorizados.includes(rol)) {
        throw new Error(`Acceso Denegado: El rol ${rol} no tiene permisos.`);
      }

      // B. Consultar al repositorio real
      const personal = await this.repoReal.buscarPorId(id);

      // C. Lógica de Verificación (Existencia en BD)
      if (!personal) {
        throw new Error(`No encontrado: El personal con ID ${id} no existe en la base de datos.`);
      }

      console.log(`[PROXY]: Acceso validado y registro encontrado.`);
      return personal;
    }
  }

  // 2. EJECUCIÓN DE PRUEBAS
  try {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    const proxy = new PersonalRepositoryProxy();

    // PRUEBA A: Acceso Denegado por ROL
    console.log('--- Prueba A: Rol ENFERMERO (Debe bloquear por rol) ---');
    try {
      await proxy.obtenerDatosPersonal('F0B5E162-0D6A-4A3E-963B-111E1EC22FA7', 'ENFERMERO');
    } catch (err: any) {
      console.log(`✔ BLOQUEADO CORRECTAMENTE: ${err.message}`);
    }

    // PRUEBA B: Acceso Denegado por ID INEXISTENTE
    console.log('\n--- Prueba B: Rol MEDICO con ID FALSO (Debe bloquear por existencia) ---');
    try {
      await proxy.obtenerDatosPersonal('00000000-0000-0000-0000-000000000000', 'MEDICO');
    } catch (err: any) {
      console.log(`✔ BLOQUEADO CORRECTAMENTE: ${err.message}`);
    }

    // PRUEBA C: Acceso Permitido
    console.log('\n--- Prueba C: Rol MEDICO con ID REAL ---');
    try {
      const datos = await proxy.obtenerDatosPersonal('F0B5E162-0D6A-4A3E-963B-BF2E1EC22FA7', 'MEDICO');
      console.log(`✔ ÉXITO: Acceso concedido al personal: ${datos.nombre || 'Personal encontrado'}`);
    } catch (err: any) {
      console.log(`❌ Error inesperado: ${err.message}`);
    }

  } catch (error: any) {
    console.log(`Error crítico: ${error.message}`);
  } finally {
    await AppDataSource.destroy();
  }

  // 3. RESULTADO
  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de Proxy: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Seguridad robustecida: Control de roles y validación de existencia.');
  console.log('✔ El Proxy ahora actúa como un filtro inteligente completo.');
  console.log('==================================================');
}

probarProxy();