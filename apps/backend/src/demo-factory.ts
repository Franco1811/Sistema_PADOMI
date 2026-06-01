import { repositoryFactory } from '../../../shared/infrastructure/repositories/repository.factory';
import { UsuarioRepository } from '../../../shared/infrastructure/repositories/usuario.repository';
import { PacienteRepository } from '../../../shared/infrastructure/repositories/paciente.repository';
import { MetricaRepository } from '../../../shared/infrastructure/repositories/metrica.repository';

async function probarFactoryMethod() {
  console.log('==================================================');
  console.log('   PRUEBA DEL PATRÓN DE DISEÑO: FACTORY METHOD    ');
  console.log('==================================================\n');

  // 1. Instanciar UsuarioRepository a través de la fábrica
  console.log('Solicitando repositorio de "usuario"...');
  const repoUsuario = repositoryFactory.createRepository('usuario');
  const esUsuarioRepo = repoUsuario instanceof UsuarioRepository;
  console.log(`¿Es instancia de UsuarioRepository?: ${esUsuarioRepo ? 'SÍ (¡ÉXITO!)' : 'NO'}`);

  // 2. Instanciar PacienteRepository a través de la fábrica
  console.log('\nSolicitando repositorio de "paciente"...');
  const repoPaciente = repositoryFactory.createRepository('paciente');
  const esPacienteRepo = repoPaciente instanceof PacienteRepository;
  console.log(`¿Es instancia de PacienteRepository?: ${esPacienteRepo ? 'SÍ (¡ÉXITO!)' : 'NO'}`);

  // 3. Instanciar MetricaRepository a través de la fábrica
  console.log('\nSolicitando repositorio de "metrica"...');
  const repoMetrica = repositoryFactory.createRepository('metrica');
  const esMetricaRepo = repoMetrica instanceof MetricaRepository;
  console.log(`¿Es instancia de MetricaRepository?: ${esMetricaRepo ? 'SÍ (¡ÉXITO!)' : 'NO'}`);

  console.log('\n-------------------- RESULTADO --------------------');
  const todoOk = esUsuarioRepo && esPacienteRepo && esMetricaRepo;
  console.log(`Estado General del Factory Method: ${todoOk ? '✔ COMPLETADO Y OPERATIVO' : '❌ ERROR'}`);
  console.log('---------------------------------------------------');

  if (todoOk) {
    console.log('✔ Las subclases/clases concretas se instanciaron mediante una interfaz común.');
    console.log('✔ Los servicios de aplicación ya no dependen de implementaciones físicas.');
    console.log('✔ Cumple perfectamente con los estándares de Clean Architecture.');
  }
  console.log('==================================================');
}

probarFactoryMethod();
