import { useMemo } from 'react';
import type { AnimationDef, LiveConfig } from '../types';
import { useAnimation } from '../hooks/useAnimation';
import { useParticles } from '../hooks/useParticles';

interface CanvasProps {
  animation: AnimationDef;
  liveConfig: LiveConfig;
}

export function Canvas({ animation, liveConfig }: CanvasProps) {
  const { groupRef, pathRef } = useAnimation({ animation, liveConfig });
  const { containerRef: particlesGroupRef } = useParticles({ animation, liveConfig });

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
      </div>
      <div className="canvas-meta">
        <div className="canvas-title">{animation.name}</div>
        <div className="canvas-tag">{animation.tag}</div>
      </div>
    </section>
  );
}
