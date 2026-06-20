import { useRef, useCallback, useEffect } from 'react';
import type { AnimationDef, LiveConfig } from '../types';

interface UseAnimationOptions {
  animation: AnimationDef | null;
  liveConfig: LiveConfig;
}

interface UseAnimationReturn {
  groupRef: React.RefObject<SVGGElement | null>;
  pathRef: React.RefObject<SVGPathElement | null>;
}

export function useAnimation({ animation, liveConfig }: UseAnimationOptions): UseAnimationReturn {
  const groupRef = useRef<SVGGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const startedAtRef = useRef(performance.now());
  const animIdRef = useRef<number>(0);

  // Reset start time when animation changes
  useEffect(() => {
    startedAtRef.current = performance.now();
  }, [animation?.id]);

  const render = useCallback(
    (now: number) => {
      if (!animation || !pathRef.current || !groupRef.current) return;

      const time = now - startedAtRef.current;

      const rot = animation.getRotation(time, liveConfig);
      if (rot !== 0) {
        groupRef.current.setAttribute('transform', `rotate(${rot} 50 50)`);
      } else {
        groupRef.current.removeAttribute('transform');
      }

      pathRef.current.setAttribute('d', animation.buildPath(time, liveConfig));

      // Dynamic path opacity (breathing effect)
      const pathOpacity = liveConfig.pathOpacity as number;
      if (pathOpacity !== undefined) {
        const t = time / 1000;
        const breathe = 0.5 + Math.sin(t * 1.5) * 0.25;
        const op = Math.max(0.08, breathe * pathOpacity * 0.9);
        pathRef.current.setAttribute('opacity', op.toFixed(3));
      }

      // Dynamic path stroke color (HSL cycling)
      if (liveConfig.hueBase !== undefined) {
        const t = time / 1000;
        const hueBase = liveConfig.hueBase as number;
        const hueSpeed = (liveConfig.hueSpeed as number) ?? 8;
        const satBase = (liveConfig.satBase as number) ?? 70;
        const satRange = (liveConfig.satRange as number) ?? 30;
        const lightBase = (liveConfig.lightBase as number) ?? 67;
        const lightRange = (liveConfig.lightRange as number) ?? 18;
        const h = (hueBase + t * hueSpeed) % 360;
        const s = satBase + Math.sin(t * 1.3) * satRange;
        const l = lightBase + Math.cos(t * 0.9) * lightRange;
        pathRef.current.setAttribute('stroke', `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`);
      }

      animIdRef.current = requestAnimationFrame(render);
    },
    [animation, liveConfig],
  );

  useEffect(() => {
    animIdRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animIdRef.current);
    };
  }, [render]);

  return { groupRef, pathRef };
}
