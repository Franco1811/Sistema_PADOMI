import { useState, useEffect } from 'react';
import { 
  Users, 
  Activity, 
  LogOut, 
  Plus, 
  Edit, 
  UserX, 
  Trash2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import type { Usuario } from '../services/auth.service';
import { PersonalService, type PersonalAccount } from '../services/personal.service';
import { MetricasService, type Metrica } from '../services/metricas.service';
import { LOGO_ESSALUD_URL } from './LoginView';

interface AdminViewProps {
  usuario: Usuario;
  token: string;
  onLogout: () => void;
}

export function AdminView({ usuario, token, onLogout }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'metricas'>('personal');
  const [personal, setPersonal] = useState<PersonalAccount[]>([]);
  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar datos al cambiar de pestaña
  useEffect(() => {
    cargarDatos();
  }, [activeTab]);

  const cargarDatos = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      if (activeTab === 'personal') {
        const data = await PersonalService.listar(token);
        setPersonal(data);
      } else {
        const data = await MetricasService.listar(token);
        setMetricas(data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al cargar datos de la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensajeTemporal = (tipo: 'exito' | 'error', msg: string) => {
    if (tipo === 'exito') {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Stubs para acciones de Personal (CU-02)
  const handleCrearPersonal = async () => {
    // TODO: Tu compañero implementará el formulario/modal para capturar los datos
    console.log('Crear personal clickeado');
    mostrarMensajeTemporal('exito', 'Función para registrar personal disponible para implementar.');
  };

  const handleActualizarPersonal = async (id: string) => {
    // TODO: Tu compañero implementará la edición
    console.log('Actualizar personal:', id);
  };

  const handleDeshabilitarPersonal = async (id: string) => {
    if (!window.confirm('¿Está seguro de deshabilitar esta cuenta de personal?')) return;
    try {
      await PersonalService.deshabilitar(id, token);
      mostrarMensajeTemporal('exito', 'Personal deshabilitado correctamente.');
      cargarDatos();
    } catch (err: any) {
      mostrarMensajeTemporal('error', err.message);
    }
  };

  // Stubs para acciones de Catálogo de Métricas (CU-03)
  const handleCrearMetrica = async () => {
    // TODO: Tu compañero implementará el formulario/modal de creación de métrica
    console.log('Crear métrica clickeado');
    mostrarMensajeTemporal('exito', 'Función para agregar métrica clínica disponible para implementar.');
  };

  const handleEliminarMetrica = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar esta métrica del catálogo?')) return;
    try {
      await MetricasService.eliminar(id, token);
      mostrarMensajeTemporal('exito', 'Métrica eliminada del catálogo con éxito.');
      cargarDatos();
    } catch (err: any) {
      mostrarMensajeTemporal('error', err.message);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Cabecera del Panel del Administrador */}
      <header className="dashboard-header">
        <div className="header-title-section" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={LOGO_ESSALUD_URL} alt="EsSalud Logo" className="dashboard-logo-essalud" />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem' }}>PADOMI Telemetría</h1>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.88rem' }}>
              Administrador: <strong>{usuario.nombre} {usuario.apellido}</strong> (Cód: <strong>{usuario.codigo}</strong>)
            </p>
          </div>
        </div>
        <div className="header-user-section">
          <button className="btn-logout" onClick={onLogout}>
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal con Layout de Panel de Control */}
      <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Pestañas de Navegación */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '1rem', paddingBottom: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('personal')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'personal' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              color: activeTab === 'personal' ? 'var(--accent-color)' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === 'personal' ? '2px solid var(--accent-color)' : '2px solid transparent',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={18} /> Gestión de Personal (CU-02)
          </button>
          <button 
            onClick={() => setActiveTab('metricas')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'metricas' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              color: activeTab === 'metricas' ? 'var(--accent-color)' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === 'metricas' ? '2px solid var(--accent-color)' : '2px solid transparent',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Activity size={18} /> Catálogo de Métricas (CU-03)
          </button>
        </div>

        {/* Mensajes de feedback */}
        {successMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem' }}>
            <Check size={18} /> {successMessage}
          </div>
        )}
        {errorMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem' }}>
            <AlertCircle size={18} /> {errorMessage}
          </div>
        )}

        {/* Tabla/Contenedor Principal */}
        <div className="card" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--card-bg)' }}>
          
          {activeTab === 'personal' ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Cuentas de Personal Médico y Administrativo</h2>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Crea, modifica y deshabilita usuarios con roles en el sistema de telemetría.
                  </p>
                </div>
                <button className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.9rem' }} onClick={handleCrearPersonal}>
                  <Plus size={16} /> Registrar Personal
                </button>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Cargando personal...</div>
              ) : personal.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No se encontraron cuentas de personal.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '1rem' }}>Código</th>
                        <th style={{ padding: '1rem' }}>Nombre Completo</th>
                        <th style={{ padding: '1rem' }}>DNI</th>
                        <th style={{ padding: '1rem' }}>Email</th>
                        <th style={{ padding: '1rem' }}>Rol</th>
                        <th style={{ padding: '1rem' }}>Especialidad</th>
                        <th style={{ padding: '1rem' }}>Estado</th>
                        <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personal.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: p.activo ? 1 : 0.6 }}>
                          <td style={{ padding: '1rem', fontWeight: 600 }}>{p.codigo}</td>
                          <td style={{ padding: '1rem' }}>{p.nombre} {p.apellido}</td>
                          <td style={{ padding: '1rem' }}>{p.dni}</td>
                          <td style={{ padding: '1rem' }}>{p.email}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: 700,
                              background: p.rol.nombre === 'ADMIN' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                              color: p.rol.nombre === 'ADMIN' ? '#a78bfa' : '#60a5fa'
                            }}>
                              {p.rol.nombre}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>
                            {p.especialidad 
                              ? (typeof p.especialidad === 'string' ? p.especialidad : p.especialidad.nombre) 
                              : '-'
                            }
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '0.25rem',
                              color: p.activo ? '#10b981' : '#ef4444',
                              fontWeight: 600
                            }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.activo ? '#10b981' : '#ef4444' }} />
                              {p.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleActualizarPersonal(p.id)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                                title="Editar Personal"
                              >
                                <Edit size={16} />
                              </button>
                              {p.activo && (
                                <button 
                                  onClick={() => handleDeshabilitarPersonal(p.id)}
                                  style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                                  title="Deshabilitar Cuenta"
                                >
                                  <UserX size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Catálogo Global de Métricas Clínicas</h2>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Configura las métricas que envían los dispositivos de telemetría y sus rangos de referencia recomendados.
                  </p>
                </div>
                <button className="btn-save" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', borderRadius: '8px', fontSize: '0.9rem' }} onClick={handleCrearMetrica}>
                  <Plus size={16} /> Agregar Métrica
                </button>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Cargando métricas...</div>
              ) : metricas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No se encontraron métricas clínicas.</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '1rem' }}>Código</th>
                        <th style={{ padding: '1rem' }}>Nombre de Métrica</th>
                        <th style={{ padding: '1rem' }}>Unidad</th>
                        <th style={{ padding: '1rem' }}>Descripción</th>
                        <th style={{ padding: '1rem' }}>Límite Normal Mínimo</th>
                        <th style={{ padding: '1rem' }}>Límite Normal Máximo</th>
                        <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metricas.map((m) => (
                        <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem', fontWeight: 600 }}>{m.codigo}</td>
                          <td style={{ padding: '1rem', fontWeight: 500 }}>{m.nombre}</td>
                          <td style={{ padding: '1rem' }}><code style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{m.unidad}</code></td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{m.descripcion}</td>
                          <td style={{ padding: '1rem', color: 'var(--accent-color)', fontWeight: 600 }}>{m.rangoMin}</td>
                          <td style={{ padding: '1rem', color: 'var(--accent-color)', fontWeight: 600 }}>{m.rangoMax}</td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleEliminarMetrica(m.id)}
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                                title="Eliminar Métrica"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
