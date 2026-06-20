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

  return (
    <section>
      <div className="canvas-wrap">
        <div className="canvas-box">
          <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <defs />
            <g ref={groupRef}>
              <path
                ref={pathRef}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.1"
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
