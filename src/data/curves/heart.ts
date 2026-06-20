import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const cardioidHeart: AnimationDef = {
  id: 'heart',
  category: 'Heart',
  name: 'Cardioid Heart',
  tag: 'Polar Romance',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 30, max: 200, step: 1, val: 128 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.45 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 2000, max: 15000, step: 100, val: 5000 },
    { key: 'scale', label: 'Scale', type: 'range', min: 0.5, max: 3, step: 0.1, val: 1.8 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', type: 'range', min: 0, max: 360, step: 1, val: 345 },
    { key: 'hueSpeed', label: 'Hue Speed', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', type: 'color', val: '#ff3366' },
  ],
  formula(cfg) {
    return [
      `x = 16sin\u00B3(t)`,
      `y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)`,
      `scale = ${cfg.scale}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const s = (cfg.scale as number) * (0.85 + Math.sin((time % 3000) / 3000 * Math.PI * 2) * 0.15);
    return {
      x: 50 + s * (16 * Math.pow(Math.sin(t), 3)),
      y: 50 - s * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    };
  },
  getRotation(_time, _cfg) {
    return ((0 % 20000) / 20000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 360);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.8,
      maxRadius: 2.5,
      minOpacity: 0.06,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code() {
    return `const t = progress * Math.PI * 2;
const s = scale * (0.85 + Math.sin(pulse) * 0.15);
return {
  x: 50 + s * (16 * Math.pow(Math.sin(t), 3)),
  y: 50 - s * (13 * Math.cos(t) - 5 * Math.cos(2*t)
              - 2 * Math.cos(3*t) - Math.cos(4*t))
};`;
  },
};

export const butterflyCurve: AnimationDef = {
  id: 'butterfly',
  category: 'Heart',
  name: 'Butterfly Curve',
  tag: 'Temple H. Fay, 1989',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 50, max: 200, step: 1, val: 140 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.4 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    { key: 'scale', label: 'Scale', type: 'range', min: 0.3, max: 1.5, step: 0.05, val: 0.8 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', type: 'range', min: 0, max: 360, step: 1, val: 290 },
    { key: 'hueSpeed', label: 'Hue Speed', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', type: 'color', val: '#e879f9' },
  ],
  formula(cfg) {
    return [
      `r = e^(sin t) - 2cos(4t) + sin\u2075((2t-\u03C0)/24)`,
      `x = r\u00B7sin(t)`,
      `y = r\u00B7cos(t)`,
      `scale = ${cfg.scale}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const t = progress * Math.PI * 24 - Math.PI * 12;
    const r = Math.exp(Math.sin(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin((2 * t - Math.PI) / 24), 5);
    return { x: 50 + r * Math.sin(t) * (cfg.scale as number), y: 50 - r * Math.cos(t) * (cfg.scale as number) };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 500);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.55,
      baseRadius: 0.6,
      maxRadius: 2.0,
      minOpacity: 0.05,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code() {
    return `const t = progress * Math.PI * 24 - Math.PI * 12;
const r = Math.exp(Math.sin(t))
        - 2 * Math.cos(4 * t)
        + Math.pow(Math.sin((2*t - Math.PI)/24), 5);
return {
  x: 50 + r * Math.sin(t) * scale,
  y: 50 - r * Math.cos(t) * scale
};`;
  },
};
