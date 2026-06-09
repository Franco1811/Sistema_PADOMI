import { useState } from 'react';
import { Activity } from 'lucide-react';

type LoginProps = {
  onLogin: (rol: 'MEDICO' | 'PACIENTE') => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'MEDICO' | 'PACIENTE'>('MEDICO');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setError('');
    onLogin(rol);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoContainer}>
            <div style={styles.brandContainer}>
  <Activity className="heartbeat-icon" size={46} />
  <h1 style={styles.brandTitle}>PADOMI Telemetría</h1>
</div>
  <h2 style={styles.subtitle}>Sistema de Telemetría Médica</h2>
</div>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <select
            value={rol}
            onChange={(e) =>
              setRol(e.target.value as 'MEDICO' | 'PACIENTE')
            }
            style={styles.input}
          >
            <option value="MEDICO">Médico</option>
            <option value="PACIENTE">Paciente</option>
          </select>

          <button type="submit" style={styles.button}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    background:
      'radial-gradient(circle at top left, #1e3a8a, #0f172a 45%, #020617)',
  },

  card: {
    background: '#1e293b',
    padding: '2rem',
    borderRadius: '18px',
    width: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 20px 45px rgba(0,0,0,0.35)',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '0.5rem',
  },

  brandTitle: {
    color: '#ffffff',
    fontSize: '2.3rem',
    fontWeight: 800,
    margin: 0,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  },

  subtitle: {
    textAlign: 'center',
    color: '#cbd5e1',
    fontSize: '1rem',
    marginTop: '-4px',
    marginBottom: '1.5rem',
  },

  title: {
    textAlign: 'center',
    color: 'white',
    margin: 0,
  },

  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: '1px solid #475569',
    background: '#334155',
    color: '#ffffff',
    fontSize: '1rem',
  },

  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: '#2563eb',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  },

  error: {
    color: '#ef4444',
    textAlign: 'center',
  },
};