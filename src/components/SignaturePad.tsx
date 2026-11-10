import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, Trash2, Check, PenTool } from 'lucide-react';

interface SignaturePadProps {
  initialDataUrl?: string;
  onSaveSignature: (dataUrl: string) => void;
  signerName: string;
  label?: string;
  required?: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  initialDataUrl,
  onSaveSignature,
  signerName,
  label = 'Client Signature (Draw below)',
  required = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [inkColor, setInkColor] = useState<'slate' | 'royal'>('slate');
  const [history, setHistory] = useState<ImageData[]>([]);

  // Setup canvas size accounting for DPR
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = rect.width || 480;
    const height = 160;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = inkColor === 'royal' ? '#1d4ed8' : '#0f172a';

    // If initial image exists, draw it
    if (initialDataUrl && initialDataUrl.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        setHasDrawn(true);
      };
      img.src = initialDataUrl;
    }
  }, [initialDataUrl, inkColor]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => {
      // Re-init canvas on window resize
      initCanvas();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  const saveHistoryStep = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-10), imgData]);
  };

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveHistoryStep();
    canvas.setPointerCapture(e.pointerId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    const { x, y } = getCoordinates(e);
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = inkColor === 'royal' ? '#1d4ed8' : '#0f172a';
    ctx.lineWidth = 2.5;
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored if pointer not captured
    }
    setIsDrawing(false);
    onSaveSignature(canvas.toDataURL('image/png'));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setHistory([]);
    onSaveSignature('');
  };

  const undoLastStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    const prev = newHistory.pop();
    setHistory(newHistory);

    if (prev) {
      ctx.putImageData(prev, 0, 0);
      onSaveSignature(canvas.toDataURL('image/png'));
      if (newHistory.length === 0) {
        setHasDrawn(false);
      }
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <PenTool className="w-4 h-4 text-sky-600" />
          <span>{label}</span>
          {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="flex items-center gap-2">
          {hasDrawn && (
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Signed
            </span>
          )}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
            <button
              type="button"
              onClick={() => setInkColor('slate')}
              title="Black/Charcoal Ink"
              className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                inkColor === 'slate' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Dark Ink
            </button>
            <button
              type="button"
              onClick={() => setInkColor('royal')}
              title="Official Blue Ink"
              className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                inkColor === 'royal' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Blue Ink
            </button>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full rounded-lg border-2 border-dashed border-slate-300 bg-white shadow-xs overflow-hidden transition-all hover:border-sky-400 focus-within:border-sky-500"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="touch-none cursor-crosshair block w-full bg-slate-50/40"
          style={{ height: '160px' }}
        />

        {/* Subtle baseline watermark */}
        <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between border-b border-slate-200 pb-1 text-[11px] text-slate-400">
          <span>Sign above this line</span>
          <span>{signerName ? `Name: ${signerName}` : 'Authorized Signatory'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-slate-500">
          Touch or draw with mouse. Complies with digital handover acceptance.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={undoLastStroke}
            disabled={history.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-3 h-3" />
            Undo
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Clear Signature
          </button>
        </div>
      </div>
    </div>
  );
};
