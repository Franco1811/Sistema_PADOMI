import { X } from 'lucide-react';
import type { Metrica } from '../../services/metricas.service';

interface GestionarFichaModalProps {
  selectedPaciente: any | null;
  setSelectedPaciente: (p: any | null) => void;
  setIsEditingFicha: (v: boolean) => void;
  editTelefono: string;
  setEditTelefono: (v: string) => void;
  editDireccion: string;
  setEditDireccion: (v: string) => void;
  editUmbrales: any[];
  setEditUmbrales: React.Dispatch<React.SetStateAction<any[]>>;
  catalogoMetricas: Metrica[];
  nuevaMetricaId: string;
  nuevaMetricaMin: string;
  nuevaMetricaMax: string;
  handleSelectMetrica: (metricaId: string) => void;
  setNuevaMetricaMin: (v: string) => void;
  setNuevaMetricaMax: (v: string) => void;
  agregarNuevaMetrica: () => void;
  mostrarConfirmacion: (titulo: string, mensaje: string, onConfirm: () => void) => void;
  guardarCambiosFicha: () => Promise<void>;
  isSavingFicha: boolean;
}

export function GestionarFichaModal({
  selectedPaciente,
  setSelectedPaciente,
  setIsEditingFicha,
  editTelefono,
  setEditTelefono,
  editDireccion,
  setEditDireccion,
  editUmbrales,
  setEditUmbrales,
  catalogoMetricas,
  nuevaMetricaId,
  nuevaMetricaMin,
  nuevaMetricaMax,
  handleSelectMetrica,
  setNuevaMetricaMin,
  setNuevaMetricaMax,
  agregarNuevaMetrica,
  mostrarConfirmacion,
  guardarCambiosFicha,
  isSavingFicha
}: GestionarFichaModalProps) {
  if (!selectedPaciente) return null;

  return (
    <div className="modal-overlay" onClick={() => setSelectedPaciente(null)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '100%' }}>
        
        <button className="modal-close" onClick={() => setSelectedPaciente(null)} title="Cerrar">
          <X size={18} />
        </button>

        {/* Encabezado del Modal */}
        <div className="modal-header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', paddingRight: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Gestionar Ficha del Paciente
            </h2>
          </div>
        </div>

        {/* Resumen del Paciente */}
        <div className="modal-patient-summary" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{selectedPaciente.paciente.nombres}</h3>
            <div className="patient-meta-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 1.25rem', fontSize: '0.8.5rem', color: 'var(--text-secondary)' }}>
              <span>DNI: <strong style={{ color: 'var(--text-primary)' }}>{selectedPaciente.paciente.dni}</strong></span>
              <span>Código: <strong style={{ color: 'var(--text-primary)' }}>{selectedPaciente.paciente.codigo}</strong></span>
              <span>Edad: <strong style={{ color: 'var(--text-primary)' }}>{selectedPaciente.paciente.edad} años</strong></span>
            </div>
          </div>
        </div>

        {/* Cuerpo del Formulario de Edición */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', width: '100%', textAlign: 'left' }}>

          {/* Columna Izquierda: Datos y Umbrales actuales */}
          <div style={{ flex: '1.2 1 400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Caja 1: Datos de Contacto */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '14px' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--essalud-azul)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Datos de Contacto y Despacho
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Teléfono Móvil / Fijo
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editTelefono}
                    onChange={(e) => setEditTelefono(e.target.value)}
                    placeholder="Ej. 987654321"
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Dirección de Despacho Ambulatorio
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={editDireccion}
                    onChange={(e) => setEditDireccion(e.target.value)}
                    placeholder="Av. Las Magnolias 123, Lince"
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Caja 2: Umbrales Asignados */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Umbrales Clínicos de Alerta
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', flex: 1 }}>
                {editUmbrales.length === 0 ? (
                  <p style={{ margin: 'auto 0', fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem 1rem', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                    No hay métricas asignadas a este paciente. Utilice la sección lateral para añadir una.
                  </p>
                ) : (
                  editUmbrales.map((u, index) => {
                    const met = catalogoMetricas.find(m => m.id === u.metricaId);
                    return (
                      <div key={u.metricaId || index} className="umbral-edit-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: '150px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {u.metrica?.nombre || met?.nombre || 'Métrica'}
                          </span>
                          {met && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                              Límite normal: {met.rangoMin} - {met.rangoMax} {met.unidad}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Mín:</span>
                          <input
                            type="number"
                            step="any"
                            className="form-input-number"
                            value={u.valorMin}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditUmbrales(prev => prev.map((item, idx) => idx === index ? { ...item, valorMin: val } : item));
                            }}
                            style={{ width: '68px', padding: '0.3rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.8rem', textAlign: 'center' }}
                          />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Máx:</span>
                          <input
                            type="number"
                            step="any"
                            className="form-input-number"
                            value={u.valorMax}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditUmbrales(prev => prev.map((item, idx) => idx === index ? { ...item, valorMax: val } : item));
                            }}
                            style={{ width: '68px', padding: '0.3rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.8rem', textAlign: 'center' }}
                          />
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', minWidth: '30px' }}>
                            {u.metrica?.unidad || met?.unidad || ''}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const nombre = u.metrica?.nombre || met?.nombre || 'esta métrica';
                              mostrarConfirmacion(
                                'Quitar Métrica',
                                `¿Está seguro de que desea quitar el umbral de "${nombre}" del paciente? Este cambio se aplicará al guardar la ficha.`,
                                () => setEditUmbrales(prev => prev.filter((_, idx) => idx !== index))
                              );
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--critico-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px', transition: 'background 0.2s' }}
                            title="Quitar métrica"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Columna Derecha: Asignar nueva métrica y Botones de Guardar/Cancelar */}
          <div style={{ flex: '0.8 1 300px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Caja 3: Asignar Nueva Métrica */}
            <div className="add-new-umbral-section" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '14px' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--essalud-azul)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                + Asignar Nueva Métrica
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                    Seleccionar Métrica
                  </label>
                  <select
                    value={nuevaMetricaId}
                    onChange={(e) => handleSelectMetrica(e.target.value)}
                    style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.85rem', width: '100%', cursor: 'pointer' }}
                  >
                    <option value="">-- Seleccionar Métrica --</option>
                    {catalogoMetricas
                      .filter(m => !editUmbrales.some(u => u.metricaId === m.id))
                      .map(m => (
                        <option key={m.id} value={m.id}>{m.nombre} ({m.unidad})</option>
                      ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Umbral Mínimo
                    </label>
                    <input
                      type="number"
                      placeholder="Mín"
                      value={nuevaMetricaMin}
                      onChange={(e) => setNuevaMetricaMin(e.target.value)}
                      style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.85rem', textAlign: 'center', width: '100%' }}
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                      Umbral Máximo
                    </label>
                    <input
                      type="number"
                      placeholder="Máx"
                      value={nuevaMetricaMax}
                      onChange={(e) => setNuevaMetricaMax(e.target.value)}
                      style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.85rem', textAlign: 'center', width: '100%' }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={agregarNuevaMetrica}
                  style={{ padding: '0.65rem 1rem', background: 'var(--essalud-azul)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s', marginTop: '0.5rem', width: '100%' }}
                >
                  Añadir Métrica
                </button>
              </div>

              {nuevaMetricaId && (
                <div style={{ marginTop: '0.85rem', fontSize: '0.72rem', color: 'var(--essalud-azul)', fontWeight: 600, background: 'rgba(59, 130, 246, 0.05)', padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                  ✓ Límite biológico normal estándar: {catalogoMetricas.find(m => m.id === nuevaMetricaId)?.rangoMin} a {catalogoMetricas.find(m => m.id === nuevaMetricaId)?.rangoMax} {catalogoMetricas.find(m => m.id === nuevaMetricaId)?.unidad}.
                  <span style={{ display: 'block', fontWeight: 400, color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Los valores personalizados introducidos deben estar obligatoriamente dentro de este rango estándar.
                  </span>
                </div>
              )}
            </div>

            {/* Caja 4: Botones de Acción del Formulario */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '14px' }}>
              <button
                type="button"
                onClick={() => mostrarConfirmacion(
                  'Guardar Ficha del Paciente',
                  `¿Confirma que desea guardar los cambios en la ficha de ${selectedPaciente?.paciente?.nombres}? Se actualizarán el contacto y los umbrales clínicos en la base de datos.`,
                  guardarCambiosFicha
                )}
                disabled={isSavingFicha}
                style={{ padding: '0.75rem 1.5rem', background: isSavingFicha ? 'var(--text-secondary)' : 'var(--essalud-azul)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: isSavingFicha ? 'not-allowed' : 'pointer', transition: 'all 0.2s', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isSavingFicha ? (
                  <>
                    <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    Guardando...
                  </>
                ) : 'Guardar Ficha Paciente'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingFicha(false)}
                style={{ padding: '0.7rem 1.25rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', width: '100%' }}
              >
                Cancelar Edición
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
