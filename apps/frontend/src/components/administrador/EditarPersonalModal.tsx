import { useState, useEffect } from 'react';
import { X, User, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface EditarPersonalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
  personalData: {
    id: string;
    dni: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: any; // Puede ser string u objeto
    especialidad?: string | any;
    activo: boolean;
  } | null;
}

interface FormData {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'MEDICO' | 'ADMIN';
  especialidad: string;
  password: string;
  confirmPassword: string;
  cambiarPassword: boolean;
}

export function EditarPersonalModal({ isOpen, onClose, onSuccess, token, personalData }: EditarPersonalModalProps) {
  const [formData, setFormData] = useState<FormData>({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    rol: 'MEDICO',
    especialidad: '',
    password: '',
    confirmPassword: '',
    cambiarPassword: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Función para extraer el rol como string
  const getRolString = (rol: any): 'MEDICO' | 'ADMIN' => {
    if (typeof rol === 'string') {
      return rol === 'ADMIN' ? 'ADMIN' : 'MEDICO';
    }
    if (rol && typeof rol === 'object') {
      return rol.nombre === 'ADMIN' ? 'ADMIN' : 'MEDICO';
    }
    return 'MEDICO';
  };

  // Función para extraer la especialidad como string
  const getEspecialidadString = (especialidad: any): string => {
    if (!especialidad) return '';
    if (typeof especialidad === 'string') return especialidad;
    if (typeof especialidad === 'object' && especialidad.nombre) return especialidad.nombre;
    return '';
  };

  // Cargar datos del personal cuando se abre el modal
  useEffect(() => {
    if (personalData && isOpen) {
      setFormData({
        dni: personalData.dni || '',
        nombre: personalData.nombre || '',
        apellido: personalData.apellido || '',
        email: personalData.email || '',
        rol: getRolString(personalData.rol),
        especialidad: getEspecialidadString(personalData.especialidad),
        password: '',
        confirmPassword: '',
        cambiarPassword: false
      });
      setError('');
    }
  }, [personalData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  };

  const validateForm = (): boolean => {
    if (formData.nombre.length < 2) {
      setError('Nombre inválido. Mínimo 2 caracteres.');
      return false;
    }
    if (formData.apellido.length < 2) {
      setError('Apellido inválido. Mínimo 2 caracteres.');
      return false;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Email institucional inválido.');
      return false;
    }
    if (formData.cambiarPassword) {
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden.');
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

    try {
      const updateData: any = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        rol: formData.rol, // Ahora enviamos el string directamente
        especialidad: formData.especialidad || undefined
      };

      if (formData.cambiarPassword && formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`http://localhost:3000/api/personal/${personalData?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar personal');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !personalData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <User size={24} style={{ color: 'var(--accent-color)' }} />
            <h2>Editar Personal</h2>
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
                <label className="form-label">DNI</label>
                <input
                  type="text"
                  value={formData.dni}
                  className="form-input"
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
                <small style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  El DNI no se puede modificar
                </small>
              </div>

              <div className="form-field">
                <label className="form-label">Nombres *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Carlos Alberto"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-field">
                <label className="form-label">Apellidos *</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Mendoza Ramos"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-field full-width">
                <label className="form-label">Correo Electrónico Institucional *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="carlos.mendoza@essalud.gob.pe"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-field full-width">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    name="cambiarPassword"
                    checked={formData.cambiarPassword}
                    onChange={handleChange}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  Cambiar contraseña
                </label>
              </div>

              {formData.cambiarPassword && (
                <>
                  <div className="form-field">
                    <label className="form-label">Nueva Contraseña *</label>
                    <div className="password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mínimo 6 caracteres"
                        className="form-input"
                        required={formData.cambiarPassword}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="form-label">Confirmar Nueva Contraseña *</label>
                    <div className="password-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repite la nueva contraseña"
                        className="form-input"
                        required={formData.cambiarPassword}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="form-field">
                <label className="form-label">Rol *</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="MEDICO">Médico</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">Especialidad</label>
                <input
                  type="text"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  placeholder="Ej: Cardiología, Geriatría, etc."
                  className="form-input"
                />
                <small style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Opcional
                </small>
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
                  Actualizar Personal
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
          [data-theme="light"] .form-select {
            background: rgba(0, 0, 0, 0.03);
            border-color: #e5e7eb;
            color: #1a1a2e;
          }

          [data-theme="light"] .form-input:focus,
          [data-theme="light"] .form-select:focus {
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
            border-color: #9ca3af;
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
          .form-select:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .form-input:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .password-wrapper {
            position: relative;
          }

          .password-wrapper input {
            width: 100%;
            padding-right: 2.5rem;
          }

          .password-toggle {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
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