import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const maurerRose: AnimationDef = {
  id: 'maurer-rose',
  category: 'Special',
  name: 'Maurer Rose',
  tag: 'Angular Discretization',
  params: [
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 360, step: 1, val: 180 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.6 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    { key: 'n', label: 'Petal n', labelZh: '花瓣参数', type: 'range', min: 2, max: 8, step: 1, val: 4 },
    { key: 'd', label: 'Degree Step d', labelZh: '角度步长', type: 'range', min: 1, max: 180, step: 1, val: 71 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 5, max: 25, step: 0.5, val: 18 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.4 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.2 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 200 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 5 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 40 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 65 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 70 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#00bfff' },
  ],
  formula(cfg) {
    return [
      `r = sin(n\u00B7\u03B8),  \u03B8 = k\u00B7d\u00B7\u03C0/180`,
      `k = 0, 1, 2, ..., 360/d`,
      `x = 50 + r\u00B7cos(\u03B8)\u00B7scale`,
      `y = 50 + r\u00B7sin(\u03B8)\u00B7scale`,
      `n=${cfg.n}, d=${cfg.d}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const n = cfg.n as number;
    const d = cfg.d as number;
    const scale = cfg.scale as number;
    const k = Math.floor(progress * 360 / d);
    const theta = k * d * Math.PI / 180;
    const r = Math.sin(n * theta);
    return {
      x: 50 + r * Math.cos(theta) * scale,
      y: 50 + r * Math.sin(theta) * scale,
    };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 360);
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
    const n = cfg.n as number;
    const d = cfg.d as number;
    const scale = cfg.scale as number;
    return `const k = Math.floor(progress * 360 / ${d});
const theta = k * ${d} * Math.PI / 180;
const r = Math.sin(${n} * theta);
return {
  x: 50 + r * Math.cos(theta) * ${scale},
  y: 50 + r * Math.sin(theta) * ${scale}
};`;
  },
};

export const fermatSpiral: AnimationDef = {
  id: 'fermat-spiral',
  category: 'Special',
  name: 'Fermat Spiral',
  tag: 'Parabolic Spiral',
  params: [
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 140 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 10000 },
    { key: 'a', label: 'Coefficient a', labelZh: '系数', type: 'range', min: 1, max: 8, step: 0.5, val: 4 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.3, max: 1.5, step: 0.1, val: 0.8 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 90 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 10 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 80 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 75 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#f5f5f5' },
  ],
  formula(cfg) {
    return [
      `r = a\u00B7\u221A\u03B8  (positive branch)`,
      `x = 50 + r\u00B7cos(\u03B8)\u00B7scale`,
      `y = 50 + r\u00B7sin(\u03B8)\u00B7scale`,
      `\u03B8 \u2208 [0, 8\u03C0]`,
      `a=${cfg.a}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const a = cfg.a as number;
    const scale = cfg.scale as number;
    const theta = progress * Math.PI * 8;
    const r = a * Math.sqrt(theta);
    return {
      x: 50 + r * Math.cos(theta) * scale,
      y: 50 + r * Math.sin(theta) * scale,
    };
  },
  getRotation(time, _cfg) {
    return -((time % 20000) / 20000) * 360;
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
    const scale = cfg.scale as number;
    return `const theta = progress * Math.PI * 8;
const r = ${a} * Math.sqrt(theta);
return {
  x: 50 + r * Math.cos(theta) * ${scale},
  y: 50 + r * Math.sin(theta) * ${scale}
};`;
  },
};
