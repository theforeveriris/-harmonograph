import { useMemo, useState } from 'react';
import type { AnimationDef, LiveConfig } from '../types';
import { useAnimation } from '../hooks/useAnimation';
import { useParticles } from '../hooks/useParticles';
import { useGifExport } from '../hooks/useGifExport';

interface CanvasProps {
  animation: AnimationDef;
  liveConfig: LiveConfig;
}

export function Canvas({ animation, liveConfig }: CanvasProps) {
  const { groupRef, pathRef } = useAnimation({ animation, liveConfig });
  const { containerRef: particlesGroupRef } = useParticles({ animation, liveConfig });
  const { exporting, progress, exportGif } = useGifExport({ animation, liveConfig });
  const [showGifOptions, setShowGifOptions] = useState(false);
  const [gifFrames, setGifFrames] = useState(60);
  const [gifFps, setGifFps] = useState(20);

  const strokeWidth = useMemo(
    () => String((liveConfig.strokeWidth as number) || 3),
    [liveConfig.strokeWidth],
  );
  const strokeColor = useMemo(
    () => (liveConfig.color as string) || '#f5f5f5',
    [liveConfig.color],
  );

  const bgColor = (liveConfig.backgroundColor as string) || '#050505';
  const zoom = (liveConfig.zoom as number) || 1;

  return (
    <section>
      <div className="canvas-wrap">
        <div className="canvas-box" style={{ background: bgColor }}>
          <svg
            viewBox={`${50 - 50 * zoom} ${50 - 50 * zoom} ${100 * zoom} ${100 * zoom}`}
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <filter id="pathGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g ref={groupRef}>
              <path
                ref={pathRef}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g ref={particlesGroupRef} />
            </g>
          </svg>
        </div>
        <div className="canvas-actions">
          <button
            className="gif-export-btn"
            onClick={() => setShowGifOptions(!showGifOptions)}
            disabled={exporting}
          >
            {exporting ? `Exporting ${progress}%...` : 'Export GIF'}
          </button>
          {showGifOptions && (
            <div className="gif-options">
              <div className="gif-option-row">
                <label>Frames / 帧数</label>
                <input
                  type="range"
                  min={20}
                  max={120}
                  step={5}
                  value={gifFrames}
                  onChange={(e) => setGifFrames(Number(e.target.value))}
                />
                <span>{gifFrames}</span>
              </div>
              <div className="gif-option-row">
                <label>FPS</label>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={gifFps}
                  onChange={(e) => setGifFps(Number(e.target.value))}
                />
                <span>{gifFps}</span>
              </div>
              <button
                className="gif-start-btn"
                onClick={() => {
                  setShowGifOptions(false);
                  exportGif({ frames: gifFrames, fps: gifFps });
                }}
              >
                Start Export / 开始导出
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="canvas-meta">
        <div className="canvas-title">{animation.name}</div>
        <div className="canvas-tag">{animation.tag}</div>
      </div>
    </section>
  );
}
