import { useState, useEffect } from 'react';
import { X, Activity, Check, AlertCircle } from 'lucide-react';

interface EditarMetricaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
  metricaData: {
    id: string;
    nombre: string;
    unidad: string;
    descripcion: string;
    rangoMin: number;
    rangoMax: number;
  } | null;
}

interface FormData {
  nombre: string;
  unidad: string;
  descripcion: string;
  rangoMin: string;
  rangoMax: string;
}

export function EditarMetricaModal({ isOpen, onClose, onSuccess, token, metricaData }: EditarMetricaModalProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    unidad: '',
    descripcion: '',
    rangoMin: '',
    rangoMax: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (metricaData && isOpen) {
      setFormData({
        nombre: metricaData.nombre,
        unidad: metricaData.unidad,
        descripcion: metricaData.descripcion || '',
        rangoMin: metricaData.rangoMin.toString(),
        rangoMax: metricaData.rangoMax.toString()
      });
      setError('');
    }
  }, [metricaData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.nombre || formData.nombre.length < 2) {
      setError('El nombre de la métrica debe tener al menos 2 caracteres.');
      return false;
    }
    if (!formData.unidad || formData.unidad.length < 1) {
      setError('La unidad de medida es requerida.');
      return false;
    }
    const rangoMin = parseFloat(formData.rangoMin);
    const rangoMax = parseFloat(formData.rangoMax);
    
    if (isNaN(rangoMin)) {
      setError('El límite mínimo debe ser un número válido.');
      return false;
    }
    if (isNaN(rangoMax)) {
      setError('El límite máximo debe ser un número válido.');
      return false;
    }
    if (rangoMin < 0) {
      setError('El límite mínimo debe ser un valor positivo.');
      return false;
    }
    if (rangoMax <= rangoMin) {
      setError('El límite máximo debe ser mayor que el límite mínimo.');
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
      const updateData = {
        nombre: formData.nombre,
        unidad: formData.unidad,
        descripcion: formData.descripcion,
        rangoMin: parseFloat(formData.rangoMin),
        rangoMax: parseFloat(formData.rangoMax)
      };

        const response = await fetch(`http://localhost:3000/api/metricas/${metricaData?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la métrica');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !metricaData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Activity size={24} style={{ color: 'var(--accent-color)' }} />
            <h2>Editar Métrica Clínica</h2>
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
              <div className="form-field full-width">
                <label className="form-label">Nombre de la Métrica *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Presión Arterial, Frecuencia Cardíaca, Glucosa"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Unidad de Medida *</label>
                <input
                  type="text"
                  name="unidad"
                  value={formData.unidad}
                  onChange={handleChange}
                  placeholder="Ej: mmHg, lpm, mg/dL"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Límite Normal Mínimo *</label>
                <input
                  type="number"
                  name="rangoMin"
                  value={formData.rangoMin}
                  onChange={handleChange}
                  className="form-input"
                  required
                  step="any"
                />
              </div>

              <div className="form-field">
                <label className="form-label">Límite Normal Máximo *</label>
                <input
                  type="number"
                  name="rangoMax"
                  value={formData.rangoMax}
                  onChange={handleChange}
                  className="form-input"
                  required
                  step="any"
                />
              </div>

              <div className="form-field full-width">
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción detallada de la métrica y su interpretación clínica..."
                  className="form-textarea"
                  rows={4}
                />
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
                  Actualizando...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Actualizar Métrica
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
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.15s ease-out;
          }

          .modal-container {
            background: rgba(30, 30, 46, 0.98);
            border-radius: 20px;
            width: 90%;
            max-width: 700px;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.2s ease-out;
          }

          [data-theme="light"] .modal-container {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          }

          [data-theme="light"] .modal-title h2 {
            color: #1a1a2e;
          }

          [data-theme="light"] .form-label {
            color: #4b5563;
          }

          [data-theme="light"] .form-input,
          [data-theme="light"] .form-textarea {
            background: rgba(0, 0, 0, 0.03);
            border-color: #e5e7eb;
            color: #1a1a2e;
          }

          [data-theme="light"] .btn-cancel {
            border-color: #e5e7eb;
            color: #6b7280;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid var(--border-color);
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
            border-top: 1px solid var(--border-color);
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

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(15px);
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