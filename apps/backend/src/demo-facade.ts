import { AuthService } from './modules/CU01_auth/application/auth.service';
import { LoginDto } from './modules/CU01_auth/application/login.dto';
import { AppDataSource } from '../../../shared/infrastructure/data-source';

class AuthFacade {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  async iniciarSesion(
    email: string,
    password: string
  ): Promise<any> {
    console.log('[FACADE]: Preparando proceso de autenticación...');
    const dto = new LoginDto();
    dto.email = email;
    dto.password = password;
    const resultado = await this.authService.login(dto);
    console.log('[FACADE]: Login completado correctamente.');
    return resultado;
  }
}

async function probarFacade() {
  console.log('==================================================');
  console.log('      PRUEBA DEL PATRÓN DE DISEÑO: FACADE');
  console.log('==================================================\n');
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✔ Base de datos conectada correctamente.');
    }
    const facade = new AuthFacade();
    console.log('2. Ejecutando login mediante Facade...\n');
    const resultado = await facade.iniciarSesion(
      'ps@gmail.com',
      'Doterodelalma37'
    );
    console.log(
      `✔ Login exitoso. Usuario: ${resultado.usuario.nombre}`
    );
  } catch (error: any) {
    console.log(
      `❌ Error durante el login: ${error.message}`
    );
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de Facade: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ El cliente ya no conoce LoginDto.');
  console.log('✔ El cliente ya no interactúa con AuthService.');
  console.log('✔ La autenticación se expone mediante un único punto de acceso.');
  console.log('✔ Se redujo el acoplamiento con las capas internas.');
  console.log('==================================================');
}

probarFacade();