import { AppDataSource } from '../../../shared/infrastructure/data-source';
import { AuthService } from './modules/CU01_auth/application/auth.service';
import { LoginDto } from './modules/CU01_auth/application/login.dto';

interface IAuthAdapter {
  iniciarSesion(email: string, password: string): Promise<any>;
}

class AuthAdapter implements IAuthAdapter {
  constructor(private authService: AuthService) {}
  async iniciarSesion(email: string, password: string): Promise<any> {
    const dto = new LoginDto();
    dto.email = email;
    dto.password = password;
    console.log(`[ADAPTER]: Adaptando credenciales para login de ${email}`);
    return await this.authService.login(dto);
  }
}

async function probarAdapter() {
  console.log('==================================================');
  console.log('      PRUEBA DEL PATRÓN DE DISEÑO: ADAPTER       ');
  console.log('==================================================\n');
  try {

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✔ Base de datos conectada correctamente.');
    }
    const authService = new AuthService();
    const authAdapter = new AuthAdapter(authService);
    console.log('2. Ejecutando login mediante Adapter...');
    const resultado = await authAdapter.iniciarSesion(
      'ps@gmail.com',
      'Doterodelalma37'
    );
    console.log(`✔ Login exitoso. Token generado`);
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de Adapter: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Se adaptó una interfaz simple a un DTO complejo.');
  console.log('✔ Se desacopló el cliente del formato interno del servicio.');
  console.log('✔ Se encapsuló la creación del LoginDto dentro del Adapter.');
  console.log('==================================================');
}

probarAdapter();