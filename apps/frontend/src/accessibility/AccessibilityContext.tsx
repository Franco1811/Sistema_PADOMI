import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (size: 'normal' | 'large' | 'xlarge') => void;
  colorMode: 'normal' | 'protanopia' | 'deuteranopia' | 'high-contrast';
  setColorMode: (mode: 'normal' | 'protanopia' | 'deuteranopia' | 'high-contrast') => void;
  isScreenReaderActive: boolean;
  toggleScreenReader: () => void;
  speakText: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [colorMode, setColorMode] = useState<'normal' | 'protanopia' | 'deuteranopia' | 'high-contrast'>('normal');
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  // Aplicar cambios de tamaño de texto globalmente en el HTML
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-normal', 'font-large', 'font-xlarge');
    root.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  // Aplicar cambios de modo visual / daltonismo globalmente en el HTML
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('mode-normal', 'mode-protanopia', 'mode-deuteranopia', 'mode-high-contrast');
    root.classList.add(`mode-${colorMode}`);
  }, [colorMode]);

  // Función de síntesis de voz (Text-to-Speech)
  const speakText = (text: string) => {
    if (!isScreenReaderActive) return; // Si el lector está apagado, no habla
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Detener cualquier audio previo
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleScreenReader = () => {
    setIsScreenReaderActive(prev => {
      const nextState = !prev;
      if (nextState) {
        const utterance = new SpeechSynthesisUtterance("Lector de texto activado");
        utterance.lang = 'es-ES';
        window.speechSynthesis.speak(utterance);
      } else {
        window.speechSynthesis.cancel();
      }
      return nextState;
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        colorMode,
        setColorMode,
        isScreenReaderActive,
        toggleScreenReader,
        speakText
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility debe usarse dentro de un AccessibilityProvider');
  }
  return context;
};