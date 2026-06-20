import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const starPolygon: AnimationDef = {
  id: 'star-polygon',
  category: 'Trochoid',
  categoryZh: '摆轮',
  name: 'Star Polygon',
  nameZh: '正星多边形',
  tag: '{n/k} Regular Star',
  params: [
    // --- Curve geometry ---
    { key: 'n', label: 'Vertices (n)', labelZh: '顶点数', type: 'range', min: 3, max: 20, step: 1, val: 7 },
    { key: 'k', label: 'Step (k)', labelZh: '跳跃步长', type: 'range', min: 1, max: 9, step: 1, val: 3 },
    { key: 'radius', label: 'Radius', labelZh: '半径', type: 'range', min: 15, max: 40, step: 1, val: 30 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 250, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.4 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 2000, max: 15000, step: 100, val: 6000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.9 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.7 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.04 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.56 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 55 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 5 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 40 },
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
    { key: 'color', label: 'Static Color', labelZh: '静态颜色', type: 'color', val: '#ffd700' },
  ],
  formula(cfg) {
    const n = Math.round(cfg.n as number);
    const k = Math.round(cfg.k as number);
    return [
      `Star polygon {${n}/${k}}`,
      `Vertex i at angle 2\u03C0i/${n}`,
      `Connect vertex i to (i + ${k}) mod ${n}`,
      `r = ${(cfg.radius as number).toFixed(1)}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const n = Math.round(cfg.n as number);
    const k = Math.round(cfg.k as number);
    const r = cfg.radius as number;

    // Build the star polygon path as a sequence of connected vertices
    // The star visits n vertices (or fewer if it closes early)
    const visited: number[] = [];
    const seen = new Set<number>();
    let current = 0;
    for (let i = 0; i < n; i++) {
      if (seen.has(current)) break;
      seen.add(current);
      visited.push(current);
      current = (current + k) % n;
    }

    const totalEdges = visited.length;
    const totalProgress = progress * totalEdges;
    const edgeIndex = Math.floor(totalProgress) % totalEdges;
    const edgeFrac = totalProgress - Math.floor(totalProgress);

    const fromIdx = visited[edgeIndex];
    const toIdx = visited[(edgeIndex + 1) % totalEdges];

    const angle1 = (2 * Math.PI * fromIdx) / n - Math.PI / 2;
    const angle2 = (2 * Math.PI * toIdx) / n - Math.PI / 2;

    const x1 = r * Math.cos(angle1);
    const y1 = r * Math.sin(angle1);
    const x2 = r * Math.cos(angle2);
    const y2 = r * Math.sin(angle2);

    return {
      x: 50 + x1 + (x2 - x1) * edgeFrac,
      y: 50 + y1 + (y2 - y1) * edgeFrac,
    };
  },
  getRotation(time, _cfg) {
    return -((time % 15000) / 15000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 360);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.6,
      maxRadius: 2.4,
      minOpacity: 0.03,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    const n = Math.round(cfg.n as number);
    const k = Math.round(cfg.k as number);
    return `const n = ${n};
const k = ${k};
const r = ${(cfg.radius as number).toFixed(1)};
// Build star polygon {n/k} vertex visit order
const visited = [];
const seen = new Set();
let current = 0;
for (let i = 0; i < n; i++) {
  if (seen.has(current)) break;
  seen.add(current);
  visited.push(current);
  current = (current + k) % n;
}
const totalEdges = visited.length;
const totalProgress = progress * totalEdges;
const edgeIndex = Math.floor(totalProgress) % totalEdges;
const edgeFrac = totalProgress - Math.floor(totalProgress);
const fromIdx = visited[edgeIndex];
const toIdx = visited[(edgeIndex + 1) % totalEdges];
const angle1 = (2 * Math.PI * fromIdx) / n - Math.PI / 2;
const angle2 = (2 * Math.PI * toIdx) / n - Math.PI / 2;
return {
  x: 50 + r * Math.cos(angle1) + (r * Math.cos(angle2) - r * Math.cos(angle1)) * edgeFrac,
  y: 50 + r * Math.sin(angle1) + (r * Math.sin(angle2) - r * Math.sin(angle1)) * edgeFrac
};`;
  },
};

