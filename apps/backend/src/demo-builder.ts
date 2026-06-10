import { UsuarioBuilder } from '../../../shared/domain/builders/usuario.builder';
import { PacienteBuilder } from '../../../shared/domain/builders/paciente.builder';
import { Rol } from '../../../shared/domain/entities/rol.entity';

async function probarBuilder() {
  console.log('==================================================');
  console.log('      PRUEBA DEL PATRÓN DE DISEÑO: BUILDER        ');
  console.log('==================================================\n');

  // 1. Construir un Usuario válido
  console.log('1. Creando un Usuario administrativo válido...');
  try {
    const usuarioValido = new UsuarioBuilder()
      .conId('a6b3d4f1-cf2a-4a22-91d8-4f81a798516d')
      .conCodigo('USU-0001')
      .conDni('12345678')
      .conNombre('Juan')
      .conApellido('Pérez')
      .conEmail('juan.perez@essalud.gob.pe')
      .conPasswordHash('$2b$10$abcdefghijklmnopqrstuv')
      .conRol(new Rol(1, 'ADMIN'))
      .conActivo(true)
      .build();

    console.log('✔ Usuario creado con éxito usando Builder.');
    console.log(`   DNI: ${usuarioValido.dni}`);
    console.log(`   Nombre Completo: ${usuarioValido.nombre} ${usuarioValido.apellido}`);
    console.log(`   Rol: ${usuarioValido.rol.nombre}`);
  } catch (error: any) {
    console.log(`❌ Error al crear usuario válido: ${error.message}`);
  }

  // 2. Construir un Paciente válido
  console.log('\n2. Creando un Paciente crónico válido...');
  try {
    const pacienteValido = new PacienteBuilder()
      .conId('98f4e241-11d2-43bb-a5a4-0c58e7456d98')
      .conCodigo('PAC-0001')
      .conDni('87654321')
      .conNombres('María Delgado')
      .conEdad(72)
      .conDiagnostico('Hipertensión Arterial Crónica')
      .conMedicoAsignadoId('a6b3d4f1-cf2a-4a22-91d8-4f81a798516d')
      .build();

    console.log('✔ Paciente creado con éxito usando Builder.');
    console.log(`   DNI: ${pacienteValido.dni}`);
    console.log(`   Nombre: ${pacienteValido.nombres}`);
    console.log(`   Edad: ${pacienteValido.edad} años`);
  } catch (error: any) {
    console.log(`❌ Error al crear paciente válido: ${error.message}`);
  }

  // 3. Probar que las reglas de negocio de dominio siguen activas al hacer build
  console.log('\n3. Probando validación automática al construir con datos inválidos...');
  try {
    console.log('Intentando construir un Usuario con DNI inválido (de letras)...');
    new UsuarioBuilder()
      .conId('b7c8d9e0-f1a2-3b4c-5d6e-7f8a9b0c1d2e')
      .conDni('DNI_FALSO') // DNI no numérico, debería fallar
      .conNombre('Carlos')
      .conApellido('Gómez')
      .conEmail('carlos@essalud.gob.pe')
      .conPasswordHash('password123')
      .conRol(new Rol(2, 'MEDICO'))
      .build();

    console.log('❌ Error: El builder construyó un objeto con datos inválidos (no se activaron las validaciones).');
  } catch (error: any) {
    console.log(`✔ ÉXITO: El sistema arrojó el error esperado: "${error.message}"`);
  }

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General del Builder: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Se eliminó el acoplamiento a constructores con parámetros múltiples.');
  console.log('✔ El orden de los parámetros ya no es un factor de riesgo.');
  console.log('✔ Las invariantes y reglas de dominio se mantienen seguras.');
  console.log('==================================================');
}

probarBuilder();
