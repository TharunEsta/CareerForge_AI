import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isRecording?: boolean;
  isPlaying?: boolean;
  audioData?: number[];
  className?: string;
}

export default function WaveformVisualizer({ 
  isRecording = false, 
  isPlaying = false, 
  audioData = [], 
  className = "" 
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barCount = 50;
      const barWidth = canvas.width / barCount;
      const centerY = canvas.height / 2;

      for (let i = 0; i < barCount; i++) {
        let height;
        if (isRecording || isPlaying) {
          // Animated waveform
          height = Math.random() * 40 + 10;
          if (isRecording) {
            height *= 1.5; // Make recording bars taller
          }
        } else {
          // Static waveform
          height = audioData[i] || Math.random() * 20 + 5;
        }

        const x = i * barWidth;
        const y = centerY - height / 2;

        // Gradient based on activity
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        if (isRecording) {
          gradient.addColorStop(0, '#ef4444');
          gradient.addColorStop(1, '#dc2626');
        } else if (isPlaying) {
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(1, '#1d4ed8');
        } else {
          gradient.addColorStop(0, '#6b7280');
          gradient.addColorStop(1, '#4b5563');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, height);
      }

      if (isRecording || isPlaying) {
        animationRef.current = requestAnimationFrame(drawWaveform);
      }
    };

    drawWaveform();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, isPlaying, audioData]);

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={300}
        height={80}
        className="border border-gray-300 rounded-lg bg-gray-50"
      />
      <div className="ml-4 text-sm text-gray-600">
        {isRecording && <span className="text-red-600">Recording...</span>}
        {isPlaying && <span className="text-blue-600">Playing...</span>}
        {!isRecording && !isPlaying && <span>Ready</span>}
      </div>
    </div>
  );
} 
