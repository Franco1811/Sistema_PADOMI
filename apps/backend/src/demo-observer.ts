interface Observer {
  update(message: string): void;
}

class DashboardObserver implements Observer {
  update(message: string): void {
    console.log(`[DASHBOARD]: ${message}`);
  }
}

class AlertObserver implements Observer {
  update(message: string): void {
    console.log(`[ALERTA]: ${message}`);
  }
}

class MonitoringSystem {
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  notify(message: string): void {
    this.observers.forEach(observer => observer.update(message));
  }
}

function probarObserver(): void {
  console.log('==================================================');
  console.log('      PRUEBA DEL PATRÓN DE DISEÑO: OBSERVER       ');
  console.log('==================================================\n');

  const monitoringSystem = new MonitoringSystem();

  console.log('1. Registrando observadores...');
  monitoringSystem.subscribe(new DashboardObserver());
  monitoringSystem.subscribe(new AlertObserver());

  console.log('✔ DashboardObserver registrado.');
  console.log('✔ AlertObserver registrado.\n');

  console.log('2. Enviando evento clínico...');
  monitoringSystem.notify(
    'Paciente Pedro Mendoza presenta signos vitales críticos'
  );

  console.log('\n-------------------- RESULTADO --------------------');
  console.log('Estado General de Observer: ✔ COMPLETADO Y OPERATIVO');
  console.log('---------------------------------------------------');
  console.log('✔ Se notificó a múltiples observadores.');
  console.log('✔ Se desacopló el emisor de los receptores.');
  console.log('✔ Se simuló la propagación de alertas clínicas.');
  console.log('✔ Representa el flujo de eventos del dashboard PADOMI.');
  console.log('==================================================');
}

probarObserver();