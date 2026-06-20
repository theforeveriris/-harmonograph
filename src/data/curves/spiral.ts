import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const spiralGalaxy: AnimationDef = {
  id: 'spiral-galaxy',
  category: 'Spiral',
  name: 'Spiral Galaxy',
  tag: 'Logarithmic Spiral Arms',
  params: [
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 160 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.6 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 5000, max: 20000, step: 100, val: 12000 },
    { key: 'a', label: 'Spiral A', labelZh: '螺旋A', type: 'range', min: 0.05, max: 0.5, step: 0.01, val: 0.15 },
    { key: 'b', label: 'Spiral B', labelZh: '螺旋B', type: 'range', min: 0.1, max: 0.5, step: 0.01, val: 0.25 },
    { key: 'arms', label: 'Arms', labelZh: '旋臂数', type: 'range', min: 2, max: 6, step: 1, val: 3 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 20 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#ff6b35' },
  ],
  formula(cfg) {
    return [
      `r(\u03B8) = a\u00B7e^(b\u00B7\u03B8)`,
      `a = ${cfg.a}, b = ${cfg.b}`,
      `Arms: ${cfg.arms}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 6;
    const rotation = (time % 30000) / 30000 * Math.PI * 2;
    const theta = t + rotation;
    const r = (cfg.a as number) * Math.exp((cfg.b as number) * t) * 38;
    return { x: 50 + r * Math.cos(theta), y: 50 + r * Math.sin(theta) };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 300);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.45,
      baseRadius: 0.4,
      maxRadius: 2.0,
      minOpacity: 0.03,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const t = progress * Math.PI * 6;
const rotation = (time % 30000) / 30000 * Math.PI * 2;
const theta = t + rotation;
const r = ${cfg.a} * Math.exp(${cfg.b} * t) * 38;
return {
  x: 50 + r * Math.cos(theta),
  y: 50 + r * Math.sin(theta)
};`;
  },
};

export const dnaHelix: AnimationDef = {
  id: 'dna-helix',
  category: 'Spiral',
  name: 'DNA Helix',
  tag: 'Parametric Double Spiral',
  params: [
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 40, max: 160, step: 1, val: 80 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.25 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 5000, max: 20000, step: 100, val: 10000 },
    { key: 'radius', label: 'Radius', labelZh: '半径', type: 'range', min: 10, max: 35, step: 1, val: 20 },
    { key: 'turns', label: 'Turns', labelZh: '圈数', type: 'range', min: 1, max: 6, step: 0.5, val: 3 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 160 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#10b981' },
  ],
  formula(cfg) {
    return [
      `x = r\u00B7cos(t) + offset`,
      `y = t (vertical)`,
      `z = r\u00B7sin(t)`,
      `Double helix with ${cfg.turns} turns`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2 * (cfg.turns as number);
    const rot = (time % 20000) / 20000 * Math.PI * 2;
    const angle = t + rot;
    return { x: 50 + (cfg.radius as number) * Math.cos(angle), y: 50 + (progress - 0.5) * 70 };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 200);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.6,
      maxRadius: 2.0,
      minOpacity: 0.08,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const t = progress * Math.PI * 2 * ${cfg.turns};
const rot = (time % 20000) / 20000 * Math.PI * 2;
const angle = t + rot;
return {
  x: 50 + ${cfg.radius} * Math.cos(angle),
  y: 50 + (progress - 0.5) * 70
};`;
  },
};
