import { useState, useEffect } from 'react';
import type { Metrica } from '../services/metricas.service';

export function useTelemetriaSimulada(
  selectedPaciente: any | null,
  catalogoMetricas: Metrica[],
  lecturasHistoricas: any[] = []
) {
  const [telemetriaFC, setTelemetriaFC] = useState(72);
  const [telemetriaSPO2, setTelemetriaSPO2] = useState(98);
  const [graficoFCPoints, setGraficoFCPoints] = useState<number[]>([70, 72, 71, 73, 72, 75, 74, 76, 72, 71]);
  const [graficoSPO2Points, setGraficoSPO2Points] = useState<number[]>([98, 97, 98, 99, 98, 98, 97, 98, 98, 99]);

  useEffect(() => {
    if (!selectedPaciente) return;

    // Obtener rangos de la BD para usar en la simulación
    const metFC = catalogoMetricas.find(m =>
      m.nombre.toLowerCase().includes('frecuencia') ||
      m.nombre.toLowerCase().includes('cardiaca') ||
      m.nombre.toLowerCase().includes('card\u00edaca')
    );
    const metSPO2 = catalogoMetricas.find(m =>
      m.nombre.toLowerCase().includes('saturaci') ||
      m.nombre.toLowerCase().includes('ox') ||
      m.nombre.toLowerCase().includes('spo')
    );

    // Rango FC desde BD (fallback si aún no cargó el catálogo)
    const fcMin = metFC?.rangoMin ?? 60;
    const fcMax = metFC?.rangoMax ?? 100;
    const spo2Min = metSPO2?.rangoMin ?? 95;
    const spo2Max = metSPO2?.rangoMax ?? 100;

    // Valor base según estado clínico
    const fcNormal = Math.round((fcMin + fcMax) / 2);
    const spo2Normal = Math.round((spo2Min + spo2Max) / 2);

    const baseFC = selectedPaciente.estado === 'CRITICO'
      ? fcMax + 15
      : selectedPaciente.estado === 'ADVERTENCIA'
        ? fcMax - 5
        : fcNormal;

    const baseSPO2 = selectedPaciente.estado === 'CRITICO'
      ? spo2Min - 9
      : selectedPaciente.estado === 'ADVERTENCIA'
        ? spo2Min + 2
        : spo2Normal;

    // Cargar lecturas reales como base si existen en la BD
    let fcInit: number[] = [];
    let spo2Init: number[] = [];
    if (lecturasHistoricas.length > 0) {
      if (metFC) {
        fcInit = lecturasHistoricas
          .filter(l => l.metricaId === metFC.id)
          .map(l => Number(l.valor))
          .reverse();
      }
      if (metSPO2) {
        spo2Init = lecturasHistoricas
          .filter(l => l.metricaId === metSPO2.id)
          .map(l => Number(l.valor))
          .reverse();
      }
    }

    const defaultFCPoints = [70, 72, 71, 73, 72, 75, 74, 76, 72, 71];
    const initialFCPoints = fcInit.length > 0 
      ? (fcInit.length >= 10 ? fcInit.slice(-10) : [...defaultFCPoints.slice(0, 10 - fcInit.length), ...fcInit])
      : defaultFCPoints;

    const defaultSPO2Points = [98, 97, 98, 99, 98, 98, 97, 98, 98, 99];
    const initialSPO2Points = spo2Init.length > 0 
      ? (spo2Init.length >= 10 ? spo2Init.slice(-10) : [...defaultSPO2Points.slice(0, 10 - spo2Init.length), ...spo2Init])
      : defaultSPO2Points;

    setTelemetriaFC(initialFCPoints[initialFCPoints.length - 1] || baseFC);
    setTelemetriaSPO2(initialSPO2Points[initialSPO2Points.length - 1] || baseSPO2);
    setGraficoFCPoints(initialFCPoints);
    setGraficoSPO2Points(initialSPO2Points);

    // Límites absolutos de simulación: FC entre 40 y fcMax+40; SpO2 entre 70 y 100
    const fcSimMin = Math.max(40, fcMin - 20);
    const fcSimMax = fcMax + 40;
    const spo2SimMin = 70;
    const spo2SimMax = 100;

    const interval = setInterval(() => {
      const randomDiffFC = Math.floor(Math.random() * 5) - 2;
      const randomDiffSPO2 = Math.floor(Math.random() * 3) - 1;

      // Usar el valor anterior de telemetría como base de cambio en lugar de la constante baseFC/baseSPO2
      // para crear una curva más fluida y natural
      setTelemetriaFC(prev => {
        const next = Math.max(fcSimMin, Math.min(fcSimMax, prev + randomDiffFC));
        setGraficoFCPoints(points => [...points.slice(1), next]);
        return next;
      });

      setTelemetriaSPO2(prev => {
        const next = Math.max(spo2SimMin, Math.min(spo2SimMax, prev + randomDiffSPO2));
        setGraficoSPO2Points(points => [...points.slice(1), next]);
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [selectedPaciente?.paciente?.id, lecturasHistoricas.length, catalogoMetricas]);

  // Convertir puntos a coordenadas SVG del gráfico
  // Los límites del eje Y se derivan del catálogo de métricas (BD) para coherencia visual
  const generateSvgPath = (points: number[], isSpO2 = false) => {
    const metFC = catalogoMetricas.find(m =>
      m.nombre.toLowerCase().includes('frecuencia') ||
      m.nombre.toLowerCase().includes('cardiaca') ||
      m.nombre.toLowerCase().includes('card\u00edaca')
    );
    const metSPO2 = catalogoMetricas.find(m =>
      m.nombre.toLowerCase().includes('saturaci') ||
      m.nombre.toLowerCase().includes('ox') ||
      m.nombre.toLowerCase().includes('spo')
    );

    // Ampliar el eje visual un poco por encima/debajo del rango normal para que las curvas se vean
    const minVal = isSpO2 ? Math.max(70, (metSPO2?.rangoMin ?? 95) - 10) : Math.max(40, (metFC?.rangoMin ?? 60) - 20);
    const maxVal = isSpO2 ? 100 : (metFC?.rangoMax ?? 100) + 40;
    const range = Math.max(1, maxVal - minVal);

    const width = 300;
    const height = 80;
    const step = width / (points.length - 1);

    return points.map((p, idx) => {
      const x = idx * step;
      const pct = (p - minVal) / range;
      const y = height - (pct * height);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  return {
    telemetriaFC,
    telemetriaSPO2,
    graficoFCPoints,
    graficoSPO2Points,
    generateSvgPath
  };
}
