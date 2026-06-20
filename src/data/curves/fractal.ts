import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

/* ============================================================
   Sierpinski Triangle / 谢尔宾斯基三角形
   Chaos Game 分形算法，随机迭代预计算
   ============================================================ */

// Module-level cache for precomputed Sierpinski points
let sierpinskiCachedPoints: Array<{ x: number; y: number }> | null = null;
let sierpinskiCachedIterations = 0;

function computeSierpinskiPoints(iterations: number): Array<{ x: number; y: number }> {
  if (sierpinskiCachedPoints && sierpinskiCachedIterations === iterations) {
    return sierpinskiCachedPoints;
  }
  const vertices = [
    { x: 50, y: 10 },
    { x: 10, y: 90 },
    { x: 90, y: 90 },
  ];
  const points: Array<{ x: number; y: number }> = [];
  let px = 50;
  let py = 50;
  const skip = 20;
  for (let i = 0; i < iterations; i++) {
    const v = vertices[Math.floor(Math.random() * 3)];
    px = (px + v.x) / 2;
    py = (py + v.y) / 2;
    if (i >= skip) {
      points.push({ x: px, y: py });
    }
  }
  sierpinskiCachedPoints = points;
  sierpinskiCachedIterations = iterations;
  return points;
}

export const sierpinskiTriangle: AnimationDef = {
  id: 'sierpinski-triangle',
  category: 'Exotic',
  categoryZh: '异形',
  name: 'Sierpinski Triangle',
  nameZh: '谢尔宾斯基三角形',
  tag: 'Chaos Game Fractal',
  params: [
    // --- Curve-specific ---
    { key: 'iterations', label: 'Iterations', labelZh: '迭代次数', type: 'range', min: 1000, max: 20000, step: 500, val: 8000 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.3 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 7000 },
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
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 35 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 20 },
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
    const iterations = cfg.iterations as number;
    return [
      `Chaos Game Algorithm`,
      `1. Pick random vertex`,
      `2. Move halfway to it`,
      `3. Repeat ${iterations} times`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const iterations = cfg.iterations as number;
    const points = computeSierpinskiPoints(iterations);
    const idx = Math.floor(progress * (points.length - 1));
    const p = points[idx];
    const pulseDurationMs = cfg.durationMs as number;
    const pulse = 1 + Math.sin((time % pulseDurationMs) / pulseDurationMs * Math.PI * 2) * 0.05;
    const cx = 50;
    const cy = 50;
    return {
      x: cx + (p.x - cx) * pulse,
      y: cy + (p.y - cy) * pulse,
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
    return `// Sierpinski Triangle — Chaos Game
const vertices = [
  { x: 50, y: 10 },
  { x: 10, y: 90 },
  { x: 90, y: 90 }
];
let px = 50, py = 50;
const points = [];
const iterations = ${iterations};
const skip = 20;
for (let i = 0; i < iterations; i++) {
  const v = vertices[Math.floor(Math.random() * 3)];
  px = (px + v.x) / 2;
  py = (py + v.y) / 2;
  if (i >= skip) points.push({ x: px, y: py });
}
const idx = Math.floor(progress * (points.length - 1));
const p = points[idx];
const pulse = 1 + Math.sin((time % 5000) / 5000 * Math.PI * 2) * 0.05;
return { x: 50 + (p.x - 50) * pulse, y: 50 + (p.y - 50) * pulse };`;
  },
};

/* ============================================================
   Koch Snowflake / 科赫雪花
   递归Koch曲线构造，等边三角形三条边
   ============================================================ */

// Module-level cache for precomputed Koch points
let kochCachedPoints: Array<{ x: number; y: number }> | null = null;
let kochCachedIterations = 0;
let kochCachedSize = 0;

function kochLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  depth: number,
  points: Array<{ x: number; y: number }>,
): void {
  if (depth === 0) {
    points.push({ x: x2, y: y2 });
    return;
  }
  const dx = x2 - x1;
  const dy = y2 - y1;
  const ax = x1 + dx / 3;
  const ay = y1 + dy / 3;
  const bx = x1 + (2 * dx) / 3;
  const by = y1 + (2 * dy) / 3;
  const px = ax + (dx / 3) * Math.cos(-Math.PI / 3) - (dy / 3) * Math.sin(-Math.PI / 3);
  const py = ay + (dx / 3) * Math.sin(-Math.PI / 3) + (dy / 3) * Math.cos(-Math.PI / 3);
  kochLine(x1, y1, ax, ay, depth - 1, points);
  kochLine(ax, ay, px, py, depth - 1, points);
  kochLine(px, py, bx, by, depth - 1, points);
  kochLine(bx, by, x2, y2, depth - 1, points);
}

function computeKochPoints(iterations: number, size: number): Array<{ x: number; y: number }> {
  if (kochCachedPoints && kochCachedIterations === iterations && kochCachedSize === size) {
    return kochCachedPoints;
  }
  const cx = 50;
  const cy = 50;
  const h = size * Math.sqrt(3) / 2;
  const v1 = { x: cx, y: cy - h * 2 / 3 };
  const v2 = { x: cx - size / 2, y: cy + h / 3 };
  const v3 = { x: cx + size / 2, y: cy + h / 3 };

  const side1: Array<{ x: number; y: number }> = [{ x: v1.x, y: v1.y }];
  kochLine(v1.x, v1.y, v2.x, v2.y, iterations, side1);

  const side2: Array<{ x: number; y: number }> = [];
  kochLine(v2.x, v2.y, v3.x, v3.y, iterations, side2);

  const side3: Array<{ x: number; y: number }> = [];
  kochLine(v3.x, v3.y, v1.x, v1.y, iterations, side3);

  // Combine 3 sides, removing duplicate points between sides
  const points = [...side1, ...side2.slice(1), ...side3.slice(1)];

  kochCachedPoints = points;
  kochCachedIterations = iterations;
  kochCachedSize = size;
  return points;
}

export const kochSnowflake: AnimationDef = {
  id: 'koch-snowflake',
  category: 'Exotic',
  categoryZh: '异形',
  name: 'Koch Snowflake',
  nameZh: '科赫雪花',
  tag: 'Infinite Perimeter',
  params: [
    // --- Curve-specific ---
    { key: 'iterations', label: 'Iterations', labelZh: '迭代次数', type: 'range', min: 1, max: 6, step: 1, val: 4 },
    { key: 'size', label: 'Size', labelZh: '大小', type: 'range', min: 20, max: 45, step: 1, val: 40 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.25 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.15 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.05 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.5 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 1.8 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.08 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.6 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 190 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 20 },
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
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#e0f2fe' },
  ],
  formula(cfg) {
    const iterations = cfg.iterations as number;
    return [
      `Koch Curve Construction`,
      `Replace middle third with two sides`,
      `Iterations: ${iterations}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const iterations = cfg.iterations as number;
    const size = cfg.size as number;
    const points = computeKochPoints(iterations, size);
    const idx = Math.floor(progress * (points.length - 1));
    const p = points[idx];
    const pulseDurationMs = cfg.durationMs as number;
    const pulse = 1 + Math.sin((time % pulseDurationMs) / pulseDurationMs * Math.PI * 2) * 0.08;
    const cx = 50;
    const cy = 50;
    return {
      x: cx + (p.x - cx) * pulse,
      y: cy + (p.y - cy) * pulse,
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
      fadePower: 0.65,
      baseRadius: 0.5,
      maxRadius: 1.8,
      minOpacity: 0.08,
    });
  },
  code(cfg) {
    const iterations = cfg.iterations as number;
    const size = cfg.size as number;
    return `// Koch Snowflake — Recursive construction
const h = ${size} * Math.sqrt(3) / 2;
const v1 = { x: 50, y: 50 - h * 2 / 3 };
const v2 = { x: 50 - ${size} / 2, y: 50 + h / 3 };
const v3 = { x: 50 + ${size} / 2, y: 50 + h / 3 };

function kochLine(x1, y1, x2, y2, depth) {
  if (depth === 0) return [{ x: x2, y: y2 }];
  const dx = x2 - x1, dy = y2 - y1;
  const ax = x1 + dx/3, ay = y1 + dy/3;
  const bx = x1 + 2*dx/3, by = y1 + 2*dy/3;
  const px = ax + (dx/3)*cos(-PI/3) - (dy/3)*sin(-PI/3);
  const py = ay + (dx/3)*sin(-PI/3) + (dy/3)*cos(-PI/3);
  return [
    ...kochLine(x1,y1,ax,ay, depth-1),
    ...kochLine(ax,ay,px,py, depth-1),
    ...kochLine(px,py,bx,by, depth-1),
    ...kochLine(bx,by,x2,y2, depth-1)
  ];
}
// Combine 3 sides, iterations = ${iterations}
// Pulse: 1 + sin(...) * 0.08, center (50,50)`;
  },
};
