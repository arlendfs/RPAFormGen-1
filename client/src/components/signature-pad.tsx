import { useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser } from 'lucide-react';

interface SignaturePadProps {
  width?: number;
  height?: number;
  onSignatureChange?: (signature: string) => void;
  disabled?: boolean;
}

export function SignaturePad({ 
  width = 300, 
  height = 128, 
  onSignatureChange,
  disabled = false 
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSignatureChange?.('');
  }, [onSignatureChange]);

  const getCoordinates = useCallback((event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in event) {
      return {
        x: (event.touches[0].clientX - rect.left) * scaleX,
        y: (event.touches[0].clientY - rect.top) * scaleY
      };
    }
    
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }, []);

  const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
    if (disabled) return;
    
    event.preventDefault();
    isDrawingRef.current = true;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, [disabled, getCoordinates]);

  const draw = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDrawingRef.current || disabled) return;
    
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(event);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    onSignatureChange?.(canvas.toDataURL());
  }, [disabled, getCoordinates, onSignatureChange]);

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [startDrawing, draw, stopDrawing]);

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`border-2 border-dashed border-border rounded-md bg-muted/30 cursor-crosshair ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{ width: '100%', maxWidth: `${width}px`, height: `${height}px` }}
        data-testid="signature-canvas"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={clearSignature}
        disabled={disabled}
        className="text-muted-foreground hover:text-destructive"
        data-testid="button-clear-signature"
      >
        <Eraser className="w-4 h-4 mr-1" />
        Limpar
      </Button>
    </div>
  );
}
