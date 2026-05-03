import React, { useRef, useEffect, useMemo } from 'react';
import { prepare, layout } from '@chenglou/pretext';

interface PretextCanvasProps {
  text: string;
  width: number;
  fontSize?: number;
  fontFamily?: string;
  lineHeight?: number;
  color?: string;
}

interface PretextLine {
  text: string;
}

interface LayoutResult {
  height: number;
  lines: PretextLine[];
}

const PretextCanvas: React.FC<PretextCanvasProps> = ({ 
  text, 
  width, 
  fontSize = 16, 
  fontFamily = 'Inter, Noto Sans', 
  lineHeight = 1.5,
  color = '#000000'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fontSpec = `${fontSize}px ${fontFamily}`;

  // Step 1: Prepare (One-time measurement)
  const prepared = useMemo(() => {
    return prepare(text, fontSpec);
  }, [text, fontSpec]);

  // Step 2: Layout (Calculate lines based on width)
  const layoutResult = useMemo<LayoutResult>(() => {
    const res = layout(prepared, width, fontSize * lineHeight);
    return res as unknown as LayoutResult;
  }, [prepared, width, fontSize, lineHeight]);

  // Step 3: Draw to Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = layoutResult.height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${layoutResult.height}px`;
    ctx.scale(dpr, dpr);

    ctx.font = fontSpec;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';

    // Draw each line from the layout result
    layoutResult.lines.forEach((line: PretextLine, index: number) => {
      ctx.fillText(line.text, 0, index * fontSize * lineHeight);
    });
  }, [layoutResult, width, fontSpec, color, fontSize, lineHeight]);

  return <canvas ref={canvasRef} />;
};

export default PretextCanvas;
