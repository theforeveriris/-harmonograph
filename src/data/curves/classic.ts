import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const nephroid: AnimationDef = {
  id: 'nephroid',
  category: 'Classic',
  categoryZh: '经典',
  name: 'Nephroid',
  nameZh: '肾脏线',
  tag: 'Kidney Curve',
  params: [
    // --- Curve geometry ---
    { key: 'r', label: 'Rolling Radius', labelZh: '滚轮半径', type: 'range', min: 3, max: 15, step: 0.5, val: 10 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.2 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 250, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 340 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#ff69b4' },
  ],
  formula(cfg) {
    return [
      `Epicycloid with R = 2r`,
      `x = 3r\u00B7cos(t) - r\u00B7cos(3t)`,
      `y = 3r\u00B7sin(t) - r\u00B7sin(3t)`,
      `r = ${(cfg.r as number).toFixed(1)}, scale = ${(cfg.scale as number).toFixed(1)}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const t = progress * Math.PI * 2;
    const r = cfg.r as number;
    const scale = cfg.scale as number;
    const x = 3 * r * Math.cos(t) - r * Math.cos(3 * t);
    const y = 3 * r * Math.sin(t) - r * Math.sin(3 * t);
    return { x: 50 + x * scale, y: 50 + y * scale };
  },
  getRotation(_time, _cfg) {
    return 0;
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
    const r = cfg.r as number;
    const scale = cfg.scale as number;
    return `const t = progress * Math.PI * 2;
const r = ${r};
const scale = ${scale};
const x = 3 * r * Math.cos(t) - r * Math.cos(3 * t);
const y = 3 * r * Math.sin(t) - r * Math.sin(3 * t);
return {
  x: 50 + x * scale,
  y: 50 + y * scale
};`;
  },
};

export const deltoid: AnimationDef = {
  id: 'deltoid',
  category: 'Classic',
  categoryZh: '经典',
  name: 'Deltoid',
  nameZh: '三角形线',
  tag: 'Three-Cusped Hypocycloid',
  params: [
    // --- Curve geometry ---
    { key: 'r', label: 'Radius', labelZh: '半径', type: 'range', min: 5, max: 20, step: 0.5, val: 12 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.5 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 250, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 50 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#ffd700' },
  ],
  formula(cfg) {
    return [
      `Hypocycloid with R = 3r`,
      `x = 2r\u00B7cos(t) + r\u00B7cos(2t)`,
      `y = 2r\u00B7sin(t) - r\u00B7sin(2t)`,
      `r = ${(cfg.r as number).toFixed(1)}, scale = ${(cfg.scale as number).toFixed(1)}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const t = progress * Math.PI * 2;
    const r = cfg.r as number;
    const scale = cfg.scale as number;
    const x = 2 * r * Math.cos(t) + r * Math.cos(2 * t);
    const y = 2 * r * Math.sin(t) - r * Math.sin(2 * t);
    return { x: 50 + x * scale, y: 50 + y * scale };
  },
  getRotation(time, _cfg) {
    return -((time % 20000) / 20000) * 360;
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
    const r = cfg.r as number;
    const scale = cfg.scale as number;
    return `const t = progress * Math.PI * 2;
const r = ${r};
const scale = ${scale};
const x = 2 * r * Math.cos(t) + r * Math.cos(2 * t);
const y = 2 * r * Math.sin(t) - r * Math.sin(2 * t);
return {
  x: 50 + x * scale,
  y: 50 + y * scale
};`;
  },
};

export const cardioidPolar: AnimationDef = {
  id: 'cardioid-polar',
  category: 'Classic',
  categoryZh: '经典',
  name: 'Cardioid',
  nameZh: '心形极坐标',
  tag: 'Heart-Shaped Polar',
  params: [
    // --- Curve geometry ---
    { key: 'a', label: 'Amplitude', labelZh: '振幅', type: 'range', min: 10, max: 30, step: 1, val: 20 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.3 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 250, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 350 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#ff1493' },
  ],
  formula(cfg) {
    return [
      `Polar: r = a(1 + cos(\u03B8))`,
      `x = r\u00B7cos(\u03B8), y = r\u00B7sin(\u03B8)`,
      `a = ${(cfg.a as number).toFixed(1)}, scale = ${(cfg.scale as number).toFixed(1)}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const theta = progress * Math.PI * 2;
    const a = cfg.a as number;
    const scale = cfg.scale as number;
    const r = a * (1 + Math.cos(theta));
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    return { x: 50 + x * scale, y: 50 + y * scale };
  },
  getRotation(_time, _cfg) {
    return 0;
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
    const a = cfg.a as number;
    const scale = cfg.scale as number;
    return `const theta = progress * Math.PI * 2;
const a = ${a};
const scale = ${scale};
const r = a * (1 + Math.cos(theta));
const x = r * Math.cos(theta);
const y = r * Math.sin(theta);
return {
  x: 50 + x * scale,
  y: 50 + y * scale
};`;
  },
};
