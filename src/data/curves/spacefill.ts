import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

/* ============================================================
   Space-Filling Curves / 空间填充曲线
   Peano Curve (3x3 recursive) & Hilbert Curve (recursive U-shape)
   ============================================================ */

// --- Module-level caches for Peano Curve ---
let cachedPeanoPoints: Array<{ x: number; y: number }> | null = null;
let cachedPeanoIter = 0;

function computePeanoPoints(iterations: number): Array<{ x: number; y: number }> {
  if (cachedPeanoPoints && cachedPeanoIter === iterations) {
    return cachedPeanoPoints;
  }
  const points: Array<{ x: number; y: number }> = [];
  function peano(x: number, y: number, size: number, iter: number) {
    if (iter === 0) {
      points.push({ x: x + size / 2, y: y + size / 2 });
      return;
    }
    const s = size / 3;
    const order = [[0, 0], [1, 0], [2, 0], [2, 1], [1, 1], [0, 1], [0, 2], [1, 2], [2, 2]];
    for (const [dx, dy] of order) peano(x + dx * s, y + dy * s, s, iter - 1);
  }
  peano(10, 10, 80, iterations);
  cachedPeanoPoints = points;
  cachedPeanoIter = iterations;
  return points;
}

// --- Module-level caches for Hilbert Curve ---
let cachedHilbertPoints: Array<{ x: number; y: number }> | null = null;
let cachedHilbertIter = 0;

function computeHilbertPoints(iterations: number): Array<{ x: number; y: number }> {
  if (cachedHilbertPoints && cachedHilbertIter === iterations) {
    return cachedHilbertPoints;
  }
  const points: Array<{ x: number; y: number }> = [];
  function hilbert(
    n: number,
    x: number,
    y: number,
    xi: number,
    xj: number,
    yi: number,
    yj: number,
  ) {
    if (n <= 0) {
      points.push({ x: x + (xi + yi) / 2, y: y + (xj + yj) / 2 });
    } else {
      hilbert(n - 1, x, y, yi / 2, yj / 2, xi / 2, xj / 2);
      hilbert(n - 1, x + xi / 2, y + xj / 2, xi / 2, xj / 2, yi / 2, yj / 2);
      hilbert(n - 1, x + xi / 2 + yi / 2, y + xj / 2 + yj / 2, xi / 2, xj / 2, yi / 2, yj / 2);
      hilbert(n - 1, x + xi / 2 + yi, y + xj / 2 + yj, -yi / 2, -yj / 2, -xi / 2, -xj / 2);
    }
  }
  hilbert(iterations, 10, 10, 80, 0, 0, 80);
  cachedHilbertPoints = points;
  cachedHilbertIter = iterations;
  return points;
}

/* ============================================================
   Curve 1: Peano Curve / 皮亚诺曲线
   ============================================================ */

export const peanoCurve: AnimationDef = {
  id: 'peano-curve',
  category: 'Exotic',
  categoryZh: '异形',
  name: 'Peano Curve',
  nameZh: '皮亚诺曲线',
  tag: 'Space-Filling Curve',
  params: [
    // --- Curve geometry ---
    { key: 'iterations', label: 'Iterations', labelZh: '迭代次数', type: 'range', min: 1, max: 5, step: 1, val: 3 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.25 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.15 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.05 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.5 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 1.8 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.08 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.6 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 270 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 30 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 80 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
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
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#a855f7' },
  ],
  formula(cfg) {
    const iterations = cfg.iterations as number;
    return [
      `Peano Space-Filling Curve`,
      `3\u00D73 recursive subdivision`,
      `Iterations: ${iterations}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const iterations = cfg.iterations as number;
    const points = computePeanoPoints(iterations);
    const idx = Math.floor(progress * (points.length - 1));
    const p = points[idx];
    const pulse = 1 + Math.sin((time % 5000) / 5000 * Math.PI * 2) * 0.05;
    return {
      x: 50 + (p.x - 50) * pulse,
      y: 50 + (p.y - 50) * pulse,
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
      fadePower: 0.6,
      baseRadius: 0.5,
      maxRadius: 1.8,
      minOpacity: 0.08,
    });
  },
  code(cfg) {
    const iterations = cfg.iterations as number;
    return `// Peano Curve (3\u00D73 recursive subdivision)
const points = [];
function peano(x, y, size, iter, pts) {
  if (iter === 0) { pts.push({x: x+size/2, y: y+size/2}); return; }
  const s = size / 3;
  const order = [[0,0],[1,0],[2,0],[2,1],[1,1],[0,1],[0,2],[1,2],[2,2]];
  for (const [dx, dy] of order) peano(x+dx*s, y+dy*s, s, iter-1, pts);
}
peano(10, 10, 80, ${iterations}, points);
const idx = Math.floor(progress * (points.length - 1));
const p = points[idx];
const pulse = 1 + Math.sin((time % 5000) / 5000 * Math.PI * 2) * 0.05;
return { x: 50 + (p.x - 50) * pulse, y: 50 + (p.y - 50) * pulse };`;
  },
};

/* ============================================================
   Curve 2: Hilbert Curve / 希尔伯特曲线
   ============================================================ */

export const hilbertCurve: AnimationDef = {
  id: 'hilbert-curve',
  category: 'Exotic',
  categoryZh: '异形',
  name: 'Hilbert Curve',
  nameZh: '希尔伯特曲线',
  tag: 'Continuous Space-Filling',
  params: [
    // --- Curve geometry ---
    { key: 'iterations', label: 'Iterations', labelZh: '迭代次数', type: 'range', min: 1, max: 6, step: 1, val: 4 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.25 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.15 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.05 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.5 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 1.8 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.08 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.6 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 160 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 30 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 80 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
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
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#14b8a6' },
  ],
  formula(cfg) {
    const iterations = cfg.iterations as number;
    return [
      `Hilbert Space-Filling Curve`,
      `Recursive U-shaped pattern`,
      `Iterations: ${iterations}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const iterations = cfg.iterations as number;
    const points = computeHilbertPoints(iterations);
    const idx = Math.floor(progress * (points.length - 1));
    const p = points[idx];
    const pulse = 1 + Math.sin((time % 5000) / 5000 * Math.PI * 2) * 0.05;
    return {
      x: 50 + (p.x - 50) * pulse,
      y: 50 + (p.y - 50) * pulse,
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
      fadePower: 0.6,
      baseRadius: 0.5,
      maxRadius: 1.8,
      minOpacity: 0.08,
    });
  },
  code(cfg) {
    const iterations = cfg.iterations as number;
    return `// Hilbert Curve (recursive U-shaped pattern)
const points = [];
function hilbert(n, x, y, xi, xj, yi, yj, pts) {
  if (n <= 0) { pts.push({x: x+(xi+yi)/2, y: y+(xj+yj)/2}); }
  else {
    hilbert(n-1, x, y, yi/2, yj/2, xi/2, xj/2, pts);
    hilbert(n-1, x+xi/2, y+xj/2, xi/2, xj/2, yi/2, yj/2, pts);
    hilbert(n-1, x+xi/2+yi/2, y+xj/2+yj/2, xi/2, xj/2, yi/2, yj/2, pts);
    hilbert(n-1, x+xi/2+yi, y+xj/2+yj, -yi/2, -yj/2, -xi/2, -xj/2, pts);
  }
}
hilbert(${iterations}, 10, 10, 80, 0, 0, 80, points);
const idx = Math.floor(progress * (points.length - 1));
const p = points[idx];
const pulse = 1 + Math.sin((time % 5000) / 5000 * Math.PI * 2) * 0.05;
return { x: 50 + (p.x - 50) * pulse, y: 50 + (p.y - 50) * pulse };`;
  },
};
