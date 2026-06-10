import { useState, useEffect } from 'react';
import { AlertasService } from '../services/alertas.service';
import { PacientesService } from '../services/pacientes.service';
import { MetricasService, type Metrica } from '../services/metricas.service';
import type { Usuario } from '../services/auth.service';

export function useMedicoDashboard(
  usuario: Usuario,
  token: string,
  addToast: (titulo: string, mensaje: string, severidad: 'CRITICO' | 'ADVERTENCIA' | 'INFO' | 'EXITO') => void
) {
  // Estados del Dashboard de Médicos
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [pagina, setPagina] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<any | null>(null);

  // KPIs del Header del Dashboard
  const [totalPacientes, setTotalPacientes] = useState(0);
  const [alertasCriticas, setAlertasCriticas] = useState(0);

  // Historial de lecturas reales y Enfermedades Crónicas
  const [enfermedadesPaciente, setEnfermedadesPaciente] = useState<any[]>([]);
  const [lecturasHistoricas, setLecturasHistoricas] = useState<any[]>([]);

  // Estados para la Evaluación Médica al atender una Alerta (CU-07)
  const [evaluandoAlerta, setEvaluandoAlerta] = useState<any | null>(null);
  const [resumenClinico, setResumenClinico] = useState('');
  const [recomendacionesClinicas, setRecomendacionesClinicas] = useState('');

  // Estados de Filtros Clínicos Interactivos
  const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'CRITICO' | 'ADVERTENCIA' | 'NORMAL'>('TODOS');
  const [soloAlertasActivas, setSoloAlertasActivas] = useState(false);

  // Nuevos estados para CU-07: Atender Emergencia Médica
  const [alertaEmergencia, setAlertaEmergencia] = useState<any | null>(null);
  const [alertasPaciente, setAlertasPaciente] = useState<any[]>([]);
  const [loadingAlertas, setLoadingAlertas] = useState(false);
  const [protocoloEmergencia, setProtocoloEmergencia] = useState<any | null>(null);

  // Estados para CU-05: Gestionar Paciente (Ficha y Umbrales)
  const [isEditingFicha, setIsEditingFicha] = useState(false);
  const [editTelefono, setEditTelefono] = useState('');
  const [editDireccion, setEditDireccion] = useState('');
  const [editUmbrales, setEditUmbrales] = useState<any[]>([]);
  const [catalogoMetricas, setCatalogoMetricas] = useState<Metrica[]>([]);
  const [nuevaMetricaId, setNuevaMetricaId] = useState('');
  const [nuevaMetricaMin, setNuevaMetricaMin] = useState('');
  const [nuevaMetricaMax, setNuevaMetricaMax] = useState('');

  // Estado para el diálogo de confirmación reutilizable
  const [confirmDialog, setConfirmDialog] = useState<{
    visible: boolean;
    titulo: string;
    mensaje: string;
    onConfirm: () => void;
  }>({ visible: false, titulo: '', mensaje: '', onConfirm: () => {} });

  // Estado de carga al guardar la ficha
  const [isSavingFicha, setIsSavingFicha] = useState(false);

  // Helper: mostrar diálogo de confirmación
  const mostrarConfirmacion = (titulo: string, mensaje: string, onConfirm: () => void) => {
    setConfirmDialog({ visible: true, titulo, mensaje, onConfirm });
  };

  const cerrarConfirmacion = () => {
    setConfirmDialog(prev => ({ ...prev, visible: false }));
  };

  const cargarPacientes = async () => {
    try {
      setLoadingPacientes(true);
      const data = await PacientesService.obtenerDashboard(usuario.id, busqueda, pagina, token);
      setPacientes(data);
      cargarKPIs(); // Recargar KPIs junto con los pacientes
    } catch (err) {
      console.error('Error al cargar pacientes del dashboard:', err);
    } finally {
      setLoadingPacientes(false);
    }
  };

  const cargarAlertasPaciente = async (pacienteId: string) => {
    try {
      setLoadingAlertas(true);
      const data = await AlertasService.obtenerPorPaciente(pacienteId, token);
      setAlertasPaciente(data);
    } catch (err) {
      console.error('Error al cargar alertas del paciente:', err);
    } finally {
      setLoadingAlertas(false);
    }
  };

  const atenderAlerta = async (alertaId: string, resumen: string, recomendaciones: string): Promise<boolean> => {
    try {
      const ok = await AlertasService.atender(alertaId, usuario.id, resumen, recomendaciones, token);
      if (ok) {
        // Gatillar protocolo clínico de contacto si la alerta atendida es la emergencia activa o es de nivel CRITICO
        const alertaEncontrada = alertasPaciente.find(a => a.id === alertaId);
        const esEmergencia = (alertaEmergencia && alertaEmergencia.id === alertaId) || 
                            (alertaEncontrada && alertaEncontrada.severidad === 'CRITICO');

        if (esEmergencia) {
          const pac = selectedPaciente?.paciente || (alertaEmergencia ? {
            id: alertaEmergencia.pacienteId,
            nombres: alertaEmergencia.pacienteNombre,
            telefono: alertaEmergencia.telefono,
            direccion: alertaEmergencia.direccion,
            diagnostico: alertaEmergencia.diagnostico
          } : null);

          if (pac) {
            setProtocoloEmergencia({
              paciente: pac,
              mensaje: alertaEncontrada?.mensaje || alertaEmergencia?.mensaje || 'Lectura crítica fuera de límites',
              codigo: alertaEncontrada?.codigo || alertaEmergencia?.codigo || 'ALR-CRITICA'
            });
          }
          setAlertaEmergencia(null);
        }

        cargarPacientes();
        cargarKPIs();
        return true;
      } else {
        addToast('Error al atender', 'La alerta ya fue atendida por otro médico o expiró.', 'ADVERTENCIA');
        cargarPacientes();
        return false;
      }
    } catch (err) {
      console.error('Error al atender la alerta:', err);
      addToast('Error de conexión', 'No se pudo contactar con el servidor.', 'CRITICO');
      return false;
    }
  };

  const cargarCatalogoMetricas = async () => {
    try {
      const data = await MetricasService.listar(token);
      console.log('[PADOMI] Métricas cargadas desde BD:', data.length, data.map((m: any) => m.nombre));
      setCatalogoMetricas(data);
    } catch (err) {
      console.error('[PADOMI] Error de red al cargar catálogo de métricas:', err);
    }
  };

  const cargarKPIs = async () => {
    try {
      const kpis = await PacientesService.obtenerKPIs(usuario.id, token);
      setTotalPacientes(kpis.totalPacientes);
      setAlertasCriticas(kpis.alertasCriticasHoy);
    } catch (err) {
      console.error('Error al cargar KPIs del médico:', err);
    }
  };

  const cargarLecturasHistoricas = async (pacienteId: string) => {
    try {
      const data = await PacientesService.obtenerLecturas(pacienteId, token, 30);
      setLecturasHistoricas(data);
    } catch (err) {
      console.error('Error al cargar lecturas históricas:', err);
    }
  };

  const cargarPerfilPaciente = async (pacienteId: string) => {
    try {
      const data = await PacientesService.obtenerPerfil(pacienteId, token);
      setEditTelefono(data.paciente.telefono || '');
      setEditDireccion(data.paciente.direccion || '');
      setEditUmbrales(data.umbrales || []);
      setEnfermedadesPaciente(data.enfermedades || []);
    } catch (err) {
      console.error('Error al cargar perfil del paciente:', err);
    }
  };

  const handleSelectMetrica = (metricaId: string) => {
    setNuevaMetricaId(metricaId);
    if (!metricaId) {
      setNuevaMetricaMin('');
      setNuevaMetricaMax('');
      return;
    }
    const met = catalogoMetricas.find(m => m.id === metricaId);
    if (met) {
      setNuevaMetricaMin(String(met.rangoMin));
      setNuevaMetricaMax(String(met.rangoMax));
    }
  };

  const guardarCambiosFicha = async () => {
    if (!selectedPaciente) return;
    setIsSavingFicha(true);
    try {
      for (const u of editUmbrales) {
        const min = parseFloat(String(u.valorMin));
        const max = parseFloat(String(u.valorMax));
        if (isNaN(min) || isNaN(max)) {
          addToast('Valor inválido', `Defina valores numéricos para ${u.metrica?.nombre || 'la métrica'}.`, 'ADVERTENCIA');
          setIsSavingFicha(false);
          return;
        }
        if (min >= max) {
          addToast('Rango incorrecto', `El valor mínimo debe ser menor al máximo para ${u.metrica?.nombre || 'la métrica'}.`, 'ADVERTENCIA');
          setIsSavingFicha(false);
          return;
        }

        const met = catalogoMetricas.find(m => m.id === u.metricaId);
        if (met) {
          if (min < met.rangoMin || max > met.rangoMax) {
            addToast(
              'Fuera del rango permitido',
              `El umbral de ${met.nombre} (${min} – ${max}) excede los límites fisiológicos [${met.rangoMin} – ${met.rangoMax}] ${met.unidad}.`,
              'CRITICO'
            );
            setIsSavingFicha(false);
            return;
          }
        }
      }

      const payload = {
        pacienteId: selectedPaciente.paciente.id,
        telefono: editTelefono,
        direccion: editDireccion,
        umbrales: editUmbrales.map(u => ({
          metricaId: u.metricaId,
          valorMin: parseFloat(String(u.valorMin)),
          valorMax: parseFloat(String(u.valorMax))
        }))
      };

      const res = await PacientesService.actualizarPerfil(selectedPaciente.paciente.id, payload, token);

      if (res.ok) {
        addToast('Ficha Actualizada', 'Los datos y umbrales del paciente se actualizaron con éxito.', 'EXITO');
        setIsEditingFicha(false);
        cargarPacientes();
        
        // Recargar los datos para mantener el modal sincronizado
        const updatedData = await PacientesService.obtenerPerfil(selectedPaciente.paciente.id, token);
        setSelectedPaciente((prev: any) => prev ? {
          ...prev,
          paciente: {
            ...prev.paciente,
            telefono: updatedData.paciente.telefono,
            direccion: updatedData.paciente.direccion
          }
        } : null);
        setEditTelefono(updatedData.paciente.telefono || '');
        setEditDireccion(updatedData.paciente.direccion || '');
        setEditUmbrales(updatedData.umbrales || []);
      } else {
        const errData = await res.json().catch(() => ({}));
        addToast('Error al guardar', errData.error || 'Verifique que los valores estén dentro del rango permitido.', 'CRITICO');
      }
    } catch (err) {
      console.error('Error al guardar la ficha del paciente:', err);
      addToast('Error de conexión', 'No se pudo guardar. Verifique la conexión con el servidor.', 'CRITICO');
    } finally {
      setIsSavingFicha(false);
    }
  };

  const agregarNuevaMetrica = () => {
    if (!nuevaMetricaId || nuevaMetricaMin === '' || nuevaMetricaMax === '') {
      addToast('Campos incompletos', 'Complete todos los datos para la nueva métrica.', 'ADVERTENCIA');
      return;
    }

    const min = parseFloat(nuevaMetricaMin);
    const max = parseFloat(nuevaMetricaMax);
    if (isNaN(min) || isNaN(max)) {
      addToast('Valor inválido', 'Defina valores numéricos válidos.', 'ADVERTENCIA');
      return;
    }
    if (min >= max) {
      addToast('Rango incorrecto', 'El valor mínimo debe ser menor al máximo.', 'ADVERTENCIA');
      return;
    }

    const metricaOriginal = catalogoMetricas.find(m => m.id === nuevaMetricaId);
    if (!metricaOriginal) return;

    if (editUmbrales.some(u => u.metricaId === nuevaMetricaId)) {
      addToast('Métrica duplicada', `${metricaOriginal.nombre} ya está configurada para este paciente.`, 'ADVERTENCIA');
      return;
    }

    if (min < metricaOriginal.rangoMin || max > metricaOriginal.rangoMax) {
      addToast(
        'Fuera del rango permitido',
        `El umbral de ${metricaOriginal.nombre} (${min} – ${max}) debe estar dentro de [${metricaOriginal.rangoMin} – ${metricaOriginal.rangoMax}] ${metricaOriginal.unidad}.`,
        'CRITICO'
      );
      return;
    }

    const nuevoUmbralObj = {
      metricaId: nuevaMetricaId,
      valorMin: String(min),
      valorMax: String(max),
      metrica: metricaOriginal
    };

    setEditUmbrales(prev => [...prev, nuevoUmbralObj]);
    setNuevaMetricaId('');
    setNuevaMetricaMin('');
    setNuevaMetricaMax('');
    addToast('Métrica añadida', `${metricaOriginal.nombre} agregada. Guarda la ficha para confirmar.`, 'INFO');
  };

  // Cargar catálogo de métricas y KPIs al montar
  useEffect(() => {
    cargarCatalogoMetricas();
    cargarKPIs();
  }, []);

  // Cargar pacientes al cambiar búsqueda o página
  useEffect(() => {
    cargarPacientes();
  }, [busqueda, pagina]);

  // Cargar alertas, lecturas y perfil del paciente seleccionado
  useEffect(() => {
    if (selectedPaciente) {
      cargarAlertasPaciente(selectedPaciente.paciente.id);
      cargarPerfilPaciente(selectedPaciente.paciente.id);
      cargarLecturasHistoricas(selectedPaciente.paciente.id);
      setIsEditingFicha(false);
    } else {
      setAlertasPaciente([]);
      setEditUmbrales([]);
      setEnfermedadesPaciente([]);
      setLecturasHistoricas([]);
      setIsEditingFicha(false);
    }
  }, [selectedPaciente]);

  return {
    totalPacientes,
    alertasCriticas,
    enfermedadesPaciente,
    lecturasHistoricas,
    evaluandoAlerta,
    setEvaluandoAlerta,
    resumenClinico,
    setResumenClinico,
    recomendacionesClinicas,
    setRecomendacionesClinicas,
    pacientes,
    loadingPacientes,
    busqueda,
    setBusqueda,
    pagina,
    setPagina,
    isConnected,
    setIsConnected,
    selectedPaciente,
    setSelectedPaciente,
    filtroEstado,
    setFiltroEstado,
    soloAlertasActivas,
    setSoloAlertasActivas,
    alertaEmergencia,
    setAlertaEmergencia,
    alertasPaciente,
    setAlertasPaciente,
    loadingAlertas,
    protocoloEmergencia,
    setProtocoloEmergencia,
    isEditingFicha,
    setIsEditingFicha,
    editTelefono,
    setEditTelefono,
    editDireccion,
    setEditDireccion,
    editUmbrales,
    setEditUmbrales,
    catalogoMetricas,
    cargarCatalogoMetricas,
    nuevaMetricaId,
    nuevaMetricaMin,
    nuevaMetricaMax,
    handleSelectMetrica,
    setNuevaMetricaMin,
    setNuevaMetricaMax,
    guardarCambiosFicha,
    agregarNuevaMetrica,
    confirmDialog,
    mostrarConfirmacion,
    cerrarConfirmacion,
    isSavingFicha,
    cargarPacientes,
    cargarAlertasPaciente,
    cargarKPIs,
    cargarLecturasHistoricas,
    atenderAlerta
  };
}
