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
  AlertCircle,
  UserPlus,
  Search
} from 'lucide-react';
import type { Usuario } from '../services/auth.service';
import { PersonalService, type PersonalAccount } from '../services/personal.service';
import { MetricasService, type Metrica } from '../services/metricas.service';
import { RegistrarPersonalModal } from '../components/administrador/RegistrarPersonalModal';
import { EditarPersonalModal } from '../components/administrador/EditarPersonalModal';
import { AgregarMetricaModal } from '../components/administrador/AgregarMetricaModal';
import { EditarMetricaModal } from '../components/administrador/EditarMetricaModal';
import { RegistrarPacienteModal } from '../components/administrador/RegistrarPacienteModal';
import { EditarPacienteModal } from '../components/administrador/EditarPacienteModal';
import { ConfirmarModal } from '../components/administrador/ConfirmarModal';
import { LOGO_ESSALUD_URL } from './LoginView';

interface AdminViewProps {
  usuario: Usuario;
  token: string;
  onLogout: () => void;
}

interface Paciente {
  id: string;
  codigo: string;
  dni: string;
  nombres: string;
  edad: number;
  diagnostico: string;
  medicoAsignadoId: string;
  telefono: string;
  direccion: string;
  medicoNombre?: string;
}

export function AdminView({ usuario, token, onLogout }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'metricas' | 'pacientes'>('personal');
  const [personal, setPersonal] = useState<PersonalAccount[]>([]);
  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para modales
  const [showRegistrarModal, setShowRegistrarModal] = useState(false);
  const [showEditarModal, setShowEditarModal] = useState(false);
  const [showAgregarMetricaModal, setShowAgregarMetricaModal] = useState(false);
  const [showEditarMetricaModal, setShowEditarMetricaModal] = useState(false);
  const [showRegistrarPacienteModal, setShowRegistrarPacienteModal] = useState(false);
  const [showEditarPacienteModal, setShowEditarPacienteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [personalSeleccionado, setPersonalSeleccionado] = useState<any>(null);
  const [metricaSeleccionada, setMetricaSeleccionada] = useState<any>(null);
  const [pacienteSeleccionadoId, setPacienteSeleccionadoId] = useState<string | null>(null);
  
  const [confirmAction, setConfirmAction] = useState<{
    type: 'eliminarPersonal' | 'eliminarMetrica' | 'eliminarPaciente' | 'deshabilitarPersonal';
    id?: string;
    nombre?: string;
  } | null>(null);

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
      } else if (activeTab === 'metricas') {
        const data = await MetricasService.listar(token);
        setMetricas(data);
      } else if (activeTab === 'pacientes') {
        await cargarPacientes();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al cargar datos.');
    } finally {
      setLoading(false);
    }
  };

  // CORREGIDA: Ya no hace segunda llamada, usa el medicoNombre que viene del backend
  const cargarPacientes = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('http://localhost:3000/api/pacientes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar pacientes');
      }
      
      const data = await response.json();
      console.log('Pacientes desde backend:', data); // Para depurar
      
      // El backend ya envía medicoNombre, solo asignamos los datos
      setPacientes(data);
    } catch (err: any) {
      console.error('Error cargando pacientes:', err);
      setErrorMessage(err.message);
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

  // ==================== ACCIONES DE PERSONAL ====================
  const handleCrearPersonal = () => {
    setShowRegistrarModal(true);
  };

  const handleActualizarPersonal = (personal: any) => {
    setPersonalSeleccionado(personal);
    setShowEditarModal(true);
  };

  const handleDeshabilitarPersonal = (id: string, nombre: string) => {
    setConfirmAction({
      type: 'deshabilitarPersonal',
      id,
      nombre
    });
    setShowConfirmModal(true);
  };

  const handleRegistroExitoso = () => {
    mostrarMensajeTemporal('exito', 'Personal registrado correctamente.');
    cargarDatos();
  };

  const handleEdicionExitosa = () => {
    mostrarMensajeTemporal('exito', 'Personal actualizado correctamente.');
    cargarDatos();
  };

  // ==================== ACCIONES DE MÉTRICAS ====================
  const handleCrearMetrica = () => {
    setShowAgregarMetricaModal(true);
  };

  const handleEditarMetrica = (metrica: any) => {
    setMetricaSeleccionada(metrica);
    setShowEditarMetricaModal(true);
  };

  const handleMetricaCreada = () => {
    mostrarMensajeTemporal('exito', 'Métrica creada correctamente.');
    cargarDatos();
  };

  const handleMetricaEditada = () => {
    mostrarMensajeTemporal('exito', 'Métrica actualizada correctamente.');
    cargarDatos();
  };

  const handleEliminarMetrica = (id: string, nombre: string) => {
    setConfirmAction({
      type: 'eliminarMetrica',
      id,
      nombre
    });
    setShowConfirmModal(true);
  };

  // ==================== ACCIONES DE PACIENTES ====================
  const handleRegistrarPaciente = () => {
    setShowRegistrarPacienteModal(true);
  };

  const handleEditarPaciente = (pacienteId: string) => {
    setPacienteSeleccionadoId(pacienteId);
    setShowEditarPacienteModal(true);
  };

  const handlePacienteRegistrado = () => {
    mostrarMensajeTemporal('exito', 'Paciente registrado correctamente.');
    cargarDatos();
  };

  const handlePacienteActualizado = () => {
    mostrarMensajeTemporal('exito', 'Perfil de paciente actualizado correctamente.');
    cargarDatos();
  };

  // ==================== EJECUTAR CONFIRMACIÓN ====================
  const ejecutarConfirmacion = async () => {
    if (!confirmAction) return;
    
    try {
      if (confirmAction.type === 'deshabilitarPersonal' && confirmAction.id) {
        await PersonalService.deshabilitar(confirmAction.id, token);
        mostrarMensajeTemporal('exito', 'Personal deshabilitado correctamente.');
        cargarDatos();
      } else if (confirmAction.type === 'eliminarMetrica' && confirmAction.id) {
        await MetricasService.eliminar(confirmAction.id, token);
        mostrarMensajeTemporal('exito', 'Métrica eliminada del catálogo con éxito.');
        cargarDatos();
      }
    } catch (err: any) {
      mostrarMensajeTemporal('error', err.message);
    } finally {
      setShowConfirmModal(false);
      setConfirmAction(null);
    }
  };

  // Filtrar pacientes por búsqueda
  const pacientesFiltrados = pacientes.filter(paciente =>
    paciente.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.dni?.includes(searchTerm) ||
    paciente.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="header-user-section" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={handleRegistrarPaciente}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
          >
            <UserPlus size={16} />
            <span>Registrar Paciente</span>
          </button>
          <button className="btn-logout" onClick={onLogout}>
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Pestañas */}
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
          <button 
            onClick={() => setActiveTab('pacientes')}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === 'pacientes' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
              color: activeTab === 'pacientes' ? 'var(--accent-color)' : 'var(--text-secondary)',
              border: 'none',
              borderBottom: activeTab === 'pacientes' ? '2px solid var(--accent-color)' : '2px solid transparent',
              borderRadius: '8px 8px 0 0',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus size={18} /> Gestión de Pacientes (CU-04)
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

        {/* Contenedor Principal */}
        <div className="card" style={{ padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'var(--card-bg)' }}>
          
          {/* ==================== TABLA DE PERSONAL ==================== */}
          {activeTab === 'personal' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Cuentas de Personal Médico y Administrativo</h2>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Crea, modifica y deshabilita usuarios con roles en el sistema de telemetría.
                  </p>
                </div>
                <button 
                  onClick={handleCrearPersonal}
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-color) 0%, #3b82f6 100%)',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    letterSpacing: '0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  <Plus size={18} style={{ transition: 'transform 0.2s' }} />
                  <span>Registrar Personal</span>
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
                                onClick={() => handleActualizarPersonal(p)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                                title="Editar Personal"
                              >
                                <Edit size={16} />
                              </button>
                              {p.activo && (
                                <button 
                                  onClick={() => handleDeshabilitarPersonal(p.id, `${p.nombre} ${p.apellido}`)}
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
          )}

          {/* ==================== TABLA DE MÉTRICAS ==================== */}
          {activeTab === 'metricas' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Catálogo Global de Métricas Clínicas</h2>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Configura las métricas que envían los dispositivos de telemetría y sus rangos de referencia recomendados.
                  </p>
                </div>
                <button 
                  onClick={handleCrearMetrica}
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-color) 0%, #3b82f6 100%)',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    letterSpacing: '0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  <Plus size={18} style={{ transition: 'transform 0.2s' }} />
                  <span>Agregar Métrica</span>
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
                          <td style={{ padding: '1rem' }}>
                            <code style={{ background: 'rgba(255,255,255,0.06)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                              {m.unidad}
                            </code>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{m.descripcion}</td>
                          <td style={{ padding: '1rem', color: 'var(--accent-color)', fontWeight: 600 }}>{m.rangoMin}</td>
                          <td style={{ padding: '1rem', color: 'var(--accent-color)', fontWeight: 600 }}>{m.rangoMax}</td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleEditarMetrica(m)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                                title="Editar Métrica"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleEliminarMetrica(m.id, m.nombre)}
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

          {/* ==================== TABLA DE PACIENTES ==================== */}
          {activeTab === 'pacientes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Lista de Pacientes Crónicos</h2>
                  <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Visualiza y gestiona los pacientes registrados en el sistema.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, DNI o código..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        padding: '0.6rem 1rem 0.6rem 2.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '10px',
                        color: 'var(--text-primary)',
                        fontSize: '0.85rem',
                        width: '250px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Cargando pacientes...</div>
              ) : pacientesFiltrados.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                  {searchTerm ? 'No se encontraron pacientes con esa búsqueda.' : 'No hay pacientes registrados.'}
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '1rem' }}>Código</th>
                        <th style={{ padding: '1rem' }}>DNI</th>
                        <th style={{ padding: '1rem' }}>Nombres</th>
                        <th style={{ padding: '1rem' }}>Edad</th>
                        <th style={{ padding: '1rem' }}>Diagnóstico</th>
                        <th style={{ padding: '1rem' }}>Médico Asignado</th>
                        <th style={{ padding: '1rem' }}>Teléfono</th>
                        <th style={{ padding: '1rem', textAlign: 'right' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pacientesFiltrados.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem', fontWeight: 600 }}>{p.codigo}</td>
                          <td style={{ padding: '1rem' }}>{p.dni}</td>
                          <td style={{ padding: '1rem', fontWeight: 500 }}>{p.nombres}</td>
                          <td style={{ padding: '1rem' }}>{p.edad} años</td>
                          <td style={{ padding: '1rem', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'normal' }}>
                            {p.diagnostico?.length > 50 ? `${p.diagnostico.substring(0, 50)}...` : p.diagnostico || '-'}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ 
                              padding: '0.25rem 0.5rem', 
                              borderRadius: '4px', 
                              fontSize: '0.75rem', 
                              fontWeight: 700,
                              background: 'rgba(59, 130, 246, 0.15)',
                              color: '#60a5fa'
                            }}>
                              {p.medicoNombre || 'No asignado'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>{p.telefono || '-'}</td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button 
                                onClick={() => handleEditarPaciente(p.id)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
                                title="Editar Perfil"
                              >
                                <Edit size={16} />
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

      {/* ==================== MODALES ==================== */}
      
      {/* Modal Registrar Personal */}
      <RegistrarPersonalModal
        isOpen={showRegistrarModal}
        onClose={() => setShowRegistrarModal(false)}
        onSuccess={handleRegistroExitoso}
        token={token}
      />

      {/* Modal Editar Personal */}
      <EditarPersonalModal
        isOpen={showEditarModal}
        onClose={() => setShowEditarModal(false)}
        onSuccess={handleEdicionExitosa}
        token={token}
        personalData={personalSeleccionado}
      />

      {/* Modal Agregar Métrica */}
      <AgregarMetricaModal
        isOpen={showAgregarMetricaModal}
        onClose={() => setShowAgregarMetricaModal(false)}
        onSuccess={handleMetricaCreada}
        token={token}
      />

      {/* Modal Editar Métrica */}
      <EditarMetricaModal
        isOpen={showEditarMetricaModal}
        onClose={() => setShowEditarMetricaModal(false)}
        onSuccess={handleMetricaEditada}
        token={token}
        metricaData={metricaSeleccionada}
      />

      {/* Modal Registrar Paciente */}
      <RegistrarPacienteModal
        isOpen={showRegistrarPacienteModal}
        onClose={() => setShowRegistrarPacienteModal(false)}
        onSuccess={handlePacienteRegistrado}
        token={token}
      />

      {/* Modal Editar Paciente */}
      <EditarPacienteModal
        isOpen={showEditarPacienteModal}
        onClose={() => {
          setShowEditarPacienteModal(false);
          setPacienteSeleccionadoId(null);
        }}
        onSuccess={handlePacienteActualizado}
        token={token}
        pacienteId={pacienteSeleccionadoId}
      />

      {/* Modal de Confirmación */}
      <ConfirmarModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setConfirmAction(null);
        }}
        onConfirm={ejecutarConfirmacion}
        title={
          confirmAction?.type === 'eliminarMetrica' 
            ? 'Eliminar Métrica' 
            : 'Deshabilitar Personal'
        }
        message={
          confirmAction?.type === 'eliminarMetrica'
            ? `¿Está seguro de eliminar la métrica "${confirmAction?.nombre}"? Esta acción no se puede deshacer.`
            : `¿Está seguro de deshabilitar a "${confirmAction?.nombre}"? El usuario no podrá acceder al sistema.`
        }
        confirmText={confirmAction?.type === 'eliminarMetrica' ? 'Eliminar' : 'Deshabilitar'}
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}