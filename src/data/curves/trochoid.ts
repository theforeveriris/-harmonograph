import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const epitrochoid: AnimationDef = {
  id: 'epitrochoid',
  category: 'Trochoid',
  categoryZh: '摆轮',
  name: 'Epitrochoid',
  nameZh: '外摆线',
  tag: 'Rolling Circle Trajectory',
  params: [
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 9000 },
    { key: 'R', label: 'Fixed R', labelZh: '固定圆半径', type: 'range', min: 2, max: 10, step: 0.5, val: 5 },
    { key: 'r', label: 'Rolling r', labelZh: '滚动圆半径', type: 'range', min: 1, max: 6, step: 0.5, val: 3 },
    { key: 'd', label: 'Distance d', labelZh: '距离', type: 'range', min: 1, max: 10, step: 0.5, val: 5 },
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
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 0 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#f5f5f5' },
  ],
  formula(cfg) {
    return [
      `x = (R+r)cos(t) - d\u00B7cos((R+r)/r\u00B7t)`,
      `y = (R+r)sin(t) - d\u00B7sin((R+r)/r\u00B7t)`,
      `R=${cfg.R}, r=${cfg.r}, d=${cfg.d}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const t = progress * Math.PI * 2;
    const R = cfg.R as number;
    const r = cfg.r as number;
    const d = cfg.d as number;
    const ratio = (R + r) / r;
    return {
      x: 50 + ((R + r) * Math.cos(t) - d * Math.cos(ratio * t)) * 3.5,
      y: 50 + ((R + r) * Math.sin(t) - d * Math.sin(ratio * t)) * 3.5,
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
    return `const t = progress * Math.PI * 2;
const ratio = (${R} + ${r}) / ${r};
return {
  x: 50 + ((${R} + ${r}) * Math.cos(t)
          - ${d} * Math.cos(ratio * t)) * 3.5,
  y: 50 + ((${R} + ${r}) * Math.sin(t)
          - ${d} * Math.sin(ratio * t)) * 3.5
};`;
  },
};

export const hypocycloid: AnimationDef = {
  id: 'hypocycloid',
  category: 'Trochoid',
  categoryZh: '摆轮',
  name: 'Hypocycloid',
  nameZh: '内摆线',
  tag: 'Five-Cusped Rolling',
  params: [
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 150, step: 1, val: 96 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.4 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    { key: 'R', label: 'Fixed R', labelZh: '固定圆半径', type: 'range', min: 3, max: 10, step: 0.5, val: 5 },
    { key: 'r', label: 'Rolling r', labelZh: '滚动圆半径', type: 'range', min: 0.5, max: 3, step: 0.5, val: 1 },
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
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 50 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#ffd700' },
  ],
  formula(cfg) {
    return [
      `x = (R-r)cos(t) + r\u00B7cos((R-r)/r\u00B7t)`,
      `y = (R-r)sin(t) - r\u00B7sin((R-r)/r\u00B7t)`,
      `R=${cfg.R}, r=${cfg.r} (${Math.round((cfg.R as number) / (cfg.r as number))} cusps)`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const R = cfg.R as number;
    const r = cfg.r as number;
    const ratio = (R - r) / r;
    const scaleMod = 0.9 + Math.sin((time % 4000) / 4000 * Math.PI * 2) * 0.1;
    return {
      x: 50 + ((R - r) * Math.cos(t) + r * Math.cos(ratio * t)) * 5.5 * scaleMod,
      y: 50 + ((R - r) * Math.sin(t) - r * Math.sin(ratio * t)) * 5.5 * scaleMod,
    };
  },
  getRotation(_time, _cfg) {
    return ((0 % 12000) / 12000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.5,
      baseRadius: 0.7,
      maxRadius: 2.2,
      minOpacity: 0.06,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    const R = cfg.R as number;
    const r = cfg.r as number;
    return `const t = progress * Math.PI * 2;
const ratio = (${R} - ${r}) / ${r};
const scaleMod = 0.9 + Math.sin(pulse) * 0.1;
return {
  x: 50 + ((${R} - ${r}) * Math.cos(t)
          + ${r} * Math.cos(ratio * t)) * 5.5 * scaleMod,
  y: 50 + ((${R} - ${r}) * Math.sin(t)
          - ${r} * Math.sin(ratio * t)) * 5.5 * scaleMod
};`;
  },
};

export const astroid: AnimationDef = {
  id: 'astroid',
  category: 'Trochoid',
  categoryZh: '摆轮',
  name: 'Astroid',
  nameZh: '星形线',
  tag: 'Rolling Circle Envelope',
  params: [
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 150, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.3 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 12000, step: 100, val: 6000 },
    { key: 'a', label: 'Radius a', labelZh: '半径', type: 'range', min: 15, max: 45, step: 1, val: 35 },
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
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#fbbf24' },
  ],
  formula(cfg) {
    return [
      `x = a\u00B7cos\u00B3(t)`,
      `y = a\u00B7sin\u00B3(t)`,
      `a = ${cfg.a}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const scaleMod = 0.85 + Math.sin((time % 3000) / 3000 * Math.PI * 2) * 0.15;
    const c = Math.cos(t);
    const s = Math.sin(t);
    return { x: 50 + (cfg.a as number) * scaleMod * c * c * c, y: 50 + (cfg.a as number) * scaleMod * s * s * s };
  },
  getRotation(_time, _cfg) {
    return ((0 % 15000) / 15000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 360);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.65,
      baseRadius: 0.8,
      maxRadius: 2.8,
      minOpacity: 0.08,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    const a = cfg.a as number;
    return `const t = progress * Math.PI * 2;
const scaleMod = 0.85 + Math.sin(pulse) * 0.15;
const c = Math.cos(t), s = Math.sin(t);
return {
  x: 50 + ${a} * scaleMod * c * c * c,
  y: 50 + ${a} * scaleMod * s * s * s
};`;
  },
};
