interface EstadoPaciente {
  mostrarEstado(nombrePaciente: string, lectura: number): void;
}

class EstadoNormal implements EstadoPaciente {
  mostrarEstado(nombrePaciente: string, lectura: number): void {
    console.log(`🟢 ${nombrePaciente} - Estado: NORMAL`);
    console.log(`Lectura registrada: ${lectura}`);
    console.log('Paciente estable, continúa en monitoreo regular.');
  }
}

class EstadoAdvertencia implements EstadoPaciente {
  mostrarEstado(nombrePaciente: string, lectura: number): void {
    console.log(`🟡 ${nombrePaciente} - Estado: ADVERTENCIA`);
    console.log(`Lectura registrada: ${lectura}`);
    console.log('Se recomienda seguimiento médico preventivo.');
  }
}

class EstadoCritico implements EstadoPaciente {
  mostrarEstado(nombrePaciente: string, lectura: number): void {
    console.log(`🔴 ${nombrePaciente} - Estado: CRITICO`);
    console.log(`Lectura registrada: ${lectura}`);
    console.log('Se debe generar alerta clínica inmediata.');
  }
}

class PacienteMonitoreado {
  constructor(
    private nombre: string,
    private estado: EstadoPaciente,
    private lectura: number
  ) {}

  cambiarEstado(estado: EstadoPaciente, lectura: number): void {
    console.log('\n🔄 Nueva lectura biométrica recibida...');
    this.estado = estado;
    this.lectura = lectura;
  }

  mostrarEstado(): void {
    this.estado.mostrarEstado(this.nombre, this.lectura);
  }
}

function probarState(): void {
  console.log('==================================================');
  console.log('        PRUEBA DEL PATRÓN DE DISEÑO: STATE        ');
  console.log('==================================================\n');

  const paciente = new PacienteMonitoreado(
    'Pedro Mendoza',
    new EstadoNormal(),
    120
  );

  paciente.mostrarEstado();

  paciente.cambiarEstado(new EstadoAdvertencia(), 145);
  paciente.mostrarEstado();

  paciente.cambiarEstado(new EstadoCritico(), 190);
  paciente.mostrarEstado();

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de State: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Se representaron los estados NORMAL, ADVERTENCIA y CRITICO.');
  console.log('✔ Cada estado define su propio comportamiento clínico.');
  console.log('✔ Se simula el flujo de CU09_ProcesarReglas.');
  console.log('✔ Se evita usar múltiples condicionales if/else.');
  console.log('==================================================');
}

probarState();