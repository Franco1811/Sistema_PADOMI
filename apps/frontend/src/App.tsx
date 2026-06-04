import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  Search, 
  Heart, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  X, 
  AlertTriangle,
  CheckCircle2,
  Phone,
  MapPin
} from 'lucide-react';

interface Paciente {
  id: string;
  codigo: string;
  dni: string;
  nombres: string;
  edad: number;
  diagnostico: string;
  medicoAsignadoId: string;
  telefono?: string;
  direccion?: string;
}

interface ItemDashboard {
  paciente: Paciente;
  estado: 'CRITICO' | 'ADVERTENCIA' | 'NORMAL';
  alertasActivas: number;
}

interface Alerta {
  id: string;
  codigo: string;
  pacienteId: string;
  lecturaId: string;
  severidad: 'NORMAL' | 'ADVERTENCIA' | 'CRITICO';
  mensaje: string;
  fecha: string;
  atendida: boolean;
}

interface ToastMessage {
  id: string;
  pacienteNombre: string;
  mensaje: string;
  severidad: 'CRITICO' | 'ADVERTENCIA';
}

const BACKEND_URL = 'http://localhost:3000';
const MEDICO_ID_TEST = '99999999-9999-9999-9999-999999999999'; // Médico sembrado en demo

export default function App() {
  const [pacientes, setPacientes] = useState<ItemDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas] = useState(3); // Simulado para navegación
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<ItemDashboard | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [medicoId, setMedicoId] = useState<string>('');
  const [medicoNombre, setMedicoNombre] = useState<string>('Cargando médico...');

  // Nuevos estados para CU-07: Atender Emergencia Médica
  const [alertaEmergencia, setAlertaEmergencia] = useState<any | null>(null);
  const [alertasPaciente, setAlertasPaciente] = useState<Alerta[]>([]);
  const [loadingAlertas, setLoadingAlertas] = useState(false);
  const [protocoloEmergencia, setProtocoloEmergencia] = useState<any | null>(null);

  // Estados de simulación de telemetría en tiempo real para el modal
  const [telemetriaFC, setTelemetriaFC] = useState(72);
  const [telemetriaSPO2, setTelemetriaSPO2] = useState(98);
  const [graficoFCPoints, setGraficoFCPoints] = useState<number[]>([70, 72, 71, 73, 72, 75, 74, 76, 72, 71]);
  const [graficoSPO2Points, setGraficoSPO2Points] = useState<number[]>([98, 97, 98, 99, 98, 98, 97, 98, 98, 99]);

  // Cargar alertas de un paciente específico
  const cargarAlertasPaciente = async (pacienteId: string) => {
    try {
      setLoadingAlertas(true);
      const res = await fetch(`${BACKEND_URL}/api/alertas/paciente/${pacienteId}`);
      if (res.ok) {
        const data = await res.json();
        setAlertasPaciente(data);
      }
    } catch (err) {
      console.error('Error al cargar alertas del paciente:', err);
    } finally {
      setLoadingAlertas(false);
    }
  };

  // Atender una alerta crítica / advertencia
  const atenderAlerta = async (alertaId: string, comentario = 'Atención inmediata desde Dashboard'): Promise<boolean> => {
    if (!medicoId) return false;
    try {
      const res = await fetch(`${BACKEND_URL}/api/alertas/${alertaId}/atender`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ medicoId, comentario })
      });

      if (res.ok) {
        // Refrescar lista principal de pacientes
        cargarPacientes();
        return true;
      } else if (res.status === 409) {
        const errorData = await res.json();
        alert(`Conflicto de Concurrencia: ${errorData.error || 'La alerta ya fue gestionada por otro médico.'}`);
        cargarPacientes();
        return false;
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || 'No se pudo atender la alerta.'}`);
        return false;
      }
    } catch (err) {
      console.error('Error al atender la alerta:', err);
      alert('Error de conexión al procesar la atención de la alerta.');
      return false;
    }
  };

  // Cargar médico de pruebas dinámicamente al montar el componente
  useEffect(() => {
    const cargarMedico = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/dashboard/medico-demo`);
        if (res.ok) {
          const data = await res.json();
          setMedicoId(data.id);
          setMedicoNombre(data.nombre);
        }
      } catch (err) {
        console.error('Error al obtener médico de demo:', err);
        // Fallback en caso de error
        setMedicoId(MEDICO_ID_TEST);
        setMedicoNombre('Dr. Carlos Mendoza Ramos');
      }
    };
    cargarMedico();
  }, []);

  // Cargar lista de pacientes
  const cargarPacientes = async () => {
    if (!medicoId) return;
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/dashboard?medicoId=${medicoId}&busqueda=${busqueda}&page=${pagina}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setPacientes(data);
      }
    } catch (err) {
      console.error('Error al cargar pacientes del dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para búsquedas y paginación
  useEffect(() => {
    cargarPacientes();
  }, [busqueda, pagina, medicoId]);

  // Efecto para cargar alertas al seleccionar un paciente
  useEffect(() => {
    if (selectedPaciente) {
      cargarAlertasPaciente(selectedPaciente.paciente.id);
    } else {
      setAlertasPaciente([]);
    }
  }, [selectedPaciente]);

  // Efecto para conexión WebSocket
  useEffect(() => {
    if (!medicoId) return;

    const socket: Socket = io(BACKEND_URL);

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado a WebSockets del Backend');
      // Unirse a la sala de monitoreo del médico
      socket.emit('join', medicoId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Desconectado de WebSockets');
    });

    // Escuchar nuevas alertas críticas en tiempo real
    socket.on('nueva_alerta', (alerta: any) => {
      console.log('Alerta recibida en tiempo real:', alerta);
      
      // Agregar notificación de Toast
      const nuevoToast: ToastMessage = {
        id: Math.random().toString(),
        pacienteNombre: alerta.pacienteNombre || 'Paciente Monitoreado',
        mensaje: alerta.mensaje || 'Nueva alerta detectada',
        severidad: alerta.severidad || 'ADVERTENCIA'
      };
      
      setToasts(prev => [nuevoToast, ...prev]);

      // Si la alerta es crítica, interrumpir la pantalla del médico (Requisito UX de CU-07)
      if (alerta.severidad === 'CRITICO') {
        setAlertaEmergencia(alerta);
      }
      
      // Recargar lista de pacientes
      cargarPacientes();

      // Si el paciente seleccionado es el que recibió la alerta, actualizamos visuales
      if (selectedPaciente && selectedPaciente.paciente.id === alerta.pacienteId) {
        setSelectedPaciente(prev => prev ? {
          ...prev,
          estado: alerta.severidad,
          alertasActivas: prev.alertasActivas + 1
        } : null);
        cargarAlertasPaciente(alerta.pacienteId);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedPaciente, medicoId]);

  // Simulación de latidos y telemetría de telemetría interactiva en el modal
  useEffect(() => {
    if (!selectedPaciente) return;

    // Configurar valores base basados en el nivel de riesgo clínico
    const baseFC = selectedPaciente.estado === 'CRITICO' ? 115 : selectedPaciente.estado === 'ADVERTENCIA' ? 95 : 72;
    const baseSPO2 = selectedPaciente.estado === 'CRITICO' ? 86 : selectedPaciente.estado === 'ADVERTENCIA' ? 93 : 98;

    const interval = setInterval(() => {
      // Fluctuación natural de los signos vitales
      const randomDiffFC = Math.floor(Math.random() * 5) - 2; // -2 a +2
      const randomDiffSPO2 = Math.floor(Math.random() * 3) - 1; // -1 a +1

      const newFC = Math.max(50, Math.min(160, baseFC + randomDiffFC));
      const newSPO2 = Math.max(70, Math.min(100, baseSPO2 + randomDiffSPO2));

      setTelemetriaFC(newFC);
      setTelemetriaSPO2(newSPO2);

      // Desplazar puntos de gráficos
      setGraficoFCPoints(prev => [...prev.slice(1), newFC]);
      setGraficoSPO2Points(prev => [...prev.slice(1), newSPO2]);
    }, 1500);

    return () => clearInterval(interval);
  }, [selectedPaciente]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Convertir puntos de telemetría a coordenadas SVG
  const generateSvgPath = (points: number[], isSpO2 = false) => {
    const minVal = isSpO2 ? 70 : 50;
    const maxVal = isSpO2 ? 100 : 160;
    const range = maxVal - minVal;

    const width = 300;
    const height = 80;
    const step = width / (points.length - 1);

    return points.map((p, idx) => {
      const x = idx * step;
      // Normalizar Y de acuerdo al contenedor SVG (invertido en SVG coords)
      const pct = (p - minVal) / range;
      const y = height - (pct * height);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  return (
    <div className="dashboard-container">
      {/* Cabecera del Panel */}
      <header className="dashboard-header">
        <div className="header-title-section">
          <h1>
            <Activity className="heartbeat-icon" size={32} />
            PADOMI Telemetría
          </h1>
          <p>Médico Activo: {medicoNombre} | Monitoreo Clínico en Tiempo Real</p>
          <p>Última actualización: {new Date().toLocaleString()}</p>
        </div>
        <div className="connection-badge">
          <span className={`connection-dot ${!isConnected ? 'disconnected' : ''}`} />
          {isConnected ? 'Canal en Tiempo Real Conectado' : 'Conectando canal...'}
        </div>
      </header>

      {/* Controles de Búsqueda */}
     <div
  style={{
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem'
  }}
>
  <div
    style={{
      flex: 1,
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}
  >
    <h3>Pacientes Monitoreados</h3>

    <p
      style={{
        fontSize: '2rem',
        fontWeight: 'bold'
      }}
    >
      {pacientes.length}
    </p>

    <small style={{ opacity: 0.7 }}>
      Total de pacientes en seguimiento
    </small>
  </div>

  <div
    style={{
      flex: 1,
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
    }}
  >
    <h3>Estado del Servicio</h3>

    <p
      style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#22c55e'
      }}
    >
      ● Conectado
    </p>

    <small style={{ opacity: 0.7 }}>
      Telemetría en tiempo real activa
    </small>
  </div>
</div>
      <section className="controls-panel">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Buscar paciente por nombre o DNI..." 
            className="search-input"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPagina(1);
            }}
          />
        </div>
        <div className="pagination-info">
          Total pacientes listados: {pacientes.length}
        </div>
      </section>

      {/* Grid de Pacientes */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Cargando datos clínicos de pacientes en tiempo real...
        </div>
      ) : pacientes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', background: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          No se encontraron pacientes asignados o bajo el criterio de búsqueda.
        </div>
      ) : (
        <section className="patients-grid">
          {pacientes.map((item) => {
            const severidadClase = item.estado.toLowerCase();
            const esCritico = item.estado === 'CRITICO';
            
            return (
              <div 
                key={item.paciente.id} 
                className={`patient-card ${severidadClase} ${esCritico ? 'pulse-card-alert' : ''}`}
                onClick={() => setSelectedPaciente(item)}
              >
                <div className="card-header">
                  <div className="patient-info">
                    <h3>{item.paciente.nombres}</h3>
                    <div className="patient-code">DNI: {item.paciente.dni} | Código: {item.paciente.codigo}</div>
                  </div>
                  <span className="severity-badge">{item.estado}</span>
                </div>

                <div className="card-body-details">
                  <div className="detail-row">
                    <span className="detail-label">Edad:</span>
                    <span className="detail-value">{item.paciente.edad} años</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Diagnóstico:</span>
                    <span className="detail-value">{item.paciente.diagnostico}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <span className="alerts-counter">
                    <ShieldAlert size={16} />
                    {item.alertasActivas} {item.alertasActivas === 1 ? 'Alerta activa' : 'Alertas activas'}
                  </span>
                  <span className="click-action">
                    Monitorear <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Paginación */}
      <section className="pagination-panel">
        <button 
          className="pagination-button" 
          disabled={pagina === 1}
          onClick={() => setPagina(prev => prev - 1)}
        >
          <ChevronLeft size={18} /> Anterior
        </button>
        <span className="pagination-info">Página {pagina} de {totalPaginas}</span>
        <button 
          className="pagination-button"
          disabled={pacientes.length < 6}
          onClick={() => setPagina(prev => prev + 1)}
        >
          Siguiente <ChevronRight size={18} />
        </button>
      </section>

      {/* Modal Detalle Paciente con Telemetría Animada */}
      {selectedPaciente && (
        <div className="modal-overlay" onClick={() => setSelectedPaciente(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPaciente(null)}>
              <X size={20} />
            </button>

            <header className="modal-header">
              <h2>{selectedPaciente.paciente.nombres}</h2>
              <div className="patient-dni">
                Paciente Crónico | DNI {selectedPaciente.paciente.dni} | Código {selectedPaciente.paciente.codigo}
              </div>
            </header>

            <div className="modal-grid">
              {/* Columna Izquierda: Información y Telemetría */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="telemetry-panel">
                  <div className="telemetry-header">
                    <span className="telemetry-title">
                      <Heart className="heartbeat-icon" size={18} />
                      Frecuencia Cardíaca
                    </span>
                    <span className="telemetry-value-large" style={{ color: 'var(--critico-color)' }}>
                      {telemetriaFC}
                      <span className="telemetry-unit">lpm</span>
                    </span>
                  </div>
                  {/* Gráfico en tiempo real SVG */}
                  <svg className={`telemetry-chart-svg ${telemetriaFC > 100 ? 'pulsante' : ''}`} viewBox="0 0 300 80">
                    <path d={generateSvgPath(graficoFCPoints)} />
                  </svg>
                </div>

                <div className="telemetry-panel">
                  <div className="telemetry-header">
                    <span className="telemetry-title">
                      <Activity size={18} style={{ color: 'var(--accent-color)' }} />
                      Saturación de Oxígeno (SpO2)
                    </span>
                    <span className="telemetry-value-large" style={{ color: 'var(--accent-color)' }}>
                      {telemetriaSPO2}
                      <span className="telemetry-unit">%</span>
                    </span>
                  </div>
                  {/* Gráfico en tiempo real SVG */}
                  <svg className="telemetry-chart-svg" viewBox="0 0 300 80" style={{ stroke: 'var(--accent-color)' }}>
                    <path d={generateSvgPath(graficoSPO2Points, true)} />
                  </svg>
                </div>
              </div>

              {/* Columna Derecha: Alertas y Diagnóstico */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Ficha Clínica</h4>
                  <div className="card-body-details">
                    <div className="detail-row">
                      <span className="detail-label">Diagnóstico de Base:</span>
                      <span className="detail-value">{selectedPaciente.paciente.diagnostico}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Edad del Paciente:</span>
                      <span className="detail-value">{selectedPaciente.paciente.edad} años</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Médico Asignado:</span>
                      <span className="detail-value">Dr. Carlos Mendoza</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Nivel de Alerta Actual:</span>
                      <span className="detail-value" style={{ 
                        color: selectedPaciente.estado === 'CRITICO' ? 'var(--critico-color)' : 
                               selectedPaciente.estado === 'ADVERTENCIA' ? 'var(--advertencia-color)' : 'var(--normal-color)',
                        fontWeight: 'bold'
                      }}>{selectedPaciente.estado}</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.4)', borderRadius: '16px', padding: '1.25rem', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Alertas Clínicas Activas</h4>
                  {loadingAlertas ? (
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cargando alertas clínicas...</div>
                  ) : alertasPaciente.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--normal-color)', fontSize: '0.9rem' }}>
                      <CheckCircle2 size={16} />
                      Sin alertas activas registradas en este momento.
                    </div>
                  ) : (
                    <div className="alerts-history">
                      {alertasPaciente.map((alt) => (
                        <div key={alt.id} className={`alert-item-row ${alt.severidad.toLowerCase()}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <div className="alert-icon-wrapper">
                              {alt.severidad === 'CRITICO' ? <ShieldAlert size={16} /> : <AlertTriangle size={16} />}
                            </div>
                            <div className="alert-text-content">
                              <div className="alert-msg">{alt.mensaje}</div>
                              <div className="alert-date">{alt.codigo} | {new Date(alt.fecha).toLocaleTimeString()}</div>
                            </div>
                          </div>
                          <button 
                            className="action-btn-atender"
                            onClick={async () => {
                              const ok = await atenderAlerta(alt.id, 'Atendido manualmente desde Modal Clínico');
                              if (ok) {
                                setProtocoloEmergencia({
                                  paciente: selectedPaciente.paciente,
                                  mensaje: alt.mensaje,
                                  codigo: alt.codigo
                                });
                              }
                            }}
                          >
                            Atender
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Interrupción por Emergencia Crítica (Requisito CU-07) */}
      {alertaEmergencia && (
        <div className="emergency-overlay">
          <div className="emergency-modal">
            <div className="emergency-header-flash">
              <ShieldAlert size={48} className="emergency-icon-flash heartbeat-icon" />
              <h2>¡EMERGENCIA CRÍTICA EN CURSO!</h2>
            </div>
            <div className="emergency-body">
              <p className="emergency-intro">Se ha detectado una anomalía clínica crítica en tiempo real.</p>
              <div className="emergency-data-card">
                <div className="emergency-field">
                  <span className="label">Paciente:</span>
                  <span className="value">{alertaEmergencia.pacienteNombre}</span>
                </div>
                <div className="emergency-field">
                  <span className="label">Alerta Clínica:</span>
                  <span className="value text-critico">{alertaEmergencia.mensaje}</span>
                </div>
                <div className="emergency-field">
                  <span className="label">Código:</span>
                  <span className="value font-mono">{alertaEmergencia.codigo}</span>
                </div>
              </div>
              <button
                className="emergency-btn-action animate-pulse"
                onClick={async () => {
                  const ok = await atenderAlerta(alertaEmergencia.id, 'Atendido desde Modal de Interrupción');
                  if (ok) {
                    const matchItem = pacientes.find(p => p.paciente.id === alertaEmergencia.pacienteId);
                    const pacienteObj = matchItem ? matchItem.paciente : {
                      id: alertaEmergencia.pacienteId,
                      nombres: alertaEmergencia.pacienteNombre,
                      dni: '72839401',
                      edad: 74,
                      diagnostico: 'Insuficiencia Respiratoria Crónica',
                      codigo: 'PAC-9921',
                      medicoAsignadoId: medicoId,
                      telefono: '992837482',
                      direccion: 'Av. Salaverry 1420, Jesús María, Lima'
                    };
                    
                    setAlertaEmergencia(null);
                    setProtocoloEmergencia({
                      paciente: pacienteObj,
                      mensaje: alertaEmergencia.mensaje,
                      codigo: alertaEmergencia.codigo
                    });
                  }
                }}
              >
                <ShieldAlert size={20} />
                Atender Emergencia Inmediatamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pantalla de Protocolo y Contacto Post-Atención */}
      {protocoloEmergencia && (
        <div className="emergency-overlay">
          <div className="emergency-modal protocol">
            <div className="emergency-header-flash protocol">
              <CheckCircle2 size={48} style={{ color: 'var(--normal-color)' }} />
              <h2>EMERGENCIA GESTIONADA</h2>
            </div>
            <div className="emergency-body">
              <div className="alert-box-success">
                La alerta <strong>{protocoloEmergencia.codigo}</strong> ha sido marcada como atendida en la base de datos de Azure SQL Server bajo la responsabilidad del doctor activo.
              </div>
              
              <div className="protocol-section">
                <h3><Phone size={18} /> Protocolo Clínico de Contacto Obligatorio</h3>
                <p className="protocol-desc">Es su deber médico legal iniciar el contacto directo inmediato con el paciente o coordinar el despacho de auxilio.</p>
                
                <div className="patient-contact-card">
                  <div className="contact-field">
                    <span className="label">Paciente:</span>
                    <span className="value">{protocoloEmergencia.paciente.nombres}</span>
                  </div>
                  <div className="contact-field">
                    <span className="label">Diagnóstico de Base:</span>
                    <span className="value">{protocoloEmergencia.paciente.diagnostico}</span>
                  </div>
                  <div className="contact-field highlight">
                    <span className="label"><Phone size={16} /> Teléfono del Paciente:</span>
                    <a href={`tel:${protocoloEmergencia.paciente.telefono || ''}`} className="value-phone-link">
                      {protocoloEmergencia.paciente.telefono || 'No registrado'}
                    </a>
                  </div>
                  <div className="contact-field highlight">
                    <span className="label"><MapPin size={16} /> Dirección Domiciliaria:</span>
                    <span className="value">
                      {protocoloEmergencia.paciente.direccion || 'No registrada'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="emergency-btn-action protocol-done"
                onClick={() => {
                  setProtocoloEmergencia(null);
                  setSelectedPaciente(null);
                }}
              >
                Finalizar Protocolo de Emergencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificaciones flotantes en tiempo real */}
      <div className="toasts-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast-message">
            <ShieldAlert className="heartbeat-icon" size={20} />
            <div>
              <strong style={{ color: 'var(--critico-color)', display: 'block', fontSize: '0.9rem' }}>
                ALERTA CRÍTICA: {t.pacienteNombre}
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{t.mensaje}</span>
            </div>
            <button className="toast-close-btn" onClick={() => removeToast(t.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
