import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const [personal, setPersonal] = useState<any[]>([]);
  const [metricas, setMetricas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ dni: '', nombre: '', apellido: '', email: '', password: '', rol: 'MEDICO', especialidad: '' });

  const cargarDatos = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };
    try {
      const [resP, resM] = await Promise.all([
        fetch('http://localhost:3000/api/personal', { headers }),
        fetch('http://localhost:3000/api/catalogo', { headers })
      ]);
      if (resP.ok) setPersonal(await resP.json());
      if (resM.ok) setMetricas(await resM.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (localStorage.getItem('rol') !== 'ADMINISTRATIVO') navigate('/dashboard');
    else cargarDatos();
  }, [navigate]);

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/api/personal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(formData)
    });
    if (res.ok) { alert('Personal registrado'); cargarDatos(); } else alert('Error al registrar');
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Panel Administrativo</h1>
      
      {/* Formulario Estilizado */}
      <div style={styles.card}>
        <h3 style={styles.subtitle}>Registrar Nuevo Personal</h3>
        <form onSubmit={handleRegistrar} style={styles.formGrid}>
          <input placeholder="DNI" onChange={e => setFormData({...formData, dni: e.target.value})} style={styles.input} />
          <input placeholder="Nombre" onChange={e => setFormData({...formData, nombre: e.target.value})} style={styles.input} />
          <input placeholder="Apellido" onChange={e => setFormData({...formData, apellido: e.target.value})} style={styles.input} />
          <input placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} style={styles.input} />
          <input type="password" placeholder="Password" onChange={e => setFormData({...formData, password: e.target.value})} style={styles.input} />
          <select onChange={e => setFormData({...formData, rol: e.target.value})} style={styles.input}>
            <option value="MEDICO">MÉDICO</option>
            <option value="ENFERMERO">ENFERMERO</option>
            <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
          </select>
          <button type="submit" style={styles.button}>Registrar</button>
        </form>
      </div>

      {/* Tabla Estilizada */}
      <div style={styles.card}>
        <h3 style={styles.subtitle}>Personal Registrado</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.trHead}>
              <th style={styles.th}>Nombre Completo</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Rol</th>
              <th style={styles.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {personal.map((u: any) => (
              <tr key={u.id} style={styles.trBody}>
                <td style={styles.td}>{u.nombre} {u.apellido}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>{u.rol}</td>
                <td style={styles.td}>{u.activo ? '✅ Activo' : '❌ Inactivo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: { padding: '2rem', backgroundColor: '#0f172a', color: '#f1f5f9', minHeight: '100vh', fontFamily: 'sans-serif' },
  title: { marginBottom: '2rem', textAlign: 'center' },
  subtitle: { marginBottom: '1.5rem', color: '#94a3b8' },
  card: { backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #334155' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' },
  input: { padding: '0.8rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white' },
  button: { padding: '0.8rem', backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  trHead: { borderBottom: '2px solid #334155' },
  th: { padding: '1rem', textAlign: 'left', color: '#94a3b8' },
  trBody: { borderBottom: '1px solid #334155' },
  td: { padding: '1rem' }
};