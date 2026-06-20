import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const rhodonea: AnimationDef = {
  id: 'rhodonea',
  category: 'Rose',
  categoryZh: '玫瑰',
  name: 'Rhodonea',
  nameZh: '玫瑰线',
  tag: 'r = cos(k\u03B8) Rose Family',
  params: [
    // --- Curve geometry ---
    { key: 'a', label: 'Amplitude', labelZh: '振幅', type: 'range', min: 10, max: 35, step: 1, val: 25 },
    { key: 'k', label: 'Petal Param k', labelZh: '花瓣参数k', type: 'range', min: 2, max: 12, step: 1, val: 5 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.8, max: 2, step: 0.1, val: 1.3 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 250, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 15000, step: 100, val: 8000 },
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
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 300 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#da70d6' },
  ],
  formula(cfg) {
    return [
      `Polar: r = a\u00B7cos(k\u00B7\u03B8)`,
      `x = r\u00B7cos(\u03B8), y = r\u00B7sin(\u03B8)`,
      `a = ${(cfg.a as number).toFixed(1)}, k = ${Math.round(cfg.k as number)}`,
      `scale = ${(cfg.scale as number).toFixed(1)}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const theta = progress * Math.PI * 2;
    const a = cfg.a as number;
    const k = Math.round(cfg.k as number);
    const scale = cfg.scale as number;
    const r = a * Math.cos(k * theta);
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    return { x: 50 + x * scale, y: 50 + y * scale };
  },
  getRotation(time, _cfg) {
    return -((time % 25000) / 25000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 720);
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
    const k = Math.round(cfg.k as number);
    const scale = cfg.scale as number;
    return `const theta = progress * Math.PI * 2;
const a = ${a};
const k = ${k};
const scale = ${scale};
const r = a * Math.cos(k * theta);
const x = r * Math.cos(theta);
const y = r * Math.sin(theta);
return {
  x: 50 + x * scale,
  y: 50 + y * scale
};`;
  },
};

export const sunflower: AnimationDef = {
  id: 'sunflower',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Sunflower',
  nameZh: '向日葵',
  tag: 'Fermat Spiral Closed Loop',
  params: [
    // --- Curve geometry ---
    { key: 'n', label: 'Petals', labelZh: '花瓣数', type: 'range', min: 2, max: 10, step: 1, val: 6 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 15, max: 40, step: 1, val: 30 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 250, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 15000, step: 100, val: 8000 },
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
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 45 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#f4a460' },
  ],
  formula(cfg) {
    return [
      `x = cos(n\u03B8)\u00B7cos(\u03B8)`,
      `y = cos(n\u03B8)\u00B7sin(\u03B8)`,
      `n = ${Math.round(cfg.n as number)}, scale = ${(cfg.scale as number).toFixed(1)}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const theta = progress * Math.PI * 2;
    const n = Math.round(cfg.n as number);
    const scale = cfg.scale as number;
    const x = Math.cos(n * theta) * Math.cos(theta);
    const y = Math.cos(n * theta) * Math.sin(theta);
    return { x: 50 + x * scale, y: 50 + y * scale };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 720);
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
    const scale = cfg.scale as number;
    return `const theta = progress * Math.PI * 2;
const n = ${n};
const scale = ${scale};
const x = Math.cos(n * theta) * Math.cos(theta);
const y = Math.cos(n * theta) * Math.sin(theta);
return {
  x: 50 + x * scale,
  y: 50 + y * scale
};`;
  },
};
