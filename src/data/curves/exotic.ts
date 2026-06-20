import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const hypotrochoidRose: AnimationDef = {
  id: 'hypotrochoid-rose',
  category: 'Exotic',
  categoryZh: '异形',
  name: 'Hypotrochoid Rose',
  nameZh: '内旋轮玫瑰',
  tag: 'Spirograph Rose Blend',
  params: [
    // --- Curve geometry ---
    { key: 'R', label: 'Outer R', labelZh: '外圆半径', type: 'range', min: 3, max: 12, step: 0.5, val: 7 },
    { key: 'r', label: 'Inner r', labelZh: '内圆半径', type: 'range', min: 1, max: 6, step: 0.5, val: 3 },
    { key: 'd', label: 'Pen Distance', labelZh: '笔距', type: 'range', min: 1, max: 6, step: 0.5, val: 3 },
    { key: 'n', label: 'Petals', labelZh: '花瓣数', type: 'range', min: 2, max: 8, step: 1, val: 5 },
    { key: 'a', label: 'Blend Amplitude', labelZh: '混合振幅', type: 'range', min: 0, max: 5, step: 0.5, val: 2 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 1, max: 3, step: 0.1, val: 2 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 140 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 9000 },
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
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 260 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 6 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 50 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#da70d6' },
  ],
  formula(cfg) {
    const R = cfg.R as number;
    const r = cfg.r as number;
    const d = cfg.d as number;
    const n = cfg.n as number;
    const a = cfg.a as number;
    return [
      `x = (R-r)\u00B7cos(t) + d\u00B7cos((R-r)/r\u00B7t) + a\u00B7cos(n\u00B7t)`,
      `y = (R-r)\u00B7sin(t) - d\u00B7sin((R-r)/r\u00B7t) + a\u00B7sin(n\u00B7t)`,
      `R=${R}, r=${r}, d=${d}, n=${n}, a=${a}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const t = progress * Math.PI * 2;
    const R = cfg.R as number;
    const r = cfg.r as number;
    const d = cfg.d as number;
    const n = cfg.n as number;
    const a = cfg.a as number;
    const scale = cfg.scale as number;
    const ratio = (R - r) / r;
    const xVal = (R - r) * Math.cos(t) + d * Math.cos(ratio * t) + a * Math.cos(n * t);
    const yVal = (R - r) * Math.sin(t) - d * Math.sin(ratio * t) + a * Math.sin(n * t);
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
    const n = cfg.n as number;
    const a = cfg.a as number;
    const scale = cfg.scale as number;
    return `const t = progress * Math.PI * 2;
const R = ${R}, r = ${r}, d = ${d}, n = ${n}, a = ${a};
const scale = ${scale};
const ratio = (R - r) / r;
const xVal = (R - r) * Math.cos(t) + d * Math.cos(ratio * t) + a * Math.cos(n * t);
const yVal = (R - r) * Math.sin(t) - d * Math.sin(ratio * t) + a * Math.sin(n * t);
return {
  x: 50 + xVal * scale,
  y: 50 + yVal * scale
};`;
  },
};

export const witchOfAgnesi: AnimationDef = {
  id: 'witch-agnesi',
  category: 'Exotic',
  categoryZh: '异形',
  name: 'Witch of Agnesi',
  nameZh: '阿涅泽曲线',
  tag: 'Bell-Shaped Algebraic',
  params: [
    // --- Curve geometry ---
    { key: 'a', label: 'Amplitude', labelZh: '振幅', type: 'range', min: 15, max: 40, step: 1, val: 30 },
    { key: 'b', label: 'Deformation', labelZh: '变形系数', type: 'range', min: 0.5, max: 5, step: 0.1, val: 2 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.2 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 140 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 9000 },
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
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 140 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 6 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 50 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#da70d6' },
  ],
  formula(cfg) {
    const a = cfg.a as number;
    const b = cfg.b as number;
    return [
      `x = a\u00B7cos(t)\u00B7exp(-b\u00B7sin\u00B2(t))`,
      `y = a\u00B7sin(t)\u00B7exp(-b\u00B7sin\u00B2(t))`,
      `a = ${a}, b = ${b}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const t = progress * Math.PI * 2;
    const a = cfg.a as number;
    const b = cfg.b as number;
    const scale = cfg.scale as number;
    const envelope = Math.exp(-b * Math.sin(t) * Math.sin(t));
    const xVal = a * Math.cos(t) * envelope;
    const yVal = a * Math.sin(t) * envelope;
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
    const a = cfg.a as number;
    const b = cfg.b as number;
    const scale = cfg.scale as number;
    return `const t = progress * Math.PI * 2;
const a = ${a}, b = ${b}, scale = ${scale};
const envelope = Math.exp(-b * Math.sin(t) * Math.sin(t));
const xVal = a * Math.cos(t) * envelope;
const yVal = a * Math.sin(t) * envelope;
return {
  x: 50 + xVal * scale,
  y: 50 + yVal * scale
};`;
  },
};

export const talbotCurve: AnimationDef = {
  id: 'talbot-curve',
  category: 'Exotic',
  categoryZh: '异形',
  name: 'Talbot Curve',
  nameZh: '托尔博特曲线',
  tag: 'Algebraic Genus 2',
  params: [
    // --- Curve geometry ---
    { key: 'a', label: 'Main Amplitude', labelZh: '主振幅', type: 'range', min: 15, max: 35, step: 1, val: 25 },
    { key: 'b', label: 'Harmonic Amplitude', labelZh: '谐波振幅', type: 'range', min: 5, max: 20, step: 1, val: 10 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.3 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 140 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 9000 },
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
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 30 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 6 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 50 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#da70d6' },
  ],
  formula(cfg) {
    const a = cfg.a as number;
    const b = cfg.b as number;
    return [
      `x = a\u00B7cos(t) + b\u00B7cos(3t)`,
      `y = a\u00B7sin(t) + b\u00B7sin(3t)`,
      `a = ${a}, b = ${b}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const t = progress * Math.PI * 2;
    const a = cfg.a as number;
    const b = cfg.b as number;
    const scale = cfg.scale as number;
    const xVal = a * Math.cos(t) + b * Math.cos(3 * t);
    const yVal = a * Math.sin(t) + b * Math.sin(3 * t);
    return {
      x: 50 + xVal * scale,
      y: 50 + yVal * scale,
    };
  },
  getRotation(time, _cfg) {
    return -((time % 20000) / 20000) * 360;
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
    const a = cfg.a as number;
    const b = cfg.b as number;
    const scale = cfg.scale as number;
    return `const t = progress * Math.PI * 2;
const a = ${a}, b = ${b}, scale = ${scale};
const xVal = a * Math.cos(t) + b * Math.cos(3 * t);
const yVal = a * Math.sin(t) + b * Math.sin(3 * t);
return {
  x: 50 + xVal * scale,
  y: 50 + yVal * scale
};`;
  },
};
