import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const spirograph: AnimationDef = {
  id: 'spirograph',
  category: 'Spirograph',
  categoryZh: '螺线花',
  name: 'Spirograph',
  nameZh: '万花尺',
  tag: 'Hypotrochoid Drawing Toy',
  params: [
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 140 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 10000 },
    { key: 'R', label: 'Outer R', labelZh: '外圆半径', type: 'range', min: 3, max: 12, step: 0.5, val: 7 },
    { key: 'r', label: 'Inner r', labelZh: '内圆半径', type: 'range', min: 1, max: 8, step: 0.5, val: 3 },
    { key: 'd', label: 'Pen Distance', labelZh: '笔距', type: 'range', min: 0.5, max: 8, step: 0.5, val: 4 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 1, max: 4, step: 0.1, val: 2.5 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 0 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 10 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 80 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 75 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#f5f5f5' },
  ],
  formula(cfg) {
    return [
      `x = (R-r)\u00B7cos(t) + d\u00B7cos((R-r)/r\u00B7t)`,
      `y = (R-r)\u00B7sin(t) - d\u00B7sin((R-r)/r\u00B7t)`,
      `R=${cfg.R}, r=${cfg.r}, d=${cfg.d}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const t = progress * Math.PI * 2;
    const R = cfg.R as number;
    const r = cfg.r as number;
    const d = cfg.d as number;
    const scale = cfg.scale as number;
    const ratio = (R - r) / r;
    const xVal = (R - r) * Math.cos(t) + d * Math.cos(ratio * t);
    const yVal = (R - r) * Math.sin(t) - d * Math.sin(ratio * t);
    return {
      x: 50 + xVal * scale,
      y: 50 + yVal * scale,
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
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    const R = cfg.R as number;
    const r = cfg.r as number;
    const d = cfg.d as number;
    const scale = cfg.scale as number;
    return `const t = progress * Math.PI * 2;
const ratio = (${R} - ${r}) / ${r};
const xVal = (${R} - ${r}) * Math.cos(t) + ${d} * Math.cos(ratio * t);
const yVal = (${R} - ${r}) * Math.sin(t) - ${d} * Math.sin(ratio * t);
return {
  x: 50 + xVal * ${scale},
  y: 50 + yVal * ${scale}
};`;
  },
};

export const maclaurinRose: AnimationDef = {
  id: 'maclaurin-rose',
  category: 'Rose',
  categoryZh: '玫瑰',
  name: 'Maclaurin Rose',
  nameZh: '麦克劳林玫瑰',
  tag: 'r = cos(k\u03B8) Polar',
  params: [
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 140 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 10000 },
    { key: 'a', label: 'Amplitude a', labelZh: '振幅', type: 'range', min: 10, max: 35, step: 1, val: 25 },
    { key: 'n', label: 'Numerator n', labelZh: '分子', type: 'range', min: 1, max: 8, step: 1, val: 3 },
    { key: 'd', label: 'Denominator d', labelZh: '分母', type: 'range', min: 1, max: 8, step: 1, val: 2 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.8, max: 2.5, step: 0.1, val: 1.5 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 270 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 10 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 80 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 75 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#f5f5f5' },
  ],
  formula(cfg) {
    const k = (cfg.n as number) / (cfg.d as number);
    return [
      `r = a\u00B7cos(k\u00B7\u03B8),  k = n/d = ${cfg.n}/${cfg.d} = ${k}`,
      `x = 50 + r\u00B7cos(\u03B8)\u00B7scale`,
      `y = 50 + r\u00B7sin(\u03B8)\u00B7scale`,
      `\u03B8 \u2208 [0, 2\u03C0\u00B7d]`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const a = cfg.a as number;
    const n = cfg.n as number;
    const d = cfg.d as number;
    const scale = cfg.scale as number;
    const theta = progress * Math.PI * 2 * d;
    const k = n / d;
    const r = a * Math.cos(k * theta);
    return {
      x: 50 + r * Math.cos(theta) * scale,
      y: 50 + r * Math.sin(theta) * scale,
    };
  },
  getRotation(time, _cfg) {
    return -((time % 25000) / 25000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 480);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.5,
      baseRadius: 0.7,
      maxRadius: 2.3,
      minOpacity: 0.06,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    const a = cfg.a as number;
    const n = cfg.n as number;
    const d = cfg.d as number;
    const scale = cfg.scale as number;
    const k = n / d;
    return `const theta = progress * Math.PI * 2 * ${d};
const k = ${n} / ${d}; // = ${k}
const r = ${a} * Math.cos(k * theta);
return {
  x: 50 + r * Math.cos(theta) * ${scale},
  y: 50 + r * Math.sin(theta) * ${scale}
};`;
  },
};
