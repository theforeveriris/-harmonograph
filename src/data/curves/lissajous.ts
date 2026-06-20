import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const lissajous: AnimationDef = {
  id: 'lissajous',
  category: 'Lissajous',
  name: 'Lissajous',
  tag: 'Dual-Frequency Harmonics',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 30, max: 200, step: 1, val: 96 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.35 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 2000, max: 15000, step: 100, val: 6000 },
    { key: 'a', label: 'Freq A', type: 'range', min: 1, max: 10, step: 1, val: 3 },
    { key: 'b', label: 'Freq B', type: 'range', min: 1, max: 10, step: 1, val: 4 },
    { key: 'scale', label: 'Scale', type: 'range', min: 10, max: 45, step: 1, val: 35 },
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
    { key: 'color', label: 'Color', type: 'color', val: '#00d4ff' },
  ],
  formula(cfg) {
    return [
      `x(t) = A sin(${cfg.a}t + \u03B4)`,
      `y(t) = B sin(${cfg.b}t)`,
      `\u03B4 = \u03C0/4, A = B = ${cfg.scale}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const phaseShift = Math.sin((time % (cfg.durationMs as number)) / (cfg.durationMs as number) * Math.PI * 2) * 0.3;
    return {
      x: 50 + (cfg.scale as number) * Math.sin((cfg.a as number) * t + Math.PI / 4 + phaseShift),
      y: 50 + (cfg.scale as number) * Math.sin((cfg.b as number) * t),
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
      baseRadius: 0.6,
      maxRadius: 2.2,
      minOpacity: 0.05,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code() {
    return `const t = progress * Math.PI * 2;
const phaseShift = Math.sin(pulse) * 0.3;
return {
  x: 50 + scale * Math.sin(a * t + Math.PI/4 + phaseShift),
  y: 50 + scale * Math.sin(b * t)
};`;
  },
};
