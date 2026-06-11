// EditarPacienteModal.tsx
import { useState, useEffect } from 'react';
import { X, User, Check, AlertCircle, Phone, MapPin, Stethoscope, Activity, Save } from 'lucide-react';

interface EditarPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
  pacienteId: string | null;
}

interface PacienteData {
  id: string;
  codigo: string;
  dni: string;
  nombres: string;
  edad: number;
  diagnostico: string;
  telefono: string;
  direccion: string;
  medicoAsignadoId: string;
  medicoNombre?: string;
}

interface Metrica {
  id: string;
  codigo: string;
  nombre: string;
  unidad: string;
  rangoMin: number;
  rangoMax: number;
}

interface Umbral {
  metricaId: string;
  metricaNombre?: string;
  valorMin: number;
  valorMax: number;
}

interface FormData {
  diagnostico: string;
  telefono: string;
  direccion: string;
  umbrales: Umbral[];
}

export function EditarPacienteModal({ isOpen, onClose, onSuccess, token, pacienteId }: EditarPacienteModalProps) {
  const [paciente, setPaciente] = useState<PacienteData | null>(null);
  const [metricas, setMetricas] = useState<Metrica[]>([]);
  const [umbralesActuales, setUmbralesActuales] = useState<Umbral[]>([]);
  const [formData, setFormData] = useState<FormData>({
    diagnostico: '',
    telefono: '',
    direccion: '',
    umbrales: []
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar datos del paciente y métricas
  useEffect(() => {
    if (isOpen && pacienteId) {
      cargarDatos();
    }
  }, [isOpen, pacienteId]);

  const cargarDatos = async () => {
    setLoadingData(true);
    setError('');
    try {
      // Cargar datos del paciente
      const pacienteResponse = await fetch(`http://localhost:3000/api/pacientes/perfil/${pacienteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!pacienteResponse.ok) {
        throw new Error('Error al cargar datos del paciente');
      }

      const pacienteData = await pacienteResponse.json();
      const pacienteInfo = pacienteData.paciente;
      
      // Obtener nombre del médico asignado
      let medicoNombre = '';
      try {
        const medicoResponse = await fetch(`http://localhost:3000/api/personal/${pacienteInfo.medicoAsignadoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (medicoResponse.ok) {
          const medicoData = await medicoResponse.json();
          medicoNombre = `${medicoData.nombre} ${medicoData.apellido}`;
        }
      } catch (e) {
        console.error('Error cargando médico:', e);
      }

      setPaciente({
        ...pacienteInfo,
        medicoNombre
      });

      // Cargar todas las métricas disponibles
      const metricasResponse = await fetch('http://localhost:3000/api/metricas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!metricasResponse.ok) {
        throw new Error('Error al cargar métricas');
      }

      const metricasData = await metricasResponse.json();
      setMetricas(metricasData);

      // Cargar umbrales actuales del paciente
      const umbralesExistentes = pacienteData.umbrales || [];
      const umbralesFormateados = umbralesExistentes.map((u: any) => {
        const metrica = metricasData.find((m: Metrica) => m.id === u.metricaId);
        return {
          metricaId: u.metricaId,
          metricaNombre: metrica?.nombre || 'Métrica no encontrada',
          valorMin: u.valorMin,
          valorMax: u.valorMax
        };
      });

      setUmbralesActuales(umbralesFormateados);

      // Llenar formulario
      setFormData({
        diagnostico: pacienteInfo.diagnostico || '',
        telefono: pacienteInfo.telefono || '',
        direccion: pacienteInfo.direccion || '',
        umbrales: umbralesFormateados
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleUmbralChange = (metricaId: string, field: 'valorMin' | 'valorMax', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setFormData(prev => ({
      ...prev,
      umbrales: prev.umbrales.map(u => 
        u.metricaId === metricaId 
          ? { ...u, [field]: numValue }
          : u
      )
    }));
    setError('');
  };

  const agregarUmbral = () => {
    const metricasSinUmbral = metricas.filter(
      m => !formData.umbrales.some(u => u.metricaId === m.id)
    );
    
    if (metricasSinUmbral.length === 0) {
      setError('Todas las métricas ya tienen umbrales configurados');
      return;
    }

    const nuevaMetrica = metricasSinUmbral[0];
    setFormData(prev => ({
      ...prev,
      umbrales: [
        ...prev.umbrales,
        {
          metricaId: nuevaMetrica.id,
          metricaNombre: nuevaMetrica.nombre,
          valorMin: nuevaMetrica.rangoMin,
          valorMax: nuevaMetrica.rangoMax
        }
      ]
    }));
  };

  const eliminarUmbral = (metricaId: string) => {
    setFormData(prev => ({
      ...prev,
      umbrales: prev.umbrales.filter(u => u.metricaId !== metricaId)
    }));
  };

  const validateForm = (): boolean => {
    if (formData.diagnostico && formData.diagnostico.trim().length < 3) {
      setError('El diagnóstico debe tener al menos 3 caracteres.');
      return false;
    }

    // Validar umbrales
    const metricasIds = new Set<string>();
    for (const u of formData.umbrales) {
      if (metricasIds.has(u.metricaId)) {
        setError('No se permiten métricas duplicadas en los umbrales.');
        return false;
      }
      metricasIds.add(u.metricaId);

      const metrica = metricas.find(m => m.id === u.metricaId);
      if (metrica) {
        if (u.valorMin < metrica.rangoMin || u.valorMax > metrica.rangoMax) {
          setError(`Los valores para "${metrica.nombre}" deben estar dentro del rango permitido (${metrica.rangoMin} - ${metrica.rangoMax}).`);
          return false;
        }
      }

      if (u.valorMin < 0) {
        setError('El valor mínimo debe ser positivo.');
        return false;
      }
      if (u.valorMax <= u.valorMin) {
        setError('El valor máximo debe ser mayor al mínimo.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData: any = {};

      if (formData.diagnostico !== paciente?.diagnostico) {
        updateData.diagnostico = formData.diagnostico;
      }
      if (formData.telefono !== paciente?.telefono) {
        updateData.telefono = formData.telefono;
      }
      if (formData.direccion !== paciente?.direccion) {
        updateData.direccion = formData.direccion;
      }

      // Comparar umbrales actuales con los nuevos
      const umbralesModificados = formData.umbrales.filter(u => {
        const actual = umbralesActuales.find(a => a.metricaId === u.metricaId);
        return !actual || actual.valorMin !== u.valorMin || actual.valorMax !== u.valorMax;
      });

      if (umbralesModificados.length > 0 || formData.umbrales.length !== umbralesActuales.length) {
        updateData.umbrales = formData.umbrales.map(u => ({
          metricaId: u.metricaId,
          valorMin: u.valorMin,
          valorMax: u.valorMax
        }));
      }

      if (Object.keys(updateData).length === 0) {
        setSuccess('No se detectaron cambios para actualizar.');
        setTimeout(() => setSuccess(''), 3000);
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/api/pacientes/perfil/${pacienteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el perfil del paciente');
      }

      setSuccess('Perfil actualizado correctamente');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !pacienteId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <User size={24} style={{ color: 'var(--accent-color)' }} />
            <h2>Editar Perfil de Paciente</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div className="error-message">
                <AlertCircle size={18} />
                {error}
              </div>
            )}
            {success && (
              <div className="success-message">
                <Check size={18} />
                {success}
              </div>
            )}

            {loadingData ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Cargando datos del paciente...</div>
            ) : (
              <>
                {/* Información del paciente (solo lectura) */}
                <div className="info-section">
                  <h3>Información del Paciente</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Código:</label>
                      <span>{paciente?.codigo}</span>
                    </div>
                    <div className="info-item">
                      <label>DNI:</label>
                      <span>{paciente?.dni}</span>
                    </div>
                    <div className="info-item">
                      <label>Nombres:</label>
                      <span>{paciente?.nombres}</span>
                    </div>
                    <div className="info-item">
                      <label>Edad:</label>
                      <span>{paciente?.edad} años</span>
                    </div>
                    <div className="info-item">
                      <label>Médico Asignado:</label>
                      <span>{paciente?.medicoNombre || 'No asignado'}</span>
                    </div>
                  </div>
                </div>

                <div className="form-divider"></div>

                {/* Formulario de edición */}
                <div className="form-grid">
                  <div className="form-field full-width">
                    <label className="form-label">Diagnóstico</label>
                    <textarea
                      name="diagnostico"
                      value={formData.diagnostico}
                      onChange={handleChange}
                      placeholder="Diagnóstico médico del paciente"
                      className="form-textarea"
                      rows={3}
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Teléfono</label>
                    <div className="input-icon-wrapper">
                      <Phone size={18} className="input-icon" />
                      <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="987654321"
                        className="form-input with-icon"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Dirección</label>
                    <div className="input-icon-wrapper">
                      <MapPin size={18} className="input-icon" />
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        placeholder="Av. Principal 123, Lima"
                        className="form-input with-icon"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-divider"></div>

                {/* Umbrales Personalizados */}
                <div className="umbrales-section">
                  <div className="umbrales-header">
                    <h3>Umbrales Personalizados</h3>
                    <button
                      type="button"
                      onClick={agregarUmbral}
                      className="btn-add-umbral"
                    >
                      <Activity size={16} /> Agregar Umbral
                    </button>
                  </div>

                  {formData.umbrales.length === 0 ? (
                    <div className="empty-umbrales">
                      <p>No hay umbrales configurados.</p>
                      <button type="button" onClick={agregarUmbral} className="btn-add-umbral-empty">
                        Agregar primer umbral
                      </button>
                    </div>
                  ) : (
                    <div className="umbrales-list">
                      {formData.umbrales.map((umbral) => {
                        const metrica = metricas.find(m => m.id === umbral.metricaId);
                        return (
                          <div key={umbral.metricaId} className="umbral-card">
                            <div className="umbral-header">
                              <div className="umbral-title">
                                <Stethoscope size={16} />
                                <strong>{umbral.metricaNombre || metrica?.nombre}</strong>
                                <span className="umbral-unidad">{metrica?.unidad}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => eliminarUmbral(umbral.metricaId)}
                                className="btn-remove-umbral"
                                title="Eliminar umbral"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            <div className="umbral-inputs">
                              <div className="umbral-input">
                                <label>Valor Mínimo</label>
                                <input
                                  type="number"
                                  value={umbral.valorMin}
                                  onChange={(e) => handleUmbralChange(umbral.metricaId, 'valorMin', e.target.value)}
                                  step="any"
                                  className="form-input-small"
                                />
                                {metrica && (
                                  <span className="umbral-hint">Rango permitido: {metrica.rangoMin} - {metrica.rangoMax}</span>
                                )}
                              </div>
                              <div className="umbral-input">
                                <label>Valor Máximo</label>
                                <input
                                  type="number"
                                  value={umbral.valorMax}
                                  onChange={(e) => handleUmbralChange(umbral.metricaId, 'valorMax', e.target.value)}
                                  step="any"
                                  className="form-input-small"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading || loadingData}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>

        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.2s ease;
          }

          .modal-container {
            background: rgba(30, 30, 46, 0.95);
            border-radius: 20px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
          }

          [data-theme="light"] .modal-container {
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            background: transparent;
            position: sticky;
            top: 0;
            z-index: 1;
          }

          .modal-title {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .modal-title h2 {
            margin: 0;
            font-size: 1.4rem;
            color: var(--text-primary);
          }

          .modal-close {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 8px;
            transition: all 0.2s;
            display: flex;
            align-items: center;
          }

          .modal-close:hover {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
          }

          .modal-body {
            padding: 2rem;
            background: transparent;
          }

          .info-section {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 16px;
            padding: 1rem 1.5rem;
            margin-bottom: 1.5rem;
          }

          [data-theme="light"] .info-section {
            background: rgba(0, 0, 0, 0.03);
          }

          .info-section h3 {
            margin: 0 0 1rem 0;
            font-size: 1rem;
            color: var(--accent-color);
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
          }

          .info-item {
            display: flex;
            gap: 0.5rem;
            font-size: 0.85rem;
          }

          .info-item label {
            font-weight: 600;
            color: var(--text-secondary);
          }

          .info-item span {
            color: var(--text-primary);
          }

          .form-divider {
            height: 1px;
            background: var(--border-color);
            margin: 1.5rem 0;
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
          }

          .form-field {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .form-field.full-width {
            grid-column: 1 / -1;
          }

          .form-label {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-secondary);
            letter-spacing: 0.5px;
          }

          .input-icon-wrapper {
            position: relative;
          }

          .input-icon {
            position: absolute;
            left: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            pointer-events: none;
          }

          .form-input.with-icon {
            padding-left: 2.5rem;
          }

          .form-input,
          .form-textarea {
            padding: 0.75rem 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            color: var(--text-primary);
            font-size: 0.9rem;
            transition: all 0.2s;
            font-family: inherit;
          }

          .form-input:focus,
          .form-textarea:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .form-textarea {
            resize: vertical;
            min-height: 80px;
          }

          .umbrales-section {
            margin-top: 1.5rem;
          }

          .umbrales-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .umbrales-header h3 {
            margin: 0;
            font-size: 1rem;
            color: var(--accent-color);
          }

          .btn-add-umbral {
            background: transparent;
            border: 1px solid var(--accent-color);
            padding: 0.4rem 0.8rem;
            border-radius: 8px;
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--accent-color);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.3rem;
            transition: all 0.2s;
          }

          .btn-add-umbral:hover {
            background: rgba(59, 130, 246, 0.1);
          }

          .umbrales-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .umbral-card {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 1rem;
            border: 1px solid var(--border-color);
          }

          [data-theme="light"] .umbral-card {
            background: rgba(0, 0, 0, 0.02);
          }

          .umbral-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.75rem;
          }

          .umbral-title {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
          }

          .umbral-unidad {
            font-size: 0.75rem;
            color: var(--text-secondary);
            background: rgba(255, 255, 255, 0.05);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
          }

          .btn-remove-umbral {
            background: transparent;
            border: none;
            color: #ef4444;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            display: flex;
            align-items: center;
            transition: all 0.2s;
          }

          .btn-remove-umbral:hover {
            background: rgba(239, 68, 68, 0.1);
          }

          .umbral-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }

          .umbral-input {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }

          .umbral-input label {
            font-size: 0.7rem;
            color: var(--text-secondary);
          }

          .form-input-small {
            padding: 0.5rem 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-primary);
            font-size: 0.85rem;
          }

          .umbral-hint {
            font-size: 0.65rem;
            color: var(--text-secondary);
          }

          .empty-umbrales {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            border: 1px dashed var(--border-color);
          }

          .empty-umbrales p {
            margin: 0 0 1rem 0;
            color: var(--text-secondary);
          }

          .btn-add-umbral-empty {
            background: var(--accent-color);
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 600;
            color: white;
            cursor: pointer;
          }

          .error-message {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid #ef4444;
            color: #ef4444;
            padding: 0.75rem 1rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
          }

          .success-message {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(16, 185, 129, 0.15);
            border: 1px solid #10b981;
            color: #10b981;
            padding: 0.75rem 1rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
            font-size: 0.875rem;
          }

          .modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            padding: 1.5rem 2rem;
            background: transparent;
            position: sticky;
            bottom: 0;
          }

          .btn-cancel,
          .btn-submit {
            padding: 0.75rem 1.5rem;
            border-radius: 10px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .btn-cancel {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
          }

          .btn-cancel:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          .btn-submit {
            background: var(--accent-color);
            border: none;
            color: white;
          }

          .btn-submit:hover:not(:disabled) {
            background: #2563eb;
            transform: translateY(-1px);
          }

          .btn-submit:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          @media (max-width: 640px) {
            .form-grid,
            .umbral-inputs,
            .info-grid {
              grid-template-columns: 1fr;
              gap: 1rem;
            }
            
            .modal-body,
            .modal-header,
            .modal-footer {
              padding: 1.5rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
}