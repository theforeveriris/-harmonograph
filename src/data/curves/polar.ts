import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const lemniscateOfBernoulli: AnimationDef = {
  id: 'lemniscate',
  category: 'Knot',
  categoryZh: '纽结',
  name: 'Lemniscate of Bernoulli',
  nameZh: '伯努利双纽线',
  tag: 'Infinity Polar Curve',
  params: [
    // --- Curve geometry ---
    { key: 'a', label: 'Semi-axis', labelZh: '半轴', type: 'range', min: 10, max: 40, step: 1, val: 35 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 1, max: 3, step: 0.1, val: 1.0 },
    // --- Timing ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 110 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.4 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 5000, max: 20000, step: 100, val: 7000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 0 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 20 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 90 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 60 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#ef4444' },
  ],
  formula(cfg) {
    return [
      `r\u00B2 = a\u00B2\u00B7cos(2\u03B8)`,
      `r = a\u00B7\u221A(cos(2\u03B8))  when cos(2\u03B8) \u2265 0`,
      `a = ${cfg.a}, scale = ${cfg.scale}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const theta = progress * Math.PI * 2;
    const cos2 = Math.cos(2 * theta);
    if (cos2 < 0) return { x: 50, y: 50 };
    const a = cfg.a as number;
    const scale = cfg.scale as number;
    const r = a * Math.sqrt(cos2) * scale;
    return { x: 50 + r * Math.cos(theta), y: 50 + r * Math.sin(theta) };
  },
  getRotation(time, _cfg) {
    return -((time % 18000) / 18000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 300);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.56,
      baseRadius: 0.9,
      maxRadius: 2.7,
      minOpacity: 0.04,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const theta = progress * Math.PI * 2;
const cos2 = Math.cos(2 * theta);
if (cos2 < 0) return { x: 50, y: 50 };
const r = ${cfg.a} * Math.sqrt(cos2) * ${cfg.scale};
return {
  x: 50 + r * Math.cos(theta),
  y: 50 + r * Math.sin(theta)
};`;
  },
};

export const limacon: AnimationDef = {
  id: 'limacon',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Limaçon',
  nameZh: '蜗牛线',
  tag: 'Snail Shell Curve',
  params: [
    // --- Curve geometry ---
    { key: 'a', label: 'Inner Radius', labelZh: '内半径', type: 'range', min: 5, max: 25, step: 1, val: 12 },
    { key: 'b', label: 'Outer Radius', labelZh: '外半径', type: 'range', min: 5, max: 25, step: 1, val: 18 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 3, step: 0.1, val: 1.5 },
    // --- Timing ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 5000, max: 20000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 180 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#00ced1' },
  ],
  formula(cfg) {
    return [
      `r(\u03B8) = a + b\u00B7cos(\u03B8)`,
      `a = ${cfg.a}, b = ${cfg.b}`,
      `scale = ${cfg.scale}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const theta = progress * Math.PI * 2;
    const a = cfg.a as number;
    const b = cfg.b as number;
    const scale = cfg.scale as number;
    const r = a + b * Math.cos(theta);
    return { x: 50 + r * Math.cos(theta) * scale, y: 50 + r * Math.sin(theta) * scale };
  },
  getRotation(time, _cfg) {
    return -((time % 30000) / 30000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 300);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.56,
      baseRadius: 0.9,
      maxRadius: 2.7,
      minOpacity: 0.04,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const theta = progress * Math.PI * 2;
const r = ${cfg.a} + ${cfg.b} * Math.cos(theta);
return {
  x: 50 + r * Math.cos(theta) * ${cfg.scale},
  y: 50 + r * Math.sin(theta) * ${cfg.scale}
};`;
  },
};
