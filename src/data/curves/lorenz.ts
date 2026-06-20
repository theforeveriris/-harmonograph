import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

/* ============================================================
   Lorenz Attractor / 洛伦兹吸引子
   混沌理论蝴蝶效应，Euler积分预计算 + 旋转透视投影
   ============================================================ */

// Module-level cache for precomputed Lorenz points
let cachedPoints: Array<{ x: number; y: number; z: number }> | null = null;
let cachedSigma = 0;
let cachedRho = 0;
let cachedBeta = 0;

function computeLorenzPoints(sigma: number, rho: number, beta: number): Array<{ x: number; y: number; z: number }> {
  if (cachedPoints && cachedSigma === sigma && cachedRho === rho && cachedBeta === beta) {
    return cachedPoints;
  }
  const steps = 3000;
  const dt = 0.008;
  const skip = 100;
  const points: Array<{ x: number; y: number; z: number }> = [];
  let x = 0.1, y = 0, z = 0;
  for (let i = 0; i < steps; i++) {
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;
    x += dx;
    y += dy;
    z += dz;
    if (i >= skip) {
      points.push({ x, y, z });
    }
  }
  cachedPoints = points;
  cachedSigma = sigma;
  cachedRho = rho;
  cachedBeta = beta;
  return points;
}

export const lorenzAttractor: AnimationDef = {
  id: 'lorenz-attractor',
  category: 'Exotic',
  categoryZh: '异形',
  name: 'Lorenz Attractor',
  nameZh: '洛伦兹吸引子',
  tag: 'Chaos Theory Butterfly',
  params: [
    // --- Curve geometry ---
    { key: 'sigma', label: 'Sigma', labelZh: 'σ (Sigma)', type: 'range', min: 5, max: 15, step: 1, val: 10 },
    { key: 'rho', label: 'Rho', labelZh: 'ρ (Rho)', type: 'range', min: 15, max: 35, step: 1, val: 28 },
    { key: 'beta', label: 'Beta', labelZh: 'β (Beta)', type: 'range', min: 1, max: 5, step: 0.1, val: 2.667 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 3, step: 0.1, val: 1.8 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 150 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.9 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.7 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.04 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.56 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 30 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 30 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 90 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 60 },
    // --- Animation Control ---
    { key: 'rotationSpeed', label: 'Rotation Speed', labelZh: '旋转速度', type: 'range', min: 0, max: 5, step: 0.1, val: 1 },
    { key: 'pathBreathingSpeed', label: 'Breathing Speed', labelZh: '呼吸速度', type: 'range', min: 0.1, max: 5, step: 0.1, val: 1.5 },
    { key: 'pathResolution', label: 'Path Resolution', labelZh: '路径精度', type: 'range', min: 60, max: 800, step: 10, val: 360 },
    { key: 'animationDirection', label: 'Direction', labelZh: '动画方向', type: 'range', min: -1, max: 1, step: 1, val: 1 },
    // --- Visual Enhancement ---
    { key: 'satRange', label: 'Saturation Range', labelZh: '饱和度范围', type: 'range', min: 0, max: 40, step: 1, val: 30 },
    { key: 'lightRange', label: 'Lightness Range', labelZh: '亮度范围', type: 'range', min: 0, max: 30, step: 1, val: 18 },
    { key: 'pathGlow', label: 'Path Glow', labelZh: '路径辉光', type: 'range', min: 0, max: 5, step: 0.5, val: 0 },
    // --- Global ---
    { key: 'zoom', label: 'Zoom', labelZh: '缩放', type: 'range', min: 0.3, max: 3, step: 0.1, val: 1 },
    { key: 'backgroundColor', label: 'Background', labelZh: '背景色', type: 'color', val: '#050505' },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#f59e0b' },
  ],
  formula(cfg) {
    const sigma = cfg.sigma as number;
    const rho = cfg.rho as number;
    const beta = cfg.beta as number;
    return [
      `dx/dt = σ(y - x)`,
      `dy/dt = x(ρ - z) - y`,
      `dz/dt = xy - βz`,
      `σ=${sigma}, ρ=${rho}, β=${beta}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const sigma = cfg.sigma as number;
    const rho = cfg.rho as number;
    const beta = cfg.beta as number;
    const scale = cfg.scale as number;
    const points = computeLorenzPoints(sigma, rho, beta);
    const idx = Math.floor(progress * (points.length - 1));
    const p = points[idx];
    const rot = ((time % 30000) / 30000) * Math.PI * 2;
    const xr = p.x * Math.cos(rot) + p.z * Math.sin(rot);
    const zr = -p.x * Math.sin(rot) + p.z * Math.cos(rot);
    const perspective = 40 / (40 + zr * 0.1);
    return {
      x: 50 + xr * scale * perspective,
      y: 50 + p.y * scale * perspective - 20,
      depth: zr,
    };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.5,
      baseRadius: 0.7,
      maxRadius: 2.3,
      minOpacity: 0.06,
      depthAware: true,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    const sigma = cfg.sigma as number;
    const rho = cfg.rho as number;
    const beta = cfg.beta as number;
    const scale = cfg.scale as number;
    return `// Lorenz system (precomputed via Euler integration)
const sigma = ${sigma}, rho = ${rho}, beta = ${beta};
const scale = ${scale};
const steps = 3000, dt = 0.008, skip = 100;
const pts = [];
let lx = 0.1, ly = 0, lz = 0;
for (let i = 0; i < steps; i++) {
  lx += sigma * (ly - lx) * dt;
  ly += (lx * (rho - lz) - ly) * dt;
  lz += (lx * ly - beta * lz) * dt;
  if (i >= skip) pts.push({ x: lx, y: ly, z: lz });
}
const idx = Math.floor(progress * (pts.length - 1));
const p = pts[idx];
const rot = ((time % 30000) / 30000) * Math.PI * 2;
const xr = p.x * Math.cos(rot) + p.z * Math.sin(rot);
const zr = -p.x * Math.sin(rot) + p.z * Math.cos(rot);
const perspective = 40 / (40 + zr * 0.1);
return {
  x: 50 + xr * scale * perspective,
  y: 50 + p.y * scale * perspective - 20,
  depth: zr
};`;
  },
};
