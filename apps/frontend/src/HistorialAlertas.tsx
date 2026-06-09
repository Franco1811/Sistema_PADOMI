import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

type Severidad = 'NORMAL' | 'ADVERTENCIA' | 'CRITICO';

interface AlertaHistorial {
  id: string;
  paciente: string;
  mensaje: string;
  severidad: Severidad;
  fecha: string;
  atendida: boolean;
}

const alertasDemo: AlertaHistorial[] = [
  {
    id: 'ALT-001',
    paciente: 'Pedro Mendoza',
    mensaje: 'Presión arterial elevada detectada',
    severidad: 'CRITICO',
    fecha: 'Hace 5 min',
    atendida: false,
  },
  {
    id: 'ALT-002',
    paciente: 'Lucía Alva',
    mensaje: 'Frecuencia cardíaca fuera del rango esperado',
    severidad: 'ADVERTENCIA',
    fecha: 'Hace 18 min',
    atendida: false,
  },
  {
    id: 'ALT-003',
    paciente: 'Julio Cortazar',
    mensaje: 'Lectura biométrica normalizada',
    severidad: 'NORMAL',
    fecha: 'Hace 40 min',
    atendida: true,
  },
];

export default function HistorialAlertas() {
  const getIcon = (severidad: Severidad) => {
    if (severidad === 'CRITICO') return <ShieldAlert size={20} color="#ef4444" />;
    if (severidad === 'ADVERTENCIA') return <AlertTriangle size={20} color="#f59e0b" />;
    return <CheckCircle2 size={20} color="#22c55e" />;
  };

  return (
    <section style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Historial de Alertas</h2>
          <p style={styles.subtitle}>Seguimiento clínico reciente del sistema PADOMI</p>
        </div>

        <span style={styles.badge}>
          {alertasDemo.length} registros
        </span>
      </div>

      <div style={styles.list}>
        {alertasDemo.map((alerta) => (
          <div key={alerta.id} style={styles.card}>
            <div style={styles.iconBox}>
              {getIcon(alerta.severidad)}
            </div>

            <div style={styles.content}>
              <div style={styles.row}>
                <strong style={styles.patient}>{alerta.paciente}</strong>
                <span style={styles.date}>{alerta.fecha}</span>
              </div>

              <p style={styles.message}>{alerta.mensaje}</p>

              <div style={styles.footer}>
                <span style={styles.code}>{alerta.id}</span>
                <span
                  style={{
                    ...styles.status,
                    color: alerta.atendida ? '#22c55e' : '#f59e0b',
                  }}
                >
                  {alerta.atendida ? 'Atendida' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: '2rem',
    padding: '1.5rem',
    borderRadius: '18px',
    background: 'rgba(30, 41, 59, 0.75)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 18px 35px rgba(0,0,0,0.25)',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
  },

  title: {
    margin: 0,
    color: '#ffffff',
    fontSize: '1.4rem',
  },

  subtitle: {
    margin: '0.3rem 0 0',
    color: '#94a3b8',
    fontSize: '0.95rem',
  },

  badge: {
    padding: '0.4rem 0.8rem',
    borderRadius: '999px',
    background: 'rgba(37, 99, 235, 0.18)',
    color: '#93c5fd',
    fontWeight: 700,
    fontSize: '0.85rem',
  },

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.9rem',
  },

  card: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    borderRadius: '14px',
    background: 'rgba(15, 23, 42, 0.65)',
    border: '1px solid rgba(255,255,255,0.06)',
  },

  iconBox: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  content: {
    flex: 1,
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
  },

  patient: {
    color: '#ffffff',
  },

  date: {
    color: '#94a3b8',
    fontSize: '0.85rem',
  },

  message: {
    color: '#cbd5e1',
    margin: '0.35rem 0',
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
  },

  code: {
    color: '#64748b',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
  },

  status: {
    fontWeight: 700,
    fontSize: '0.85rem',
  },
};