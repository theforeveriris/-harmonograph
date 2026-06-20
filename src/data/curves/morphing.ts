import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const superellipse: AnimationDef = {
  id: 'superellipse',
  category: 'Morphing',
  name: 'Superellipse',
  tag: 'Lam\u00E9 Curve Deformation',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 50, max: 150, step: 1, val: 108 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.35 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 4000, max: 12000, step: 100, val: 7000 },
    { key: 'a', label: 'Width a', type: 'range', min: 20, max: 45, step: 1, val: 35 },
    { key: 'b', label: 'Height b', type: 'range', min: 20, max: 45, step: 1, val: 35 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', type: 'range', min: 0, max: 360, step: 1, val: 190 },
    { key: 'hueSpeed', label: 'Hue Speed', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    { key: 'color', label: 'Color', type: 'color', val: '#06b6d4' },
  ],
  formula(cfg) {
    return [
      `|x/a|\u207F + |y/b|\u207F = 1`,
      `n = 2 + sin(\u03C9t)  (morphs 2\u21926)`,
      `a = ${cfg.a}, b = ${cfg.b}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const n = 2 + (Math.sin((time % 5000) / 5000 * Math.PI * 2) + 1) * 2;
    const cos_t = Math.cos(t);
    const sin_t = Math.sin(t);
    return {
      x: 50 + (cfg.a as number) * (cos_t >= 0 ? 1 : -1) * Math.pow(Math.abs(cos_t), 2 / n),
      y: 50 + (cfg.b as number) * (sin_t >= 0 ? 1 : -1) * Math.pow(Math.abs(sin_t), 2 / n),
    };
  },
  getRotation(_time, _cfg) {
    return ((0 % 18000) / 18000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.55,
      baseRadius: 0.7,
      maxRadius: 2.4,
      minOpacity: 0.06,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code() {
    return `const t = progress * Math.PI * 2;
const n = 2 + (Math.sin(pulse) + 1) * 2;
const cos_t = Math.cos(t), sin_t = Math.sin(t);
return {
  x: 50 + a * sign(cos_t) * Math.pow(Math.abs(cos_t), 2/n),
  y: 50 + b * sign(sin_t) * Math.pow(Math.abs(sin_t), 2/n)
};`;
  },
};
