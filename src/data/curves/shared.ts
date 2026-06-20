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

/** Compute HSL color for a particle based on time and position */
export function particleHSL(
  time: number,
  tailOffset: number,
  cfg: LiveConfig,
): string {
  const hueBase = (cfg.hueBase as number) ?? 280;
  const hueSpeed = (cfg.hueSpeed as number) ?? 8;
  const hueSpread = (cfg.hueSpread as number) ?? 60;
  const satBase = (cfg.satBase as number) ?? 70;
  const satRange = (cfg.satRange as number) ?? 30;
  const lightBase = (cfg.lightBase as number) ?? 67;
  const lightRange = (cfg.lightRange as number) ?? 18;

  const t = time / 1000;
  const h = (hueBase + t * hueSpeed + tailOffset * hueSpread) % 360;
  const s = satBase + Math.sin(t * 1.3 + tailOffset * 4) * satRange;
  const l = lightBase + Math.cos(t * 0.9 + tailOffset * 3) * lightRange;
  return `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`;
}

/** Compute particle appearance with configurable fade and depth options */
export function getParticleGeneric(
  pointFn: (progress: number, time: number, cfg: LiveConfig) => { x: number; y: number; depth?: number },
  index: number,
  progress: number,
  time: number,
  cfg: LiveConfig,
  opts?: {
    fadePower?: number;
    baseRadius?: number;
    maxRadius?: number;
    minOpacity?: number;
    depthAware?: boolean;
    pulseAmount?: number;
    pulseSpeed?: number;
  },
): { x: number; y: number; radius: number; opacity: number; color?: string } {
  // Read from cfg first (user-adjustable), fall back to opts
  const fadePower = (cfg.particleFadePower as number) ?? opts?.fadePower ?? 0.56;
  const baseRadius = (cfg.particleBaseRadius as number) ?? opts?.baseRadius ?? 0.9;
  const maxRadius = (cfg.particleMaxRadius as number) ?? opts?.maxRadius ?? 2.7;
  const minOpacity = (cfg.particleMinOpacity as number) ?? opts?.minOpacity ?? 0.04;
  const depthAware = opts?.depthAware ?? false;
  const pulseAmount = (cfg.particlePulse as number) ?? opts?.pulseAmount ?? 0;
  const pulseSpeed = (cfg.particlePulseSpeed as number) ?? opts?.pulseSpeed ?? 3;

  const normalizeProgress = (p: number) => ((p % 1) + 1) % 1;
  const count = (cfg.particleCount as number) || 100;
  const tailOffset = index / (count - 1);
  const trailSpan = cfg.trailSpan as number;
  const pt = pointFn(normalizeProgress(progress - tailOffset * trailSpan), time, cfg);
  const fade = Math.pow(1 - tailOffset, fadePower);

  let radius = baseRadius + fade * maxRadius;
  let opacity = minOpacity + fade * (1 - minOpacity);

  // Particle pulsing
  if (pulseAmount > 0) {
    const t = time / 1000;
    const pulse = 1 + Math.sin(t * pulseSpeed + index * 0.3) * pulseAmount;
    radius *= pulse;
    opacity *= (0.7 + Math.sin(t * 1.2 + tailOffset * 2) * 0.3);
  }

  if (depthAware && pt.depth !== undefined) {
    const depthScale = 0.7 + (pt.depth + 3) / 6 * 0.6;
    radius *= depthScale;
    opacity *= depthScale;
  }

  // Dynamic HSL color if hueBase is defined in config
  const useHSL = cfg.hueBase !== undefined;
  const color = useHSL ? particleHSL(time, tailOffset, cfg) : undefined;

  return { x: pt.x, y: pt.y, radius, opacity, color };
}
