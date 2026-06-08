interface NotificationStrategy {
  enviar(mensaje: string): void;
}

class NotificacionDashboard implements NotificationStrategy {
  enviar(mensaje: string): void {
    console.log(`[DASHBOARD]: ${mensaje}`);
  }
}

class NotificacionSms implements NotificationStrategy {
  enviar(mensaje: string): void {
    console.log(`[SMS]: ${mensaje}`);
  }
}

class ServicioNotificacion {
  constructor(private strategy: NotificationStrategy) {}

  cambiarEstrategia(strategy: NotificationStrategy): void {
    this.strategy = strategy;
  }

  notificar(mensaje: string): void {
    this.strategy.enviar(mensaje);
  }
}

function probarStrategy(): void {
  console.log('==================================================');
  console.log('      PRUEBA DEL PATRÓN DE DISEÑO: STRATEGY       ');
  console.log('==================================================\n');

  const servicio = new ServicioNotificacion(
    new NotificacionDashboard()
  );

  console.log('1. Enviando alerta al Dashboard...');
  servicio.notificar(
    'Paciente Pedro Mendoza requiere monitoreo.'
  );

  console.log('\n2. Cambiando estrategia a SMS...');
  servicio.cambiarEstrategia(
    new NotificacionSms()
  );

  console.log('3. Enviando alerta por SMS...');
  servicio.notificar(
    'Paciente Pedro Mendoza presenta lectura crítica.'
  );

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de Strategy: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Se cambió el canal de notificación dinámicamente.');
  console.log('✔ Se desacopló la lógica de envío.');
  console.log('✔ Se pueden agregar nuevos canales sin modificar el sistema.');
  console.log('==================================================');
}

probarStrategy();