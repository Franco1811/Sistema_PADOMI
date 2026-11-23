import React, { useState, useRef } from 'react';
import { useAccessibility } from './AccessibilityContext';
import './accessibility.css';

export const AccessibilityToolbar: React.FC = () => {
  const { fontSize, setFontSize, colorMode, setColorMode, toggleScreenReader, isScreenReaderActive, speakText } = useAccessibility();

  // Estados para la posición flotante y arrastre
  const [position, setPosition] = useState({ x: window.innerWidth - 300, y: window.innerHeight - 450 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 300, dragRef.current.initialX + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 100, dragRef.current.initialY + dy)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <aside 
      className="accessibility-toolbar" 
      aria-label="Panel de Accesibilidad ODS 10"
      tabIndex={0}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        right: 'auto',
        bottom: 'auto',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {/* Cabecera apta para arrastrar con el mouse */}
      <div 
        className="accessibility-drag-handle"
        onMouseDown={handleMouseDown}
        title="Haz clic y arrastra para mover el panel"
        style={{ cursor: 'grab', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px' }}
      >
        <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Panel de Accesibilidad ✥</h3>
      </div>
      
      {/* 1. Agrandar texto (Conectado a setFontSize) */}
      <div className="control-group">
        <label>Tamaño de Texto:</label>
        <button 
          tabIndex={0} 
          className={fontSize === 'normal' ? 'active-btn' : ''}
          onClick={() => { setFontSize('normal'); speakText('Tamaño normal activado'); }} 
          aria-label="Texto normal"
        >
          A
        </button>
        <button 
          tabIndex={0} 
          className={fontSize === 'large' ? 'active-btn' : ''}
          onClick={() => { setFontSize('large'); speakText('Tamaño grande activado'); }} 
          aria-label="Texto grande"
        >
          A+
        </button>
        <button 
          tabIndex={0} 
          className={fontSize === 'xlarge' ? 'active-btn' : ''}
          onClick={() => { setFontSize('xlarge'); speakText('Tamaño extra grande activado'); }} 
          aria-label="Texto extra grande"
        >
          A++
        </button>
      </div>

      {/* 2. Daltonismo y Contraste (Conectado a setColorMode) */}
      <div className="control-group">
        <label>Modo Visual / Daltonismo:</label>
        <button 
          tabIndex={0} 
          className={colorMode === 'normal' ? 'active-btn' : ''}
          onClick={() => { setColorMode('normal'); speakText('Modo visual normal activado'); }}
        >
          Normal
        </button>
        <button 
          tabIndex={0} 
          className={colorMode === 'protanopia' ? 'active-btn' : ''}
          onClick={() => { setColorMode('protanopia'); speakText('Filtro Protanopia activado'); }}
        >
          Protanopia
        </button>
        <button 
          tabIndex={0} 
          className={colorMode === 'deuteranopia' ? 'active-btn' : ''}
          onClick={() => { setColorMode('deuteranopia'); speakText('Filtro Deuteranopia activado'); }}
        >
          Deuteranopia
        </button>
        <button 
          tabIndex={0} 
          className={colorMode === 'high-contrast' ? 'active-btn' : ''}
          onClick={() => { setColorMode('high-contrast'); speakText('Modo de alto contraste activado'); }}
        >
          Alto Contraste
        </button>
      </div>

      {/* 3. Lector de texto / Voz */}
      <div className="control-group">
        <button 
          tabIndex={0}
          onClick={toggleScreenReader}
          className={isScreenReaderActive ? 'active-btn' : ''}
          aria-pressed={isScreenReaderActive}
        >
          {isScreenReaderActive ? '🔊 Lector Activado' : '🔇 Activar Lector de Texto'}
        </button>
      </div>
    </aside>
  );
};