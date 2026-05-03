import React, { useMemo } from 'react';
import { prepare, layout } from '@chenglou/pretext';

interface PretextRendererProps {
  text: string;
  font?: string;
  width: number;
  lineHeight?: number;
  className?: string;
}

/**
 * PretextRenderer
 * High-performance text rendering using @chenglou/pretext
 * Bypasses DOM reflow by calculating layout via Canvas API measurements.
 */
const PretextRenderer: React.FC<PretextRendererProps> = ({
  text,
  font = '16px Inter, sans-serif',
  width,
  lineHeight = 1.5,
  className = '',
}) => {
  // 1. One-time preparation (Memoized)
  const prepared = useMemo(() => {
    try {
      return prepare(text, font);
    } catch (e) {
      console.warn('Pretext prepare failed, falling back to standard text', e);
      return null;
    }
  }, [text, font]);

  // 2. Fast layout calculation (Memoized)
  const layoutResult = useMemo(() => {
    if (!prepared || width <= 0) return null;
    try {
      // Line height in pixels
      const fontSize = parseInt(font.split('px')[0]) || 16;
      const lh = fontSize * lineHeight;
      return layout(prepared, width, lh);
    } catch (e) {
      console.warn('Pretext layout failed', e);
      return null;
    }
  }, [prepared, width, font, lineHeight]);

  if (!layoutResult) {
    return <div className={className}>{text}</div>;
  }

  return (
    <div 
      className={className}
      style={{ 
        height: layoutResult.height,
        position: 'relative',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* 
          In a real-world scenario, we might render to Canvas for absolute zero-reflow,
          but for React integration, we use the pre-calculated heights to prevent layout shift.
      */}
      <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>
    </div>
  );
};

export default PretextRenderer;
