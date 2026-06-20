import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const figureEight: AnimationDef = {
  id: 'figure-eight',
  category: 'Orbital',
  name: 'Figure-8 Orbit',
  tag: 'Lemniscate Gerono',
  params: [
    // --- Curve geometry ---
    { key: 'a', label: 'Amplitude', labelZh: '振幅', type: 'range', min: 15, max: 40, step: 1, val: 30 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.2 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 250, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 2000, max: 15000, step: 100, val: 7000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 30 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Static Color', labelZh: '静态颜色', type: 'color', val: '#ff8c00' },
  ],
  formula(cfg) {
    return [
      `x(t) = a\u00B7sin(t)`,
      `y(t) = a\u00B7sin(t)\u00B7cos(t)`,
      `a = ${(cfg.a as number).toFixed(1)}, scale = ${(cfg.scale as number).toFixed(1)}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const phase = (time % (cfg.durationMs as number)) / (cfg.durationMs as number) * Math.PI * 2;
    const x = (cfg.a as number) * Math.sin(t + phase);
    const y = (cfg.a as number) * Math.sin(t + phase) * Math.cos(t + phase);
    return {
      x: 50 + x * (cfg.scale as number),
      y: 50 + y * (cfg.scale as number),
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
      fadePower: 0.6,
      baseRadius: 0.6,
      maxRadius: 2.4,
      minOpacity: 0.03,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const t = progress * Math.PI * 2;
const phase = (time % ${(cfg.durationMs as number)}) / ${(cfg.durationMs as number)} * Math.PI * 2;
const x = ${(cfg.a as number).toFixed(1)} * Math.sin(t + phase);
const y = ${(cfg.a as number).toFixed(1)} * Math.sin(t + phase) * Math.cos(t + phase);
return {
  x: 50 + x * ${(cfg.scale as number).toFixed(1)},
  y: 50 + y * ${(cfg.scale as number).toFixed(1)}
};`;
  },
};

