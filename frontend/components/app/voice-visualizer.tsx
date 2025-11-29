'use client';

import { useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
  side: 'left' | 'right';
}

export function VoiceVisualizer({ isActive, side }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let animationId: number;
    let phase = 0;
    let amplitude = 0;
    let targetAmplitude = 0;

    const draw = () => {
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isActive) {
        // Simulate voice intensity
        if (Math.random() > 0.97) {
          targetAmplitude = 20 + Math.random() * 30;
        }
        amplitude += (targetAmplitude - amplitude) * 0.1;
        targetAmplitude *= 0.96;

        // Draw multiple wave layers for Siri effect
        const numWaves = 5;
        
        for (let wave = 0; wave < numWaves; wave++) {
          const waveOpacity = 0.3 - (wave * 0.05);
          const waveAmplitude = amplitude * (1 - wave * 0.15);
          const waveFrequency = 3 + wave * 0.5;
          const waveSpeed = 0.02 + wave * 0.005;

          // Gradient for each wave
          const gradient = ctx.createLinearGradient(0, 0, width, 0);
          if (side === 'left') {
            gradient.addColorStop(0, `rgba(139, 92, 246, ${waveOpacity})`);
            gradient.addColorStop(0.33, `rgba(236, 72, 153, ${waveOpacity})`);
            gradient.addColorStop(0.66, `rgba(251, 146, 60, ${waveOpacity})`);
            gradient.addColorStop(1, `rgba(234, 179, 8, ${waveOpacity})`);
          } else {
            gradient.addColorStop(0, `rgba(234, 179, 8, ${waveOpacity})`);
            gradient.addColorStop(0.33, `rgba(251, 146, 60, ${waveOpacity})`);
            gradient.addColorStop(0.66, `rgba(236, 72, 153, ${waveOpacity})`);
            gradient.addColorStop(1, `rgba(139, 92, 246, ${waveOpacity})`);
          }

          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          // Draw smooth sine wave
          for (let x = 0; x <= width; x += 0.5) {
            const angle = (x / width) * Math.PI * 2 * waveFrequency;
            const y = centerY + 
              Math.sin(angle - phase * waveSpeed) * waveAmplitude +
              Math.sin(angle * 2 + phase * waveSpeed * 1.5) * (waveAmplitude * 0.3);
            
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.stroke();
        }

        phase += 1;
      } else {
        // Idle - flat line
        amplitude *= 0.9;
        
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        if (side === 'left') {
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
          gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.2)');
          gradient.addColorStop(1, 'rgba(251, 146, 60, 0.2)');
        } else {
          gradient.addColorStop(0, 'rgba(251, 146, 60, 0.2)');
          gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.2)');
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0.2)');
        }
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, side]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-32"
      style={{ 
        width: '100%',
        height: '128px',
      }}
    />
  );
}
