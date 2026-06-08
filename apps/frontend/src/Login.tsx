import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales incorrectas');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('rol', data.usuario?.rol);

      if (data.usuario?.rol === 'ADMINISTRATIVO') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <style>{`
        /* Reset para eliminar márgenes del navegador y barras de scroll */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
        
        .heartbeat-icon {
          animation: pulse-heart 0.8s infinite alternate;
          color: #ef4444;
          filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.6));
        }
        @keyframes pulse-heart {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
      `}</style>

      <div style={styles.centeredWrapper}>
        <div style={styles.brandSection}>
          <Activity className="heartbeat-icon" size={56} />
          <h1 style={styles.brandTitle}>
            <span style={{ fontWeight: 700 }}>PADOMI</span>
            <span style={{ fontWeight: 600, marginLeft: '12px', color: '#ffffff' }}>Telemetría</span>
          </h1>
        </div>

        <form onSubmit={handleLogin} style={styles.loginCard}>
          <h2 style={styles.cardTitle}>Iniciar Sesión</h2>
          
          {error && <p style={styles.errorText}>{error}</p>}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo electrónico:</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)} 
              style={styles.input}
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña:</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)} 
              style={styles.input}
              required 
            />
          </div>

          <button type="submit" disabled={loading} style={styles.loginButton}>
            {loading ? 'Accediendo...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0f172a',
    backgroundImage: 'radial-gradient(at 10% 10%, rgba(59, 130, 246, 0.15) 0px, transparent 50%), radial-gradient(at 90% 90%, rgba(239, 68, 68, 0.1) 0px, transparent 50%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Outfit', sans-serif",
    color: '#f8fafc',
    overflow: 'hidden', // Esto es clave para ocultar cualquier desbordamiento
    position: 'absolute', // Asegura que ocupe toda la pantalla
    top: 0,
    left: 0
  },
  centeredWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3rem',
    width: '100%'
  },
  brandSection: { display: 'flex', alignItems: 'center', gap: '20px' },
  brandTitle: { fontSize: '3.5rem', margin: 0, letterSpacing: '-0.02em', color: '#ffffff' },
  loginCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '3rem',
    borderRadius: '24px',
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  },
  cardTitle: { textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' },
  errorText: { color: '#ef4444', textAlign: 'center', fontWeight: 500, margin: 0 },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  label: { fontSize: '1.1rem', color: '#94a3b8' },
  input: {
    padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(15, 23, 42, 0.6)', color: 'white', fontSize: '1.1rem',
    fontFamily: "'Outfit', sans-serif"
  },
  loginButton: {
    padding: '1.2rem', backgroundColor: '#3b82f6', border: 'none', borderRadius: '14px',
    color: 'white', fontWeight: 700, fontSize: '1.2rem', cursor: 'pointer', marginTop: '1rem',
    transition: 'background 0.3s'
  }
};