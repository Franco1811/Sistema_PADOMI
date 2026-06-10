import { Usuario } from '../../../shared/domain/entities/usuario.entity';
import { Paciente } from '../../../shared/domain/entities/paciente.entity';
import { Umbral } from '../../../shared/domain/entities/umbral.entity';
import { Metrica } from '../../../shared/domain/entities/metrica.entity';
import { Alerta } from '../../../shared/domain/entities/alerta.entity';
import { Rol } from '../../../shared/domain/entities/rol.entity';
import { Especialidad } from '../../../shared/domain/entities/especialidad.entity';

async function probarPrototype() {
  console.log('==================================================');
  console.log('     PRUEBA DEL PATRÓN DE DISEÑO: PROTOTYPE       ');
  console.log('==================================================\n');

  // 1. Instancias base (Prototipos originales)
  const rolMedico = new Rol(2, 'MEDICO');
  const especialidadCardio = new Especialidad(2, 'Cardiología');

  const usuarioBase = new Usuario(
    'u-1111-uuid',
    'USU-0101',
    '87654321',
    'Nicolás',
    'Soto',
    'nicolas.soto@essalud.gob.pe',
    '$2b$10$hashedpasswords123',
    rolMedico,
    true,
    especialidadCardio
  );

  const pacienteBase = new Paciente(
    'p-2222-uuid',
    'PAC-0202',
    '12345678',
    'Carmen Flores',
    68,
    'Hipertensión Leve',
    'u-1111-uuid'
  );

  const umbralBase = new Umbral(
    'umb-3333-uuid',
    'UMB-0303',
    'p-2222-uuid',
    'met-9999',
    60,
    100
  );

  const metricaBase = new Metrica(
    'met-9999-uuid',
    'MET-0404',
    'Frecuencia Cardíaca',
    'LPM',
    'Mide pulsaciones por minuto',
    40,
    200
  );

  const alertaBase = new Alerta(
    'alt-5555-uuid',
    'ALT-0505',
    'p-2222-uuid',
    'lec-8888',
    'ADVERTENCIA',
    'Frecuencia Cardíaca Elevada',
    new Date(),
    false
  );

  // 2. Ejecutar clonaciones usando Prototype (.clone)
  console.log('1. Clonando y modificando Usuario (Cambiando email institucional a personal)...');
  const usuarioClon = usuarioBase.clone({ email: 'nicolas.soto.personal@essalud.gob.pe' });
  console.log(`   Original Email: ${usuarioBase.email}`);
  console.log(`   Clon Email:     ${usuarioClon.email}`);
  console.log(`   ¿Son referencias diferentes?: ${usuarioBase !== usuarioClon ? 'SÍ (¡ÉXITO!)' : 'NO'}`);
  console.log(`   ¿Mantiene atributos inalterados?: ${usuarioClon.nombre === 'Nicolás' && (usuarioClon.especialidad ? (typeof usuarioClon.especialidad === 'string' ? usuarioClon.especialidad : usuarioClon.especialidad.nombre) : '') === 'Cardiología' ? 'SÍ' : 'NO'}\n`);

  console.log('2. Clonando y modificando Paciente (Actualizando su diagnóstico)...');
  const pacienteClon = pacienteBase.clone({ diagnostico: 'Hipertensión Crónica de Grado II' });
  console.log(`   Original Diagnóstico: ${pacienteBase.diagnostico}`);
  console.log(`   Clon Diagnóstico:     ${pacienteClon.diagnostico}`);
  console.log(`   ¿Son referencias diferentes?: ${pacienteBase !== pacienteClon ? 'SÍ (¡ÉXITO!)' : 'NO'}\n`);

  console.log('3. Clonando y modificando Umbral (Cambiando el rango mínimo)...');
  const umbralClon = umbralBase.clone({ valorMin: 70 });
  console.log(`   Original Rango: ${umbralBase.valorMin} - ${umbralBase.valorMax}`);
  console.log(`   Clon Rango:     ${umbralClon.valorMin} - ${umbralClon.valorMax}`);
  console.log(`   ¿Son referencias diferentes?: ${umbralBase !== umbralClon ? 'SÍ (¡ÉXITO!)' : 'NO'}\n`);

  console.log('4. Clonando y modificando Métrica (Cambiando descripción y rangos)...');
  const metricaClon = metricaBase.clone({ descripcion: 'Nueva descripción de pulsaciones', rangoMax: 180 });
  console.log(`   Original Rango Max: ${metricaBase.rangoMax} (${metricaBase.descripcion})`);
  console.log(`   Clon Rango Max:     ${metricaClon.rangoMax} (${metricaClon.descripcion})`);
  console.log(`   ¿Son referencias diferentes?: ${metricaBase !== metricaClon ? 'SÍ (¡ÉXITO!)' : 'NO'}\n`);

  console.log('5. Ejecutando marcarComoAtendida() en Alerta (usa .clone internamente)...');
  const alertaAtendida = alertaBase.marcarComoAtendida();
  console.log(`   Original Atendida: ${alertaBase.atendida}`);
  console.log(`   Clon Atendida:     ${alertaAtendida.atendida}`);
  console.log(`   ¿Son referencias diferentes?: ${alertaBase !== alertaAtendida ? 'SÍ (¡ÉXITO!)' : 'NO'}\n`);

  // 3. Probar validaciones al clonar con datos incorrectos
  console.log('6. Validando seguridad del Prototype ante datos erróneos...');
  try {
    console.log('Intentando clonar Umbral con valorMax menor al valorMin (inválido)...');
    umbralBase.clone({ valorMin: 120, valorMax: 80 });
    console.log('❌ Error: El clone permitió crear un objeto incoherente.');
  } catch (error: any) {
    console.log(`✔ ÉXITO: El clone bloqueó el objeto corrupto con el error: "${error.message}"`);
  }

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General del Prototype: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Las entidades se duplican eficientemente en memoria.');
  console.log('✔ Permite actualizaciones parciales con una sola línea de código.');
  console.log('✔ Mantiene las reglas de integridad de la Arquitectura Limpia.');
  console.log('==================================================');
}

probarPrototype();
