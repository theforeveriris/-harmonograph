import { useRef, useEffect, useCallback } from 'react';
import type { AnimationDef, LiveConfig } from '../types';
import { hexToHue } from '../data/utils';

interface UseParticlesOptions {
  animation: AnimationDef | null;
  liveConfig: LiveConfig;
}

export function useParticles({ animation, liveConfig }: UseParticlesOptions) {
  const containerRef = useRef<SVGGElement | null>(null);
  const particlesRef = useRef<SVGCircleElement[]>([]);
  const startedAtRef = useRef(performance.now());
  const animIdRef = useRef<number>(0);

  useEffect(() => {
    startedAtRef.current = performance.now();
  }, [animation?.id]);

  // Create/remove particle DOM elements when animation or count changes
  useEffect(() => {
    if (!animation || !containerRef.current) return;

    const count = (liveConfig.particleCount as number) || 100;
    const color = (liveConfig.color as string) || '#f5f5f5';
    const baseHue = hexToHue(color);

    // Remove old particles
    particlesRef.current.forEach((el) => el.remove());
    particlesRef.current = [];

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const newParticles: SVGCircleElement[] = [];

    for (let i = 0; i < count; i++) {
      const circle = document.createElementNS(SVG_NS, 'circle');
      // Use HSL dynamic color if hueBase is in config, otherwise static
      if (liveConfig.hueBase !== undefined) {
        circle.setAttribute('fill', 'hsl(280, 70%, 65%)');
      } else {
        const hue = baseHue + (i / count) * 40 - 20;
        circle.setAttribute('fill', `hsl(${hue}, 80%, 65%)`);
      }
      containerRef.current.appendChild(circle);
      newParticles.push(circle);
    }

    particlesRef.current = newParticles;

    return () => {
      newParticles.forEach((el) => el.remove());
    };
  }, [animation?.id, liveConfig.particleCount, liveConfig.color, liveConfig.hueBase]);

  const render = useCallback(
    (now: number) => {
      if (!animation || particlesRef.current.length === 0) return;

      const time = now - startedAtRef.current;
      const duration = (liveConfig.durationMs as number) || 5000;
      const progress = (time % duration) / duration;
      const count = particlesRef.current.length;

      for (let i = 0; i < count; i++) {
        const particle = animation.getParticle(i, progress, time, liveConfig);
        const el = particlesRef.current[i];
        if (el) {
          el.setAttribute('cx', particle.x.toFixed(2));
          el.setAttribute('cy', particle.y.toFixed(2));
          el.setAttribute('r', particle.radius.toFixed(2));
          el.setAttribute('opacity', particle.opacity.toFixed(3));
          if (particle.color) {
            el.setAttribute('fill', particle.color);
          }
        }
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

  return { containerRef };
}
