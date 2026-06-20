import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

/* ============================================================
   魔法阵分类 (Magic Circle)
   典型特征：同心圆、正多边形、星形叠加、符文环、旋转对称
   ============================================================ */

/* --- 通用辅助函数 --- */
function hexVertices(cx: number, cy: number, r: number, n: number, offset = 0) {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + offset;
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return pts;
}

/* ============================================================
   1. 五芒星魔法阵 (Pentagram Circle)
   ============================================================ */
export const pentagramCircle: AnimationDef = {
  id: 'pentagram-circle',
  category: 'Magic',
  categoryZh: '魔法阵',
  name: 'Pentagram Circle',
  nameZh: '五芒星阵',
  tag: 'Five-Pointed Star in Circle',
  params: [
    { key: 'layers', label: 'Layers', labelZh: '层数', type: 'range', min: 1, max: 4, step: 1, val: 2 },
    { key: 'radius', label: 'Radius', labelZh: '半径', type: 'range', min: 15, max: 40, step: 1, val: 32 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.1 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 60, max: 250, step: 1, val: 180 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 260 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 6 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 55 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 68 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 62 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#9370db' },
  ],
  formula(cfg) {
    return [
      `Pentagram: connect every 2nd vertex of pentagon`,
      `Layers: ${cfg.layers}`,
      `Radius: ${cfg.radius}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const R = (cfg.radius as number) * (cfg.scale as number);
    const layers = cfg.layers as number;
    // Pentagram star inside
    // Combine: outer circle + inner pentagram path
    // Use progress to trace: first half = circle, second half = star
    const n = 5;
    const step = 2; // connect every 2nd vertex = pentagram
    if (progress < 0.5) {
      // Outer circle
      const t = (progress / 0.5) * Math.PI * 2;
      return { x: 50 + R * Math.cos(t), y: 50 + R * Math.sin(t) };
    } else {
      // Inner pentagram(s)
      const innerProgress = (progress - 0.5) / 0.5;
      const layerIdx = Math.min(Math.floor(innerProgress * layers), layers - 1);
      const layerProgress = (innerProgress * layers) - layerIdx;
      const innerR = R * (0.85 - layerIdx * 0.2);
      const offset = layerIdx * Math.PI / n;
      const pts = hexVertices(50, 50, innerR, n, offset);
      const totalEdges = n;
      const idx = layerProgress * totalEdges;
      const i = Math.floor(idx) % totalEdges;
      const frac = idx - Math.floor(idx);
      const from = pts[i];
      const to = pts[(i + step) % totalEdges];
      return {
        x: from.x + (to.x - from.x) * frac,
        y: from.y + (to.y - from.y) * frac,
      };
    }
  },
  getRotation(time, _cfg) {
    return -((time % 30000) / 30000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 500);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.55,
      baseRadius: 0.6,
      maxRadius: 2.2,
      minOpacity: 0.05,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `// Pentagram Circle: outer ring + ${cfg.layers} inner star layers
// Connect every 2nd vertex of regular pentagon
// Radius: ${cfg.radius}, Scale: ${cfg.scale}`;
  },
};

/* ============================================================
   2. 六芒星魔法阵 (Hexagram Circle)
   ============================================================ */
export const hexagramCircle: AnimationDef = {
  id: 'hexagram-circle',
  category: 'Magic',
  categoryZh: '魔法阵',
  name: 'Hexagram Circle',
  nameZh: '六芒星阵',
  tag: 'Star of David Pattern',
  params: [
    { key: 'layers', label: 'Layers', labelZh: '层数', type: 'range', min: 1, max: 4, step: 1, val: 2 },
    { key: 'radius', label: 'Radius', labelZh: '半径', type: 'range', min: 15, max: 40, step: 1, val: 32 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.1 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 60, max: 250, step: 1, val: 180 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 220 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 5 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 50 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 65 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#4169e1' },
  ],
  formula(cfg) {
    return [
      `Hexagram: two overlapping triangles`,
      `Layers: ${cfg.layers}`,
      `Radius: ${cfg.radius}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const R = (cfg.radius as number) * (cfg.scale as number);
    const layers = cfg.layers as number;
    const n = 6;
    if (progress < 0.35) {
      // Outer circle
      const t = (progress / 0.35) * Math.PI * 2;
      return { x: 50 + R * Math.cos(t), y: 50 + R * Math.sin(t) };
    } else if (progress < 0.65) {
      // First triangle (pointing up)
      const innerP = (progress - 0.35) / 0.3;
      const pts = hexVertices(50, 50, R * 0.85, 3, -Math.PI / 2);
      const idx = innerP * 3;
      const i = Math.floor(idx) % 3;
      const frac = idx - Math.floor(idx);
      const from = pts[i];
      const to = pts[(i + 1) % 3];
      return { x: from.x + (to.x - from.x) * frac, y: from.y + (to.y - from.y) * frac };
    } else if (progress < 0.85) {
      // Second triangle (pointing down)
      const innerP = (progress - 0.65) / 0.2;
      const pts = hexVertices(50, 50, R * 0.85, 3, Math.PI / 2);
      const idx = innerP * 3;
      const i = Math.floor(idx) % 3;
      const frac = idx - Math.floor(idx);
      const from = pts[i];
      const to = pts[(i + 1) % 3];
      return { x: from.x + (to.x - from.x) * frac, y: from.y + (to.y - from.y) * frac };
    } else {
      // Inner hexagonal rings
      const innerP = (progress - 0.85) / 0.15;
      const layerIdx = Math.min(Math.floor(innerP * layers), layers - 1);
      const layerP = (innerP * layers) - layerIdx;
      const innerR = R * (0.6 - layerIdx * 0.15);
      const pts = hexVertices(50, 50, innerR, n, layerIdx * Math.PI / n);
      const idx = layerP * n;
      const i = Math.floor(idx) % n;
      const frac = idx - Math.floor(idx);
      const from = pts[i];
      const to = pts[(i + 1) % n];
      return { x: from.x + (to.x - from.x) * frac, y: from.y + (to.y - from.y) * frac };
    }
  },
  getRotation(time, _cfg) {
    return ((time % 25000) / 25000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 500);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.55,
      baseRadius: 0.6,
      maxRadius: 2.2,
      minOpacity: 0.05,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `// Hexagram Circle: outer ring + two triangles + ${cfg.layers} hex rings
// Radius: ${cfg.radius}, Scale: ${cfg.scale}`;
  },
};

/* ============================================================
   3. 符文环魔法阵 (Rune Circle)
   ============================================================ */
export const runeCircle: AnimationDef = {
  id: 'rune-circle',
  category: 'Magic',
  categoryZh: '魔法阵',
  name: 'Rune Circle',
  nameZh: '符文环阵',
  tag: 'Concentric Rune Rings',
  params: [
    { key: 'rings', label: 'Rings', labelZh: '环数', type: 'range', min: 2, max: 6, step: 1, val: 4 },
    { key: 'radius', label: 'Radius', labelZh: '半径', type: 'range', min: 15, max: 40, step: 1, val: 32 },
    { key: 'segments', label: 'Segments', labelZh: '分段数', type: 'range', min: 6, max: 36, step: 1, val: 18 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.1 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 60, max: 250, step: 1, val: 180 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 9000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 45 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 7 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 72 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 60 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#daa520' },
  ],
  formula(cfg) {
    return [
      `${cfg.rings} concentric rings × ${cfg.segments} segments`,
      `Radius: ${cfg.radius}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const R = (cfg.radius as number) * (cfg.scale as number);
    const rings = cfg.rings as number;
    const segs = cfg.segments as number;
    // Trace ring by ring, each ring is a segmented polygon with wavy edges
    const ringIdx = Math.min(Math.floor(progress * rings), rings - 1);
    const ringP = (progress * rings) - ringIdx;
    const ringR = R * (1 - ringIdx * (0.7 / rings));
    // Segmented polygon with slight waviness
    const segIdx = Math.floor(ringP * segs);
    const segFrac = ringP * segs - segIdx;
    const angle1 = (Math.PI * 2 * segIdx) / segs;
    const angle2 = (Math.PI * 2 * (segIdx + 1)) / segs;
    // Add slight radial wave for rune-like feel
    const wave1 = 1 + 0.08 * Math.sin(segs * angle1 + ringIdx * 2);
    const wave2 = 1 + 0.08 * Math.sin(segs * angle2 + ringIdx * 2);
    const x1 = 50 + ringR * wave1 * Math.cos(angle1);
    const y1 = 50 + ringR * wave1 * Math.sin(angle1);
    const x2 = 50 + ringR * wave2 * Math.cos(angle2);
    const y2 = 50 + ringR * wave2 * Math.sin(angle2);
    return {
      x: x1 + (x2 - x1) * segFrac,
      y: y1 + (y2 - y1) * segFrac,
    };
  },
  getRotation(time, _cfg) {
    return -((time % 20000) / 20000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 500);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.55,
      baseRadius: 0.6,
      maxRadius: 2.2,
      minOpacity: 0.05,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `// Rune Circle: ${cfg.rings} concentric segmented rings
// ${cfg.segments} segments per ring with radial wave
// Radius: ${cfg.radius}, Scale: ${cfg.scale}`;
  },
};

/* ============================================================
   4. 双星魔法阵 (Double Star Circle)
   ============================================================ */
export const doubleStarCircle: AnimationDef = {
  id: 'double-star-circle',
  category: 'Magic',
  categoryZh: '魔法阵',
  name: 'Double Star Circle',
  nameZh: '双星阵',
  tag: 'Overlapping Star Polygons',
  params: [
    { key: 'n1', label: 'Star 1 Points', labelZh: '星1顶点', type: 'range', min: 3, max: 12, step: 1, val: 5 },
    { key: 'n2', label: 'Star 2 Points', labelZh: '星2顶点', type: 'range', min: 3, max: 12, step: 1, val: 7 },
    { key: 'radius', label: 'Radius', labelZh: '半径', type: 'range', min: 15, max: 40, step: 1, val: 32 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.1 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 60, max: 250, step: 1, val: 180 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 9000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 300 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 6 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 55 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 63 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#ba55d3' },
  ],
  formula(cfg) {
    return [
      `Star 1: {${cfg.n1}/2} star polygon`,
      `Star 2: {${cfg.n2}/3} star polygon`,
      `Radius: ${cfg.radius}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const R = (cfg.radius as number) * (cfg.scale as number);
    const n1 = cfg.n1 as number;
    const n2 = cfg.n2 as number;
    if (progress < 0.3) {
      // Outer circle
      const t = (progress / 0.3) * Math.PI * 2;
      return { x: 50 + R * Math.cos(t), y: 50 + R * Math.sin(t) };
    } else if (progress < 0.65) {
      // First star polygon {n1/2}
      const innerP = (progress - 0.3) / 0.35;
      const pts = hexVertices(50, 50, R * 0.82, n1, -Math.PI / 2);
      const step1 = Math.max(1, Math.floor(n1 / 2));
      const idx = innerP * n1;
      const i = Math.floor(idx) % n1;
      const frac = idx - Math.floor(idx);
      const from = pts[i];
      const to = pts[(i + step1) % n1];
      return { x: from.x + (to.x - from.x) * frac, y: from.y + (to.y - from.y) * frac };
    } else {
      // Second star polygon {n2/3}
      const innerP = (progress - 0.65) / 0.35;
      const pts = hexVertices(50, 50, R * 0.65, n2, 0);
      const step2 = Math.max(1, Math.floor(n2 / 3));
      const idx = innerP * n2;
      const i = Math.floor(idx) % n2;
      const frac = idx - Math.floor(idx);
      const from = pts[i];
      const to = pts[(i + step2) % n2];
      return { x: from.x + (to.x - from.x) * frac, y: from.y + (to.y - from.y) * frac };
    }
  },
  getRotation(time, _cfg) {
    return -((time % 28000) / 28000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 500);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.55,
      baseRadius: 0.6,
      maxRadius: 2.2,
      minOpacity: 0.05,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `// Double Star Circle: outer ring + {${cfg.n1}/2} + {${cfg.n2}/3} star polygons
// Radius: ${cfg.radius}, Scale: ${cfg.scale}`;
  },
};

/* ============================================================
   5. 螺旋符文阵 (Spiral Rune Circle)
   ============================================================ */
export const spiralRuneCircle: AnimationDef = {
  id: 'spiral-rune-circle',
  category: 'Magic',
  categoryZh: '魔法阵',
  name: 'Spiral Rune Circle',
  nameZh: '螺旋符文阵',
  tag: 'Spiral Arms in Sacred Geometry',
  params: [
    { key: 'arms', label: 'Arms', labelZh: '臂数', type: 'range', min: 2, max: 8, step: 1, val: 4 },
    { key: 'radius', label: 'Radius', labelZh: '半径', type: 'range', min: 15, max: 40, step: 1, val: 32 },
    { key: 'tightness', label: 'Tightness', labelZh: '紧密度', type: 'range', min: 0.5, max: 3, step: 0.1, val: 1.5 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.1 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 60, max: 250, step: 1, val: 180 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 10000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 0 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 65 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 60 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#cd5c5c' },
  ],
  formula(cfg) {
    return [
      `${cfg.arms} spiral arms, tightness: ${cfg.tightness}`,
      `r = R * (0.3 + 0.7 * progress)`,
      `θ = progress * ${cfg.arms} * 2π / tightness`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const R = (cfg.radius as number) * (cfg.scale as number);
    const arms = cfg.arms as number;
    const tightness = cfg.tightness as number;
    // Outer circle first (20%)
    if (progress < 0.15) {
      const t = (progress / 0.15) * Math.PI * 2;
      return { x: 50 + R * Math.cos(t), y: 50 + R * Math.sin(t) };
    }
    // Inner circle (10%)
    if (progress < 0.25) {
      const t = ((progress - 0.15) / 0.1) * Math.PI * 2;
      const innerR = R * 0.3;
      return { x: 50 + innerR * Math.cos(t), y: 50 + innerR * Math.sin(t) };
    }
    // Spiral arms (65%)
    const spiralP = (progress - 0.25) / 0.75;
    const armIdx = Math.floor(spiralP * arms);
    const armP = (spiralP * arms) - armIdx;
    const armAngle = (Math.PI * 2 * armIdx) / arms;
    const r = R * (0.3 + 0.7 * armP);
    const theta = armAngle + armP * Math.PI * 2 * tightness / arms;
    return {
      x: 50 + r * Math.cos(theta),
      y: 50 + r * Math.sin(theta),
    };
  },
  getRotation(time, _cfg) {
    return ((time % 22000) / 22000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 500);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.55,
      baseRadius: 0.6,
      maxRadius: 2.2,
      minOpacity: 0.05,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `// Spiral Rune Circle: ${cfg.arms} spiral arms
// Outer ring + inner ring + spiral arms
// Tightness: ${cfg.tightness}, Radius: ${cfg.radius}`;
  },
};
