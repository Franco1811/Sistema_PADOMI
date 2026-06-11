import { useState, useEffect } from 'react';
import { X, UserPlus, Check, AlertCircle, Eye, EyeOff, Plus, Database } from 'lucide-react';

interface RegistrarPersonalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

interface FormData {
  dni: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  rol: 'MEDICO' | 'ADMIN';
  especialidad: string;
}

export function RegistrarPersonalModal({ isOpen, onClose, onSuccess, token }: RegistrarPersonalModalProps) {
  const [formData, setFormData] = useState<FormData>({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'MEDICO',
    especialidad: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [cargandoEspecialidades, setCargandoEspecialidades] = useState(false);
  
  // Estados para crear especialidad
  const [mostrarFormEspecialidad, setMostrarFormEspecialidad] = useState(false);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState({ nombre: '', descripcion: '' });
  const [creandoEspecialidad, setCreandoEspecialidad] = useState(false);

  // Cargar especialidades desde la base de datos
  useEffect(() => {
    if (isOpen) {
      cargarEspecialidades();
    }
  }, [isOpen]);

  const cargarEspecialidades = async () => {
    setCargandoEspecialidades(true);
    try {
      const response = await fetch('http://localhost:3000/api/especialidades', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEspecialidades(data);
      }
    } catch (err) {
      console.error('Error cargando especialidades:', err);
    } finally {
      setCargandoEspecialidades(false);
    }
  };

  const handleCrearEspecialidad = async () => {
    if (!nuevaEspecialidad.nombre.trim()) {
      setError('El nombre de la especialidad es requerido');
      return;
    }

    setCreandoEspecialidad(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/especialidades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: nuevaEspecialidad.nombre,
          descripcion: nuevaEspecialidad.descripcion
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear especialidad');
      }

      const nueva = await response.json();
      setEspecialidades([...especialidades, nueva]);
      setFormData({ ...formData, especialidad: nueva.nombre });
      setMostrarFormEspecialidad(false);
      setNuevaEspecialidad({ nombre: '', descripcion: '' });
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreandoEspecialidad(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!/^\d{8}$/.test(formData.dni)) {
      setError('DNI inválido. Debe contener 8 dígitos.');
      return false;
    }
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
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
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
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        rol: formData.rol,
        especialidad: formData.especialidad || undefined
      };

      const response = await fetch('http://localhost:3000/api/personal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar personal');
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
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      confirmPassword: '',
      rol: 'MEDICO',
      especialidad: ''
    });
    setError('');
    setMostrarFormEspecialidad(false);
    setNuevaEspecialidad({ nombre: '', descripcion: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <UserPlus size={24} style={{ color: 'var(--accent-color)' }} />
            <h2>Registrar Nuevo Personal</h2>
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
                <label className="form-label">DNI *</label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder="12345678"
                  maxLength={8}
                  className="form-input"
                  required
                />
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

              <div className="form-field">
                <label className="form-label">Contraseña *</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className="form-input"
                    required
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
                <label className="form-label">Confirmar Contraseña *</label>
                <div className="password-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite la contraseña"
                    className="form-input"
                    required
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

              <div className="form-field full-width">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label">Especialidad (Opcional)</label>
                  <button
                    type="button"
                    onClick={() => setMostrarFormEspecialidad(!mostrarFormEspecialidad)}
                    className="btn-gestionar-especialidad"
                  >
                    <Database size={14} /> Gestionar Especialidades
                  </button>
                </div>
                
                <select
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  className="form-select"
                  disabled={cargandoEspecialidades}
                >
                  <option value="">
                    {cargandoEspecialidades ? 'Cargando especialidades...' : 'Seleccionar especialidad (opcional)'}
                  </option>
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.nombre}>
                      {esp.nombre} {esp.descripcion && `- ${esp.descripcion.substring(0, 30)}`}
                    </option>
                  ))}
                </select>
                <small style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Puedes seleccionar una especialidad existente o crear una nueva con el botón "Gestionar Especialidades"
                </small>
              </div>

              {/* Formulario para crear nueva especialidad */}
              {mostrarFormEspecialidad && (
                <div className="crear-especialidad-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: 'var(--accent-color)' }}>Nueva Especialidad</h4>
                    <button
                      type="button"
                      onClick={() => setMostrarFormEspecialidad(false)}
                      className="close-btn"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="form-field">
                    <label>Nombre de la especialidad *</label>
                    <input
                      type="text"
                      value={nuevaEspecialidad.nombre}
                      onChange={(e) => setNuevaEspecialidad({ ...nuevaEspecialidad, nombre: e.target.value })}
                      placeholder="Ej: Neurología, Pediatría, Traumatología"
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label>Descripción (opcional)</label>
                    <textarea
                      value={nuevaEspecialidad.descripcion}
                      onChange={(e) => setNuevaEspecialidad({ ...nuevaEspecialidad, descripcion: e.target.value })}
                      placeholder="Descripción de la especialidad..."
                      className="form-textarea"
                      rows={2}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setMostrarFormEspecialidad(false)}
                      className="btn-cancel-small"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleCrearEspecialidad}
                      disabled={creandoEspecialidad}
                      className="btn-submit-small"
                    >
                      {creandoEspecialidad ? 'Creando...' : 'Crear Especialidad'}
                    </button>
                  </div>
                </div>
              )}
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
                  Registrar Personal
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
            max-width: 750px;
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
          .form-select:focus,
          .form-textarea:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .form-textarea {
            resize: vertical;
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

          .btn-gestionar-especialidad {
            background: transparent;
            border: 1px solid var(--accent-color);
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.7rem;
            color: var(--accent-color);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            transition: all 0.2s;
          }

          .btn-gestionar-especialidad:hover {
            background: rgba(59, 130, 246, 0.1);
          }

          .crear-especialidad-card {
            grid-column: 1 / -1;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 16px;
            padding: 1rem;
            border: 1px solid var(--border-color);
            margin-top: 0.5rem;
          }

          [data-theme="light"] .crear-especialidad-card {
            background: rgba(0, 0, 0, 0.02);
          }

          .close-btn {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            display: flex;
            align-items: center;
          }

          .close-btn:hover {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
          }

          .btn-cancel-small,
          .btn-submit-small {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .btn-cancel-small {
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--text-secondary);
          }

          .btn-submit-small {
            background: var(--accent-color);
            border: none;
            color: white;
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