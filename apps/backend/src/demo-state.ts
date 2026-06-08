interface EstadoPaciente {
  mostrarEstado(): void;
}

class EstadoNormal implements EstadoPaciente {
  mostrarEstado(): void {
    console.log('🟢 Estado: NORMAL');
  }
}

class EstadoAdvertencia implements EstadoPaciente {
  mostrarEstado(): void {
    console.log('🟡 Estado: ADVERTENCIA');
  }
}

class EstadoCritico implements EstadoPaciente {
  mostrarEstado(): void {
    console.log('🔴 Estado: CRITICO');
  }
}

class Paciente {
  constructor(private estado: EstadoPaciente) {}

  cambiarEstado(estado: EstadoPaciente): void {
    this.estado = estado;
  }

  mostrarEstado(): void {
    this.estado.mostrarEstado();
  }
}

function probarState(): void {
  console.log('==================================================');
  console.log('        PRUEBA DEL PATRÓN DE DISEÑO: STATE        ');
  console.log('==================================================\n');

  const paciente = new Paciente(
    new EstadoNormal()
  );

  paciente.mostrarEstado();

  console.log('\nPaciente presenta valores elevados...');
  paciente.cambiarEstado(
    new EstadoAdvertencia()
  );
  paciente.mostrarEstado();

  console.log('\nPaciente entra en condición crítica...');
  paciente.cambiarEstado(
    new EstadoCritico()
  );
  paciente.mostrarEstado();

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de State: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ El comportamiento cambia según el estado.');
  console.log('✔ Se evita usar múltiples if/else.');
  console.log('✔ Representa el flujo clínico del paciente.');
  console.log('==================================================');
}

probarState();