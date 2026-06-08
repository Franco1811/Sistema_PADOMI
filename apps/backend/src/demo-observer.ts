interface Observer {
  update(message: string): void;
}

class DashboardObserver implements Observer {
  update(message: string): void {
    console.log(`Dashboard recibió: ${message}`);
  }
}

class AlertObserver implements Observer {
  update(message: string): void {
    console.log(`Alerta registrada: ${message}`);
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

const monitoringSystem = new MonitoringSystem();

monitoringSystem.subscribe(new DashboardObserver());
monitoringSystem.subscribe(new AlertObserver());

monitoringSystem.notify(
  'Paciente Pedro Mendoza presenta signos vitales críticos'
);