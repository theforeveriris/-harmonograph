import type { LiveConfig } from '../../types';

/** Build an SVG path string by sampling points along a curve */
export function buildPathGeneric(
  pointFn: (progress: number, time: number, cfg: LiveConfig) => { x: number; y: number },
  time: number,
  cfg: LiveConfig,
  steps: number,
): string {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const pt = pointFn(i / steps, time, cfg);
    return `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
  }).join(' ');
}

/** Compute particle appearance with configurable fade and depth options */
export function getParticleGeneric(
  pointFn: (progress: number, time: number, cfg: LiveConfig) => { x: number; y: number; depth?: number },
  index: number,
  progress: number,
  time: number,
  cfg: LiveConfig,
  opts?: { fadePower?: number; baseRadius?: number; maxRadius?: number; minOpacity?: number; depthAware?: boolean },
): { x: number; y: number; radius: number; opacity: number } {
  const {
    fadePower = 0.56,
    baseRadius = 0.9,
    maxRadius = 2.7,
    minOpacity = 0.04,
    depthAware = false,
  } = opts || {};

  const normalizeProgress = (p: number) => ((p % 1) + 1) % 1;
  const tailOffset = index / ((cfg.particleCount as number) - 1);
  const trailSpan = cfg.trailSpan as number;
  const pt = pointFn(normalizeProgress(progress - tailOffset * trailSpan), time, cfg);
  const fade = Math.pow(1 - tailOffset, fadePower);

  let radius = baseRadius + fade * maxRadius;
  let opacity = minOpacity + fade * (1 - minOpacity);

  if (depthAware && pt.depth !== undefined) {
    const depthScale = 0.7 + (pt.depth + 3) / 6 * 0.6;
    radius *= depthScale;
    opacity *= depthScale;
  }

  return { x: pt.x, y: pt.y, radius, opacity };
}
