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
