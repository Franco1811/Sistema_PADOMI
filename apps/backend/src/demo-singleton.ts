import { DatabaseConnection } from '../../../shared/infrastructure/data-source';

async function probarSingleton() {
  console.log('==================================================');
  console.log('    PRUEBA DEL PATRÓN DE DISEÑO: SINGLETON DB     ');
  console.log('==================================================\n');

  // 1. Obtener la instancia por primera vez
  console.log('Obteniendo Instancia A...');
  const instanciaA = DatabaseConnection.getInstance();

  // 2. Obtener la instancia por segunda vez
  console.log('Obteniendo Instancia B...');
  const instanciaB = DatabaseConnection.getInstance();

  // 3. Comparar las referencias en memoria
  const sonIdenticas = instanciaA === instanciaB;

  console.log('\n-------------------- RESULTADO --------------------');
  console.log(`¿Instancia A e Instancia B son exactamente la misma en memoria?: ${sonIdenticas ? 'SÍ (¡ÉXITO!)' : 'NO'}`);
  console.log('---------------------------------------------------');
  
  if (sonIdenticas) {
    console.log('✔ El patrón Singleton funciona correctamente.');
    console.log('✔ Ambas variables apuntan a la misma dirección física de memoria.');
    console.log('✔ No se abrirán conexiones duplicadas accidentalmente.');
  } else {
    console.log('❌ Error: Se han creado múltiples instancias.');
  }
  console.log('==================================================');
}

probarSingleton();
