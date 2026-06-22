import { useState } from 'react';
import { X, Heart, Activity, ShieldAlert, FileSpreadsheet } from 'lucide-react';
import type { Metrica } from '../../services/metricas.service';

interface MonitoreoModalProps {
  selectedPaciente: any | null;
  setSelectedPaciente: (p: any | null) => void;
  setIsEditingFicha: (v: boolean) => void;
  loadingAlertas: boolean;
  alertasPaciente: any[];
  enfermedadesPaciente: any[];
  evaluandoAlerta: any | null;
  setEvaluandoAlerta: (a: any | null) => void;
  resumenClinico: string;
  setResumenClinico: (v: string) => void;
  recomendacionesClinicas: string;
  setRecomendacionesClinicas: (v: string) => void;
  atenderAlerta: (alertaId: string, resumen: string, recomendaciones: string) => Promise<boolean>;
  cargarAlertasPaciente: (pacienteId: string) => Promise<void>;
  catalogoMetricas: Metrica[];
  telemetria: any;
  umbralesPaciente: any[];
}

export function MonitoreoModal({
  selectedPaciente,
  setSelectedPaciente,
  setIsEditingFicha,
  loadingAlertas,
  alertasPaciente,
  enfermedadesPaciente,
  evaluandoAlerta,
  setEvaluandoAlerta,
  resumenClinico,
  setResumenClinico,
  recomendacionesClinicas,
  setRecomendacionesClinicas,
  atenderAlerta,
  cargarAlertasPaciente,
  catalogoMetricas,
  telemetria,
  umbralesPaciente
}: MonitoreoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedPaciente) return null;

  const handleSubmetAtencion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluandoAlerta || isSubmitting) return;
    if (!resumenClinico.trim()) {
      alert("El diagnóstico / resumen es obligatorio.");
      return;
    }
    if (!recomendacionesClinicas.trim()) {
      alert("Las recomendaciones son obligatorias.");
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await atenderAlerta(evaluandoAlerta.id, resumenClinico, recomendacionesClinicas);
      if (ok) {
        setEvaluandoAlerta(null);
        setResumenClinico('');
        setRecomendacionesClinicas('');
        cargarAlertasPaciente(selectedPaciente.paciente.id);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setSelectedPaciente(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '100%' }}>
        
        {/* Botón de cerrar posicionado absolutamente según index.css */}
        <button className="modal-close" onClick={() => setSelectedPaciente(null)} title="Cerrar ventana">
          <X size={18} />
        </button>

        {/* Encabezado del Modal */}
        <div className="modal-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', paddingRight: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={24} style={{ color: 'var(--essalud-azul)' }} />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Monitoreo Clínico en Vivo
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              className="btn-primary"
              onClick={() => setIsEditingFicha(true)}
              style={{ fontSize: '0.82rem', padding: '0.5rem 1rem', background: 'var(--essalud-azul)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Gestionar Ficha
            </button>
          </div>
        </div>

        {/* Resumen del Paciente */}
        <div className="modal-patient-summary" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{selectedPaciente.paciente.nombres}</h3>
              <div className="patient-meta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>DNI: <strong style={{ color: 'var(--text-primary)' }}>{selectedPaciente.paciente.dni}</strong></span>
                <span>Código: <strong style={{ color: 'var(--text-primary)' }}>{selectedPaciente.paciente.codigo}</strong></span>
                <span>Edad: <strong style={{ color: 'var(--text-primary)' }}>{selectedPaciente.paciente.edad} años</strong></span>
                <span>Diagnóstico Base: <strong style={{ color: 'var(--text-primary)' }}>{selectedPaciente.paciente.diagnostico}</strong></span>
              </div>
            </div>
            <div className="patient-status-indicator" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado</span>
              <span className={`status-pill ${selectedPaciente.estado === 'CRITICO' ? 'critico' : selectedPaciente.estado === 'ADVERTENCIA' ? 'advertencia' : 'normal'}`} style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, marginTop: '0.25rem' }}>
                {selectedPaciente.estado === 'CRITICO' ? 'CRÍTICO' : selectedPaciente.estado === 'ADVERTENCIA' ? 'ADVERTENCIA' : 'ESTABLE'}
              </span>
            </div>
          </div>

          {/* Listado de Enfermedades Crónicas (CU-05) */}
          {enfermedadesPaciente.length > 0 && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Enfermedades Crónicas:</span>
              {enfermedadesPaciente.map((enf) => (
                <span key={enf.id} style={{ fontSize: '0.7rem', padding: '3px 8px', background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.15)', fontWeight: 700 }} title={enf.descripcion}>
                  {enf.nombre}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dos columnas: Gráficos de telemetría y Alertas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', width: '100%' }}>
          
          {/* Columna Izquierda: Sensores */}
          <div style={{ flex: '1.2 1 450px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!umbralesPaciente || umbralesPaciente.length === 0 ? (
              <div style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                border: '1px dashed var(--border-color)',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                height: '100%',
                minHeight: '220px'
              }}>
                <Activity size={40} style={{ color: 'var(--text-secondary)', opacity: 0.6 }} />
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700 }}>Sin métricas configuradas</h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.4 }}>Este paciente no cuenta con métricas ni umbrales de alerta configurados.</p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => setIsEditingFicha(true)}
                  style={{ fontSize: '0.75rem', padding: '0.45rem 1rem', background: 'var(--essalud-azul)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Configurar Métricas
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {umbralesPaciente.map((u) => {
                  const met = catalogoMetricas.find(m => m.id === u.metricaId);
                  if (!met) return null;

                  const valorActual = telemetria.valores[u.metricaId] ?? ((Number(u.valorMin) + Number(u.valorMax)) / 2);
                  const puntos = telemetria.historicos[u.metricaId] ?? Array(10).fill(valorActual);

                  const isFC = met.nombre.toLowerCase().includes('frecuencia') || met.nombre.toLowerCase().includes('cardiaca') || met.nombre.toLowerCase().includes('card\u00edaca');
                  const isGlucosa = met.nombre.toLowerCase().includes('gluco');
                  const isPresion = met.nombre.toLowerCase().includes('presi') || met.nombre.toLowerCase().includes('tensi') || met.nombre.toLowerCase().includes('arterial');

                  let IconComponent = Activity;
                  let iconColor = 'var(--accent-color)';
                  if (isFC) {
                    IconComponent = Heart;
                    iconColor = 'var(--critico-color)';
                  } else if (isGlucosa) {
                    iconColor = '#f59e0b';
                  } else if (isPresion) {
                    iconColor = '#8b5cf6';
                  }

                  const path = telemetria.generateSvgPath(puntos, Number(met.rangoMin), Number(met.rangoMax));

                  return (
                    <div key={u.metricaId} className="sensor-card">
                      <div className="sensor-meta">
                        <span>{met.nombre}</span>
                        <IconComponent size={18} style={{ color: iconColor }} className={isFC ? "heartbeat-icon" : ""} />
                      </div>
                      <div className="sensor-value-row">
                        <span className="sensor-value">
                          {typeof valorActual === 'number' ? valorActual.toFixed(1) : valorActual}
                        </span>
                        <span className="sensor-unit">{met.unidad}</span>
                      </div>
                      {/* Gráfico Sparkline */}
                      <div className="sensor-sparkline">
                        <svg viewBox="0 0 300 80" className="sparkline-svg">
                          <path
                            d={path}
                            fill="none"
                            stroke={iconColor}
                            strokeWidth="2.5"
                          />
                        </svg>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>
                        Rango Normal: {met.rangoMin} – {met.rangoMax} {met.unidad}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.2rem' }}>
                        Límite: {u.valorMin} – {u.valorMax} {met.unidad}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Columna Derecha: Alertas */}
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column' }}>
            <div className="alerts-history-section" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '12px', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.75rem 0', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                Historial de Alertas (Mensual)
              </h3>
              {loadingAlertas ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', padding: '1rem', textAlign: 'center' }}>Cargando alertas...</div>
              ) : alertasPaciente.length === 0 ? (
                <div style={{ color: 'var(--normal-color)', fontSize: '0.8rem', fontWeight: 600, padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.15)', textAlign: 'center' }}>
                  ✓ No hay alertas registradas para el paciente.
                </div>
              ) : (
                <div className="alerts-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1, maxHeight: '250px' }}>
                  {alertasPaciente.map((a) => (
                    <div key={a.id} className="alert-item-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.01)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <ShieldAlert size={13} style={{ color: a.severidad === 'CRITICO' ? 'var(--critico-color)' : 'var(--advertencia-color)', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                            {a.mensaje}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginLeft: '1.15rem' }}>
                          Cód: {a.codigo} | {a.fecha ? new Date(a.fecha).toLocaleTimeString() : 'N/A'}
                        </span>
                      </div>
                      <div style={{ flexShrink: 0 }}>
                        {a.atendida ? (
                          <span className="badge-status active" style={{ padding: '3px 8px', fontSize: '0.68rem', fontWeight: 700 }}>Atendida</span>
                        ) : (
                          <button
                            className="action-btn-atender"
                            onClick={() => setEvaluandoAlerta(a)}
                            style={{ padding: '4px 10px', background: 'var(--critico-color)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                          >
                            Atender
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Modal de Formulario de Evaluación Médica Superpuesto (CU-07) */}
        {evaluandoAlerta && (
          <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1.5rem' }}>
            <div className="modal-content" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
              
              {/* Botón de cerrar de la evaluación */}
              <button className="modal-close" onClick={() => setEvaluandoAlerta(null)} title="Cancelar">
                <X size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', paddingRight: '2rem' }}>
                <FileSpreadsheet size={18} style={{ color: 'var(--critico-color)' }} />
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Evaluación Médica (Alerta {evaluandoAlerta.codigo})
                </h4>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.08)', borderLeft: '3px solid #ef4444', padding: '0.75rem', borderRadius: '4px', fontSize: '0.75rem', color: '#ef4444', marginBottom: '1rem', lineHeight: '1.3' }}>
                <strong>Trazabilidad Legal:</strong> La evaluación registrada formará parte del expediente médico-legal de la atención del paciente.
              </div>

              <form onSubmit={handleSubmetAtencion} style={{ display: 'flex', flexDirection: 'column', gap: '0.88rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Diagnóstico / Resumen Clínico *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ej. Paciente estable con taquicardia transitoria. Se verifica buena perfusión distal..."
                    value={resumenClinico}
                    onChange={(e) => setResumenClinico(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.8rem', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Recomendaciones y Tratamiento *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Ej. Reposo absoluto por 30 minutos. Controlar presión arterial cada 6 horas..."
                    value={recomendacionesClinicas}
                    onChange={(e) => setRecomendacionesClinicas(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.8rem', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setEvaluandoAlerta(null)} style={{ padding: '0.45rem 1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>
                    Cancelar
                  </button>
                   <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    style={{ 
                      padding: '0.45rem 1rem', 
                      background: isSubmitting ? 'var(--text-secondary)' : 'var(--critico-color)', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '6px', 
                      fontSize: '0.78rem', 
                      cursor: isSubmitting ? 'not-allowed' : 'pointer', 
                      fontWeight: 700 
                    }}
                  >
                    {isSubmitting ? 'Registrando...' : 'Guardar y Registrar Atención'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
