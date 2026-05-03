import React, { useRef, useEffect, useMemo } from 'react';
import { prepare, layout } from '@chenglou/pretext';

interface PretextProps {
  text: string;
  width: number;
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  color?: string;
  className?: string;
}

/**
 * PretextLayout
 * Premium zero-reflow text rendering component.
 * Uses @chenglou/pretext to measure text on the fly and reserve space.
 */
export const PretextLayout: React.FC<PretextProps> = ({
  text,
  width,
  fontSize = 16,
  fontFamily = 'Inter, Noto Sans, sans-serif',
  lineHeight = 1.5,
  color = 'currentColor',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fontSpec = `${fontSize}px ${fontFamily}`;

  // 1. Prepare text measurement
  const prepared = useMemo(() => {
    try {
      return prepare(text, fontSpec);
    } catch (e) {
      console.warn('Pretext prepare failed', e);
      return null;
    }
  }, [text, fontSpec]);

  // 2. Calculate layout
  const layoutResult = useMemo(() => {
    if (!prepared) return { height: 0, lines: [] };
    return layout(prepared, width, fontSize * lineHeight);
  }, [prepared, width, fontSize, lineHeight]);

  // 3. Render to Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !layoutResult.lines.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = layoutResult.height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${layoutResult.height}px`;
    ctx.scale(dpr, dpr);

    ctx.font = fontSpec;
    // Resolve "currentColor" if needed
    if (color === 'currentColor') {
      const computedColor = getComputedStyle(canvas).color;
      ctx.fillStyle = computedColor;
    } else {
      ctx.fillStyle = color;
    }
    
    ctx.textBaseline = 'top';

    layoutResult.lines.forEach((line, index) => {
      ctx.fillText(line.text, 0, index * fontSize * lineHeight);
    });
  }, [layoutResult, width, fontSpec, color, fontSize, lineHeight]);

  return (
    <div 
      style={{ 
        width: width > 0 ? `${width}px` : '100%', 
        height: `${layoutResult.height}px`,
        overflow: 'hidden'
      }} 
      className={className}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

