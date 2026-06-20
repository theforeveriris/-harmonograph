import { useState, useCallback } from 'react';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import type { AnimationDef, LiveConfig } from '../types';

interface UseGifExportOptions {
  animation: AnimationDef;
  liveConfig: LiveConfig;
}

interface UseGifExportReturn {
  exporting: boolean;
  progress: number;
  exportGif: (options?: { width?: number; frames?: number; fps?: number }) => void;
}

export function useGifExport({ animation, liveConfig }: UseGifExportOptions): UseGifExportReturn {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const exportGif = useCallback(
    (options?: { width?: number; frames?: number; fps?: number }) => {
      const size = options?.width || 420;
      const totalFrames = options?.frames || 60;
      const fps = options?.fps || 20;
      const durationMs = (liveConfig.durationMs as number) || 7000;

      setExporting(true);
      setProgress(0);

      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      const bgColor = (liveConfig.backgroundColor as string) || '#050505';
      const strokeWidth = (liveConfig.strokeWidth as number) || 2.5;
      const pathOpacity = (liveConfig.pathOpacity as number) || 0.15;
      const zoom = (liveConfig.zoom as number) || 1;
      const particleCount = (liveConfig.particleCount as number) || 100;
      const hueBase = (liveConfig.hueBase as number) ?? 280;
      const hueSpeed = (liveConfig.hueSpeed as number) ?? 8;
      const hueSpread = (liveConfig.hueSpread as number) ?? 60;
      const satBase = (liveConfig.satBase as number) ?? 70;
      const satRange = (liveConfig.satRange as number) ?? 30;
      const lightBase = (liveConfig.lightBase as number) ?? 67;
      const lightRange = (liveConfig.lightRange as number) ?? 18;
      const rotationSpeed = (liveConfig.rotationSpeed as number) ?? 1;
      const direction = (liveConfig.animationDirection as number) ?? 1;

      const vb = `${(50 - 50 * zoom).toFixed(1)} ${(50 - 50 * zoom).toFixed(1)} ${(100 * zoom).toFixed(1)} ${(100 * zoom).toFixed(1)}`;

      const gif = GIFEncoder();
      const delay = Math.round(1000 / fps);

      let frameIndex = 0;

      const renderFrame = () => {
        if (frameIndex >= totalFrames) {
          gif.finish();
          const bytes = gif.bytes();
          const blob = new Blob([new Uint8Array(bytes)], { type: 'image/gif' });
          triggerDownload(blob, `${animation.id}.gif`);
          setExporting(false);
          setProgress(100);
          setTimeout(() => setProgress(0), 1500);
          return;
        }

        const fraction = frameIndex / totalFrames;
        const time = fraction * durationMs;
        const effectiveTime = direction < 0 ? -time : time;
        const t = time / 1000;

        // Build SVG for this frame
        const rot = animation.getRotation(effectiveTime, liveConfig) * rotationSpeed;
        const rotAttr = rot !== 0 ? ` transform="rotate(${rot.toFixed(2)} 50 50)"` : '';

        const steps = Math.max(60, Math.round((liveConfig.pathResolution as number) || 360));
        const pathD = animation.buildPath(effectiveTime, liveConfig, steps);

        // Path color (HSL cycling)
        const h = (hueBase + t * hueSpeed) % 360;
        const s = satBase + Math.sin(t * 1.3) * satRange;
        const l = lightBase + Math.cos(t * 0.9) * lightRange;
        const pathColor = `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`;

        // Breathing opacity
        const breathSpeed = (liveConfig.pathBreathingSpeed as number) ?? 1.5;
        const breathe = 0.5 + Math.sin(t * breathSpeed) * 0.25;
        const currentPathOpacity = Math.max(0.08, breathe * pathOpacity * 0.9);

        // Particles
        const progress = (time % durationMs) / durationMs;
        let particlesSVG = '';
        for (let i = 0; i < particleCount; i++) {
          const particle = animation.getParticle(i, progress, time, liveConfig);
          const tailOffset = i / (particleCount - 1);
          const ph = (hueBase + t * hueSpeed + tailOffset * hueSpread) % 360;
          const ps = satBase + Math.sin(t * 1.3 + tailOffset * 4) * satRange;
          const pl = lightBase + Math.cos(t * 0.9 + tailOffset * 3) * lightRange;
          const fillColor = particle.color || `hsl(${ph.toFixed(1)}, ${ps.toFixed(1)}%, ${pl.toFixed(1)}%)`;
          particlesSVG += `  <circle cx="${particle.x.toFixed(2)}" cy="${particle.y.toFixed(2)}" r="${particle.radius.toFixed(2)}" fill="${fillColor}" opacity="${particle.opacity.toFixed(3)}" />\n`;
        }

        const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${size}" height="${size}">
  <rect width="100%" height="100%" fill="${bgColor}" />
  <g${rotAttr}>
    <path d="${pathD}" stroke="${pathColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="${currentPathOpacity.toFixed(3)}" />
${particlesSVG}  </g>
</svg>`;

        const img = new Image();
        const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          ctx.clearRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          URL.revokeObjectURL(url);

          // Get RGBA pixel data from canvas
          const imageData = ctx.getImageData(0, 0, size, size);
          const rgba = imageData.data;

          // Quantize colors and apply palette
          const palette = quantize(rgba, 256);
          const index = applyPalette(rgba, palette);

          // Write frame to GIF
          gif.writeFrame(index, size, size, { palette, delay, repeat: 0 });

          frameIndex++;
          setProgress(Math.round((frameIndex / totalFrames) * 100));
          // Use setTimeout to avoid blocking the UI
          setTimeout(renderFrame, 0);
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          console.error('GIF export: failed to render SVG frame', frameIndex);
          frameIndex++;
          setProgress(Math.round((frameIndex / totalFrames) * 100));
          setTimeout(renderFrame, 0);
        };
        img.src = url;
      };

      // Start rendering frames
      renderFrame();
    },
    [animation, liveConfig],
  );

  return { exporting, progress, exportGif };
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
