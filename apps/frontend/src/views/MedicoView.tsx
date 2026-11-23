import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Phone,
  MapPin
} from 'lucide-react';

import type { Usuario } from '../services/auth.service';
import { useMedicoDashboard } from '../hooks/useMedicoDashboard';
import { useTelemetriaSimulada } from '../hooks/useTelemetriaSimulada';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DashboardHeader } from '../components/medico/DashboardHeader';
import { FiltrosPanel } from '../components/medico/FiltrosPanel';
import { PacienteCard } from '../components/medico/PacienteCard';
import { MonitoreoModal } from '../components/medico/MonitoreoModal';
import { GestionarFichaModal } from '../components/medico/GestionarFichaModal';

// 1. Importar el hook de accesibilidad
import { useAccessibility } from '../accessibility/AccessibilityContext';

const BACKEND_URL = 'http://localhost:3000';

interface MedicoViewProps {
  usuario: Usuario;
  token: string;
  onLogout: () => void;
  addToast: (titulo: string, mensaje: string, severidad: 'CRITICO' | 'ADVERTENCIA' | 'INFO' | 'EXITO') => void;
}

export function MedicoView({ usuario, token, onLogout, addToast }: MedicoViewProps) {
  // 2. Extraer la función de lectura de texto
  const { speakText } = useAccessibility();

  const dashboard = useMedicoDashboard(usuario, token, addToast);
  const telemetria = useTelemetriaSimulada(dashboard.selectedPaciente, dashboard.catalogoMetricas, dashboard.lecturasHistoricas, dashboard.editUmbrales);

  const selectedPacienteRef = useRef(dashboard.selectedPaciente);
  useEffect(() => {
    selectedPacienteRef.current = dashboard.selectedPaciente;
  }, [dashboard.selectedPaciente]);

  // Manejo de atajos de teclado (Tecla Escape para cerrar modales o protocolos activos)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        speakText("Cerrando ventana de monitoreo o protocolo");
        dashboard.setSelectedPaciente(null);
        dashboard.setIsEditingFicha(false);
        dashboard.setAlertaEmergencia(null);
        dashboard.setProtocoloEmergencia(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [speakText, dashboard]);

  // Conexión WebSockets
  useEffect(() => {
    const socket: Socket = io(BACKEND_URL);

    socket.on('connect', () => {
      dashboard.setIsConnected(true);
      socket.emit('join', usuario.id);
    });

    socket.on('disconnect', () => {
      dashboard.setIsConnected(false);
    });

    socket.on('nueva_alerta', (alerta: any) => {
      addToast(
        alerta.pacienteNombre || 'Paciente Monitoreado',
        alerta.mensaje || 'Nueva alerta detectada',
        alerta.severidad || 'ADVERTENCIA'
      );

      if (alerta.severidad === 'CRITICO') {
        dashboard.setAlertaEmergencia(alerta);
      }

      dashboard.cargarPacientes();

      const currentSelected = selectedPacienteRef.current;
      if (currentSelected && currentSelected.paciente.id === alerta.pacienteId) {
        dashboard.setSelectedPaciente((prev: any) => prev ? {
          ...prev,
          estado: alerta.severidad,
          alertasActivas: prev.alertasActivas + 1
        } : null);
        dashboard.cargarAlertasPaciente(alerta.pacienteId);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [usuario.id, token]);

  // Filtrado local en el cliente para Gravedad y Alertas Activas
  const pacientesFiltrados = dashboard.pacientes.filter(p => {
    if (dashboard.filtroEstado !== 'TODOS' && p.estado !== dashboard.filtroEstado) return false;
    if (dashboard.soloAlertasActivas && p.alertasActivas === 0) return false;
    return true;
  });

  return (
    <div className="dashboard-container">
      {/* Cabecera del Panel */}
      <div onClick={() => speakText(`Panel médico de telemetría para ${usuario.nombre}`)}>
        <DashboardHeader
          usuario={usuario}
          isConnected={dashboard.isConnected}
          totalPacientes={dashboard.totalPacientes}
          alertasCriticas={dashboard.alertasCriticas}
          onLogout={onLogout}
        />
      </div>

      {/* Controles de Búsqueda y Filtros */}
      <div onClick={() => speakText("Sección de filtros y búsqueda de pacientes")}>
        <FiltrosPanel
          busqueda={dashboard.busqueda}
          setBusqueda={dashboard.setBusqueda}
          setPagina={dashboard.setPagina}
          filtroEstado={dashboard.filtroEstado}
          setFiltroEstado={dashboard.setFiltroEstado}
          soloAlertasActivas={dashboard.soloAlertasActivas}
          setSoloAlertasActivas={dashboard.setSoloAlertasActivas}
          pacientesFiltradosLength={pacientesFiltrados.length}
          pacientesTotalLength={dashboard.pacientes.length}
        />
      </div>

      {/* Grid de Pacientes de Alta Prioridad */}
      {dashboard.loadingPacientes ? (
        <div className="loader-container" onClick={() => speakText("Cargando panel de telemetría y telemonitoreo")}>
          <div className="clinical-spinner" />
          <p>Cargando panel de telemetría y telemonitoreo...</p>
        </div>
      ) : pacientesFiltrados.length === 0 ? (
        <div 
          className="empty-state" 
          style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(30,41,59,0.1)', borderRadius: '16px', border: '1px dashed var(--border-color)', marginTop: '1.5rem', width: '100%' }}
          onClick={() => speakText("No se encontraron pacientes con los filtros seleccionados")}
        >
          <h3>No se encontraron pacientes</h3>
          <p>Verifique los filtros seleccionados o el criterio de búsqueda superior.</p>
        </div>
      ) : (
        <>
          <div className="patients-grid" style={{ marginTop: '1.5rem' }}>
            {pacientesFiltrados.map((p) => (
              <div 
                key={p.paciente.id} 
                onClick={() => speakText(`Paciente: ${p.paciente.nombres}, Diagnóstico: ${p.paciente.diagnostico || 'No registrado'}, Estado: ${p.estado}`)}
              >
                <PacienteCard
                  p={p}
                  onClick={() => dashboard.setSelectedPaciente(p)}
                />
              </div>
            ))}
          </div>

          {/* Paginación */}
          {(() => {
            const LIMIT = 6;
            const totalPaginas = (dashboard.pagina === 1 && dashboard.pacientes.length < LIMIT)
              ? 1
              : (dashboard.pacientes.length === LIMIT ? dashboard.pagina + 1 : dashboard.pagina);

            const mostrarPaginador = dashboard.pagina > 1 || dashboard.pacientes.length === LIMIT;

            if (!mostrarPaginador) return null;

            return (
              <div className="pagination-panel" onClick={() => speakText(`Página actual ${dashboard.pagina}`)}>
                <button
                  className="btn-pagination"
                  disabled={dashboard.pagina === 1}
                  onClick={() => dashboard.setPagina(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} /> Anterior
                </button>
                <span className="pagination-info">Página {dashboard.pagina}</span>
                <button
                  className="btn-pagination"
                  disabled={dashboard.pacientes.length < LIMIT}
                  onClick={() => dashboard.setPagina(p => p + 1)}
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            );
          })()}
        </>
      )}

      {/* Modal de Detalle Clínico: Monitoreo o Edición */}
      {dashboard.selectedPaciente && (
        dashboard.isEditingFicha ? (
          <GestionarFichaModal
            selectedPaciente={dashboard.selectedPaciente}
            setSelectedPaciente={dashboard.setSelectedPaciente}
            setIsEditingFicha={dashboard.setIsEditingFicha}
            editTelefono={dashboard.editTelefono}
            setEditTelefono={dashboard.setEditTelefono}
            editDireccion={dashboard.editDireccion}
            setEditDireccion={dashboard.setEditDireccion}
            editUmbrales={dashboard.editUmbrales}
            setEditUmbrales={dashboard.setEditUmbrales}
            catalogoMetricas={dashboard.catalogoMetricas}
            nuevaMetricaId={dashboard.nuevaMetricaId}
            nuevaMetricaMin={dashboard.nuevaMetricaMin}
            nuevaMetricaMax={dashboard.nuevaMetricaMax}
            handleSelectMetrica={dashboard.handleSelectMetrica}
            setNuevaMetricaMin={dashboard.setNuevaMetricaMin}
            setNuevaMetricaMax={dashboard.setNuevaMetricaMax}
            agregarNuevaMetrica={dashboard.agregarNuevaMetrica}
            mostrarConfirmacion={dashboard.mostrarConfirmacion}
            guardarCambiosFicha={dashboard.guardarCambiosFicha}
            isSavingFicha={dashboard.isSavingFicha}
          />
        ) : (
          <MonitoreoModal
            selectedPaciente={dashboard.selectedPaciente}
            setSelectedPaciente={dashboard.setSelectedPaciente}
            setIsEditingFicha={dashboard.setIsEditingFicha}
            loadingAlertas={dashboard.loadingAlertas}
            alertasPaciente={dashboard.alertasPaciente}
            enfermedadesPaciente={dashboard.enfermedadesPaciente}
            evaluandoAlerta={dashboard.evaluandoAlerta}
            setEvaluandoAlerta={dashboard.setEvaluandoAlerta}
            resumenClinico={dashboard.resumenClinico}
            setResumenClinico={dashboard.setResumenClinico}
            recomendacionesClinicas={dashboard.recomendacionesClinicas}
            setRecomendacionesClinicas={dashboard.setRecomendacionesClinicas}
            atenderAlerta={dashboard.atenderAlerta}
            cargarAlertasPaciente={dashboard.cargarAlertasPaciente}
            catalogoMetricas={dashboard.catalogoMetricas}
            telemetria={telemetria}
            umbralesPaciente={dashboard.editUmbrales}
          />
        )
      )}

      {/* Notificación de Emergencia de Alta Prioridad (Modal Interruptivo CU-07) */}
      {dashboard.alertaEmergencia && (
        <div className="emergency-overlay">
          <div className="emergency-modal critical-flash">
            <div className="emergency-header-flash" onClick={() => speakText("Alerta crítica detectada en el sistema")}>
              <ShieldAlert className="heartbeat-icon" size={48} />
              <h2>ALERTA CRÍTICA DETECTADA (CU-07)</h2>
            </div>
            <div className="emergency-body">
              <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.6 }}>
                El paciente <strong>{dashboard.alertaEmergencia.pacienteNombre}</strong> ha registrado una lectura fuera del rango de seguridad:
              </p>
              <div className="clinical-alert-box" onClick={() => speakText(dashboard.alertaEmergencia.mensaje)}>
                <span className="metric-tag">{dashboard.alertaEmergencia.codigo}</span>
                <p className="alert-msg">"{dashboard.alertaEmergencia.mensaje}"</p>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                *Al presionar 'Atender Emergencia', el sistema registrará de inmediato su DNI y firma digital en la base de datos de telemetría de EsSalud y le presentará la ficha clínica de contacto para el paciente.*
              </p>

              <button
                className="emergency-btn-action"
                onClick={() => {
                  speakText("Atendiendo emergencia inmediatamente");
                  const alerta = {
                    id: dashboard.alertaEmergencia.id,
                    codigo: dashboard.alertaEmergencia.codigo,
                    mensaje: dashboard.alertaEmergencia.mensaje
                  };
                  const pacienteObj = {
                    paciente: {
                      id: dashboard.alertaEmergencia.pacienteId,
                      nombres: dashboard.alertaEmergencia.pacienteNombre,
                      telefono: dashboard.alertaEmergencia.telefono,
                      direccion: dashboard.alertaEmergencia.direccion,
                      diagnostico: dashboard.alertaEmergencia.diagnostico,
                      codigo: '',
                      dni: '',
                      edad: 0
                    },
                    estado: 'CRITICO'
                  };

                  dashboard.setSelectedPaciente(pacienteObj);
                  dashboard.setEvaluandoAlerta(alerta);
                  dashboard.setAlertaEmergencia(null);
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
      {dashboard.protocoloEmergencia && (
        <div className="emergency-overlay">
          <div className="emergency-modal protocol">
            <div className="emergency-header-flash protocol" onClick={() => speakText("Emergencia gestionada con éxito")}>
              <CheckCircle2 size={48} style={{ color: 'var(--normal-color)' }} />
              <h2>EMERGENCIA GESTIONADA</h2>
            </div>
            <div className="emergency-body">
              <div className="alert-box-success" onClick={() => speakText(`La alerta ${dashboard.protocoloEmergencia.codigo} ha sido marcada como atendida`)}>
                La alerta <strong>{dashboard.protocoloEmergencia.codigo}</strong> ha sido marcada como atendida en la base de datos de Supabase bajo la responsabilidad del doctor activo.
              </div>

              <div className="emergency-protocol-grid">
                <div className="protocol-info-column">
                  <h3><Phone size={18} /> Protocolo Clínico de Contacto Obligatorio</h3>
                  <p className="protocol-desc">Es su deber médico legal iniciar el contacto directo inmediato con el paciente o coordinar el despacho de auxilio.</p>
                  
                  <div className="protocol-checklist">
                    <div className="checklist-item">
                      <span className="check-bullet">1</span>
                      <span>Llame al número del paciente o de su contacto de emergencia.</span>
                    </div>
                    <div className="checklist-item">
                      <span className="check-bullet">2</span>
                      <span>Confirme su estado de conciencia y síntomas actuales.</span>
                    </div>
                    <div className="checklist-item">
                      <span className="check-bullet">3</span>
                      <span>Indique las medidas inmediatas o despache una unidad PADOMI.</span>
                    </div>
                  </div>
                </div>

                <div className="patient-contact-card">
                  <div className="contact-field" onClick={() => speakText(`Paciente: ${dashboard.protocoloEmergencia.paciente.nombres}`)}>
                    <span className="label">Paciente</span>
                    <span className="value-name">{dashboard.protocoloEmergencia.paciente.nombres}</span>
                  </div>
                  <div className="contact-field" onClick={() => speakText(`Diagnóstico: ${dashboard.protocoloEmergencia.paciente.diagnostico || 'No registrado'}`)}>
                    <span className="label">Diagnóstico de Base</span>
                    <span className="value-text">{dashboard.protocoloEmergencia.paciente.diagnostico || 'No registrado'}</span>
                  </div>
                  <div className="contact-field highlight" onClick={() => speakText(`Teléfono de contacto: ${dashboard.protocoloEmergencia.paciente.telefono || 'No registrado'}`)}>
                    <span className="label"><Phone size={14} /> Teléfono del Paciente</span>
                    {dashboard.protocoloEmergencia.paciente.telefono ? (
                      <a href={`tel:${dashboard.protocoloEmergencia.paciente.telefono}`} className="value-phone-link">
                        {dashboard.protocoloEmergencia.paciente.telefono}
                      </a>
                    ) : (
                      <span className="value-text" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                        No registrado
                      </span>
                    )}
                  </div>
                  <div className="contact-field highlight" onClick={() => speakText(`Dirección: ${dashboard.protocoloEmergencia.paciente.direccion || 'No registrada'}`)}>
                    <span className="label"><MapPin size={14} /> Dirección Domiciliaria</span>
                    <span className="value-text">
                      {dashboard.protocoloEmergencia.paciente.direccion || 'No registrada'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="emergency-btn-action protocol-done"
                onClick={() => {
                  speakText("Finalizando protocolo de emergencia");
                  dashboard.setProtocoloEmergencia(null);
                  dashboard.setSelectedPaciente(null);
                }}
              >
                Finalizar Protocolo de Emergencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diálogo de Confirmación Reutilizable */}
      <ConfirmDialog
        visible={dashboard.confirmDialog.visible}
        titulo={dashboard.confirmDialog.titulo}
        mensaje={dashboard.confirmDialog.mensaje}
        onConfirm={dashboard.confirmDialog.onConfirm}
        onCancel={dashboard.cerrarConfirmacion}
      />
    </div>
  );
}