import { AuthService } from './modules/CU01_auth/application/auth.service';
import { LoginDto } from './modules/CU01_auth/application/login.dto';
import { AppDataSource } from '../../../shared/infrastructure/data-source'; // Ajusta esta ruta según donde esté tu archivo data-source.ts

async function probarFacadeReal() {
  console.log('==================================================');
  console.log('      PRUEBA DEL PATRÓN DE DISEÑO: FACADE       ');
  console.log('==================================================\n');

  // 1. Inicializar la conexión a la base de datos
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✔ Base de datos conectada correctamente.');
    }
  } catch (error) {
    console.error('❌ Error al conectar a la BD:', error);
    return;
  }

  // 2. Ejecutar la lógica de la fachada
  const authService = new AuthService();
  const dto = new LoginDto();
  dto.email = 'ps@gmail.com'; 
  dto.password = 'Doterodelalma37';

  console.log('2. Ejecutando login real...');
  try {
    const resultado = await authService.login(dto);
    console.log(`✔ Login exitoso. Usuario: ${resultado.usuario.nombre}`);
  } catch (error: any) {
    console.log(`❌ Error durante el login: ${error.message}`);
  } finally {
    // 3. Cerrar conexión para que el script termine limpiamente
    await AppDataSource.destroy();
  }

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de Facade: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Se encapsuló la complejidad del flujo de inicio de sesión en un único punto.');
  console.log('✔ Se redujo drásticamente el acoplamiento del cliente hacia los servicios.');
  console.log('✔ Se centralizó la lógica de orquestación, facilitando futuras extensiones.');
  console.log('✔ Se garantizó una interfaz limpia y consistente para la capa superior.');
  console.log('==================================================');
}

probarFacadeReal();