// RegistrarPacienteModal.tsx
import { useState, useEffect } from 'react';
import { X, UserPlus, Check, AlertCircle, Phone, MapPin, Calendar, Stethoscope } from 'lucide-react';

interface RegistrarPacienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

interface Medico {
  id: string;
  codigo: string;
  nombre: string;
  apellido: string;
  especialidad: string | { nombre: string };
}

interface FormData {
  dni: string;
  nombres: string;
  edad: string;
  diagnostico: string;
  medicoAsignadoId: string;
  telefono: string;
  direccion: string;
}

export function RegistrarPacienteModal({ isOpen, onClose, onSuccess, token }: RegistrarPacienteModalProps) {
  const [formData, setFormData] = useState<FormData>({
    dni: '',
    nombres: '',
    edad: '',
    diagnostico: '',
    medicoAsignadoId: '',
    telefono: '',
    direccion: ''
  });
  
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMedicos, setLoadingMedicos] = useState(false);
  const [error, setError] = useState('');

  // Cargar lista de médicos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      cargarMedicos();
    }
  }, [isOpen]);

  const cargarMedicos = async () => {
    setLoadingMedicos(true);
    try {
      const response = await fetch('http://localhost:3000/api/personal', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar médicos');
      }
      
      const data = await response.json();
      // Filtrar solo médicos activos
      const medicosActivos = data.filter((user: any) => 
        user.rol.nombre === 'MEDICO' && user.activo === true
      );
      setMedicos(medicosActivos);
    } catch (err: any) {
      console.error('Error cargando médicos:', err);
      setError('No se pudieron cargar los médicos disponibles');
    } finally {
      setLoadingMedicos(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!/^\d{8}$/.test(formData.dni)) {
      setError('DNI inválido. Debe contener exactamente 8 dígitos.');
      return false;
    }
    if (!formData.nombres || formData.nombres.length < 2) {
      setError('El nombre del paciente es inválido. Mínimo 2 caracteres.');
      return false;
    }
    const edad = parseInt(formData.edad);
    if (isNaN(edad) || edad < 0 || edad > 120) {
      setError('Edad inválida. Debe estar entre 0 y 120 años.');
      return false;
    }
    if (!formData.diagnostico || formData.diagnostico.length < 3) {
      setError('El diagnóstico debe tener al menos 3 caracteres.');
      return false;
    }
    if (!formData.medicoAsignadoId) {
      setError('Debe seleccionar un médico asignado.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const submitData = {
        dni: formData.dni,
        nombres: formData.nombres,
        edad: parseInt(formData.edad),
        diagnostico: formData.diagnostico,
        medicoAsignadoId: formData.medicoAsignadoId,
        telefono: formData.telefono || undefined,
        direccion: formData.direccion || undefined
      };

      const response = await fetch('http://localhost:3000/api/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar paciente');
      }

      onSuccess();
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      dni: '',
      nombres: '',
      edad: '',
      diagnostico: '',
      medicoAsignadoId: '',
      telefono: '',
      direccion: ''
    });
    setError('');
  };

  const getNombreMedico = (medico: Medico) => {
    const especialidadStr = typeof medico.especialidad === 'object' 
      ? medico.especialidad.nombre 
      : medico.especialidad || '';
    return `${medico.nombre} ${medico.apellido}${especialidadStr ? ` - ${especialidadStr}` : ''}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <UserPlus size={24} style={{ color: 'var(--accent-color)' }} />
            <h2>Registrar Nuevo Paciente</h2>
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

            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">DNI *</label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder=""
                  maxLength={8}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Edad *</label>
                <div className="input-icon-wrapper">
                  <Calendar size={18} className="input-icon" />
                  <input
                    type="number"
                    name="edad"
                    value={formData.edad}
                    onChange={handleChange}
                    placeholder=""
                    min="0"
                    max="120"
                    className="form-input with-icon"
                    required
                  />
                </div>
              </div>

              <div className="form-field full-width">
                <label className="form-label">Nombres Completos *</label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  placeholder=""
                  className="form-input"
                  required
                />
              </div>

              <div className="form-field full-width">
                <label className="form-label">Diagnóstico *</label>
                <textarea
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleChange}
                  placeholder=""
                  className="form-textarea"
                  rows={3}
                  required
                />
              </div>

              <div className="form-field full-width">
                <label className="form-label">Médico Asignado *</label>
                <div className="input-icon-wrapper">
                  <Stethoscope size={18} className="input-icon" />
                  <select
                    name="medicoAsignadoId"
                    value={formData.medicoAsignadoId}
                    onChange={handleChange}
                    className="form-select with-icon"
                    required
                    disabled={loadingMedicos}
                  >
                    <option value="">Seleccionar médico</option>
                    {medicos.map((medico) => (
                      <option key={medico.id} value={medico.id}>
                        {getNombreMedico(medico)}
                      </option>
                    ))}
                  </select>
                </div>
                {loadingMedicos && (
                  <small style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Cargando médicos...
                  </small>
                )}
                {medicos.length === 0 && !loadingMedicos && (
                  <small style={{ fontSize: '0.7rem', color: '#ef4444' }}>
                    No hay médicos disponibles. Contacte al administrador.
                  </small>
                )}
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
                    placeholder=""
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
                    placeholder=""
                    className="form-input with-icon"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Registrando...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Registrar Paciente
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
            max-width: 700px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
          }

          [data-theme="light"] .modal-container {
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          }

          [data-theme="light"] .modal-title h2 {
            color: #1a1a2e;
          }

          [data-theme="light"] .form-label {
            color: #4b5563;
          }

          [data-theme="light"] .form-input,
          [data-theme="light"] .form-select,
          [data-theme="light"] .form-textarea {
            background: rgba(0, 0, 0, 0.03);
            border-color: #e5e7eb;
            color: #1a1a2e;
          }

          [data-theme="light"] .form-input:focus,
          [data-theme="light"] .form-select:focus,
          [data-theme="light"] .form-textarea:focus {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.02);
          }

          [data-theme="light"] .form-input::placeholder {
            color: #9ca3af;
          }

          [data-theme="light"] .btn-cancel {
            border-color: #e5e7eb;
            color: #6b7280;
          }

          [data-theme="light"] .btn-cancel:hover {
            background: rgba(0, 0, 0, 0.05);
          }

          [data-theme="light"] .modal-close {
            color: #6b7280;
          }

          [data-theme="light"] .modal-close:hover {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
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

          .form-input.with-icon,
          .form-select.with-icon {
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

/* Estilos específicos para selects */
.form-select {
  padding: 0.75rem 1rem;
  background-color: #2d2d3f;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.2s;
  cursor: pointer;
}

.form-select option {
  background-color: #2d2d3f;
  color: #ffffff;
}

/* Modo claro para selects */
[data-theme="light"] .form-select {
  background-color: #ffffff;
  color: #1a1a2e;
  border-color: #e5e7eb;
}

[data-theme="light"] .form-select option {
  background-color: #ffffff;
  color: #1a1a2e;
}

          .form-input:focus,
          .form-select:focus,
          .form-textarea:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .form-textarea {
            resize: vertical;
            min-height: 80px;
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
            border-color: var(--text-secondary);
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

          small {
            display: block;
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
            .form-grid {
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