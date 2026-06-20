import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const conicEllipse: AnimationDef = {
  id: 'conic-ellipse',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Conic Ellipse',
  nameZh: '圆锥椭圆',
  tag: 'Eccentricity Orbit',
  params: [
    // --- Curve geometry ---
    { key: 'a', label: 'Semi-major', labelZh: '半长轴', type: 'range', min: 15, max: 40, step: 1, val: 30 },
    { key: 'b', label: 'Semi-minor', labelZh: '半短轴', type: 'range', min: 10, max: 35, step: 1, val: 20 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.0 },
    // --- Timing ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.35 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 5000, max: 20000, step: 100, val: 7000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 260 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 20 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 80 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#8b5cf6' },
  ],
  formula(cfg) {
    return [
      `x = 50 + a(t)\u00B7cos(t)\u00B7scale`,
      `y = 50 + b(t)\u00B7sin(t)\u00B7scale`,
      `a(t) breathes around ${cfg.a}`,
      `b(t) breathes around ${cfg.b}`,
      `scale = ${cfg.scale}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const pulse = 1 + Math.sin((time % 5000) / 5000 * Math.PI * 2) * 0.12;
    const a = (cfg.a as number) * pulse;
    const b = (cfg.b as number) * pulse;
    const scale = cfg.scale as number;
    return { x: 50 + a * Math.cos(t) * scale, y: 50 + b * Math.sin(t) * scale };
  },
  getRotation(time, _cfg) {
    return -((time % 15000) / 15000) * 360;
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
    return `const t = progress * Math.PI * 2;
const breath = Math.sin(time / 2000) * 2;
const a = ${cfg.a} + breath;
const b = ${cfg.b} + breath * 0.6;
return {
  x: 50 + a * Math.cos(t) * ${cfg.scale},
  y: 50 + b * Math.sin(t) * ${cfg.scale}
};`;
  },
};
