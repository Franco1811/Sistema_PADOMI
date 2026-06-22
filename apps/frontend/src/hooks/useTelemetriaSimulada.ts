import { useState, useEffect } from 'react';
import type { Metrica } from '../services/metricas.service';

export function useTelemetriaSimulada(
  selectedPaciente: any | null,
  catalogoMetricas: Metrica[],
  lecturasHistoricas: any[] = [],
  umbralesPaciente: any[] = []
) {
  const [valores, setValores] = useState<{ [metricaId: string]: number }>({});
  const [historicos, setHistoricos] = useState<{ [metricaId: string]: number[] }>({});

  useEffect(() => {
    if (!selectedPaciente || umbralesPaciente.length === 0) {
      setValores({});
      setHistoricos({});
      return;
    }

    const initialValores: { [metricaId: string]: number } = {};
    const initialHistoricos: { [metricaId: string]: number[] } = {};

    for (const u of umbralesPaciente) {
      const met = catalogoMetricas.find(m => m.id === u.metricaId);
      const minVal = met ? Number(met.rangoMin) : Number(u.valorMin);
      const maxVal = met ? Number(met.rangoMax) : Number(u.valorMax);
      const normalMid = (minVal + maxVal) / 2;

      // Cargar lecturas reales de la base de datos
      const lecturasMetrica = lecturasHistoricas
        .filter(l => l.metricaId === u.metricaId)
        .map(l => Number(l.valor))
        .reverse();

      const defaultPoints = Array.from({ length: 10 }, (_, i) => {
        // Generar una onda sinusoide suave alrededor del punto medio normal
        const angle = (i / 9) * Math.PI * 2;
        const variation = (maxVal - minVal) * 0.05 * Math.sin(angle);
        return normalMid + variation;
      });

      const initialPoints = lecturasMetrica.length > 0
        ? (lecturasMetrica.length >= 10 ? lecturasMetrica.slice(-10) : [...defaultPoints.slice(0, 10 - lecturasMetrica.length), ...lecturasMetrica])
        : defaultPoints;

      initialValores[u.metricaId] = initialPoints[initialPoints.length - 1];
      initialHistoricos[u.metricaId] = initialPoints;
    }

    setValores(initialValores);
    setHistoricos(initialHistoricos);

    const interval = setInterval(() => {
      setValores(prevValores => {
        const nextValores = { ...prevValores };

        for (const u of umbralesPaciente) {
          const met = catalogoMetricas.find(m => m.id === u.metricaId);
          const minVal = met ? Number(met.rangoMin) : Number(u.valorMin);
          const maxVal = met ? Number(met.rangoMax) : Number(u.valorMax);
          const range = maxVal - minVal;

          const currentVal = prevValores[u.metricaId] ?? (minVal + maxVal) / 2;
          const randomDiff = range * 0.03 * (Math.random() - 0.5); // +/- 1.5% del rango

          // Asegurar que se mantiene dentro de límites fisiológicos razonables
          let nextVal = currentVal + randomDiff;
          if (nextVal < minVal - range * 0.2) nextVal = minVal - range * 0.2;
          if (nextVal > maxVal + range * 0.2) nextVal = maxVal + range * 0.2;

          nextValores[u.metricaId] = Number(nextVal.toFixed(1));
        }

        setHistoricos(prevHistoricos => {
          const updatedHistoricos = { ...prevHistoricos };
          for (const u of umbralesPaciente) {
            const nextVal = nextValores[u.metricaId];
            const currentPoints = prevHistoricos[u.metricaId] || [nextVal];
            updatedHistoricos[u.metricaId] = [...currentPoints.slice(1), nextVal];
          }
          return updatedHistoricos;
        });

        return nextValores;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [selectedPaciente?.paciente?.id, lecturasHistoricas.length, umbralesPaciente.length, catalogoMetricas]);

  const generateSvgPath = (points: number[], minVal: number, maxVal: number) => {
    const range = Math.max(1, maxVal - minVal);
    const padding = range * 0.1;
    const visualMin = minVal - padding;
    const visualMax = maxVal + padding;
    const visualRange = visualMax - visualMin;

    const width = 300;
    const height = 80;
    const step = width / (points.length - 1);

    return points.map((p, idx) => {
      const x = idx * step;
      const pct = (p - visualMin) / visualRange;
      const y = height - (pct * height);
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  };

  return {
    valores,
    historicos,
    generateSvgPath
  };
}
