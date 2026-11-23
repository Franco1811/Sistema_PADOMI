// src/accessibility/AccessibilityShortcuts.tsx
import React, { useEffect } from 'react';
import { useAccessibility } from './AccessibilityContext';

export const AccessibilityShortcuts: React.FC = () => {
  const { toggleScreenReader, speakText, setFontSize, setColorMode } = useAccessibility();

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Combinaciones seguras con Ctrl + Shift (Cumple WCAG 2.1.4)
      if (e.ctrlKey && e.shiftKey) {
        const key = e.key.toLowerCase();

        // Cambiado de 's' a 'a' para evitar conflictos con grabadores de pantalla
        if (key === 'a') {
          e.preventDefault();
          toggleScreenReader();
        } else if (key === 'r') {
          e.preventDefault();
          setFontSize('normal');
          setColorMode('normal');
          speakText('Ajustes de accesibilidad restablecidos a modo normal');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [toggleScreenReader, speakText, setFontSize, setColorMode]);

  return null; // Componente puramente lógico
};