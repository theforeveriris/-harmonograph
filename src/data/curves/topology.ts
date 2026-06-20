import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const trefoilKnot: AnimationDef = {
  id: 'trefoil-knot',
  category: 'Topology',
  name: 'Trefoil Knot',
  tag: '3D Topology Projection',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 50, max: 200, step: 1, val: 144 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.4 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    { key: 'scale', label: 'Scale', type: 'range', min: 5, max: 20, step: 0.5, val: 12 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', type: 'range', min: 0, max: 360, step: 1, val: 270 },
    { key: 'hueSpeed', label: 'Hue Speed', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', type: 'color', val: '#a855f7' },
  ],
  formula(cfg) {
    return [
      `x = sin(t) + 2sin(2t)`,
      `y = cos(t) - 2cos(2t)`,
      `z = -sin(3t)`,
      `3D rotation + perspective projection`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const rot = (time % 25000) / 25000 * Math.PI * 2;
    const x = Math.sin(t) + 2 * Math.sin(2 * t);
    const y = Math.cos(t) - 2 * Math.cos(2 * t);
    const z = -Math.sin(3 * t);
    const xr = x * Math.cos(rot) + z * Math.sin(rot);
    const zr = -x * Math.sin(rot) + z * Math.cos(rot);
    const perspective = 40 / (40 + zr * 0.5);
    return { x: 50 + xr * (cfg.scale as number) * perspective, y: 50 + y * (cfg.scale as number) * perspective, depth: zr };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.55,
      baseRadius: 0.6,
      maxRadius: 2.2,
      minOpacity: 0.05,
      depthAware: true,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code() {
    return `const x = Math.sin(t) + 2 * Math.sin(2*t);
const y = Math.cos(t) - 2 * Math.cos(2*t);
const z = -Math.sin(3*t);
// 3D rotation around Y axis
const xr = x * Math.cos(rot) + z * Math.sin(rot);
const zr = -x * Math.sin(rot) + z * Math.cos(rot);
const perspective = 40 / (40 + zr * 0.5);
return {
  x: 50 + xr * scale * perspective,
  y: 50 + y * scale * perspective
};`;
  },
};

export const kleinBottle: AnimationDef = {
  id: 'klein-bottle',
  category: 'Topology',
  name: 'Klein Bottle',
  tag: 'Non-Orientable Surface',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 50, max: 200, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.35 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 5000, max: 20000, step: 100, val: 10000 },
    { key: 'scale', label: 'Scale', type: 'range', min: 5, max: 20, step: 0.5, val: 12 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', type: 'range', min: 0, max: 360, step: 1, val: 258 },
    { key: 'hueSpeed', label: 'Hue Speed', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', type: 'color', val: '#8b5cf6' },
  ],
  formula(cfg) {
    return [
      `x = (a + cos(u/2)sin(v) - sin(u/2)sin(2v))cos(u)`,
      `y = (a + cos(u/2)sin(v) - sin(u/2)sin(2v))sin(u)`,
      `z = sin(u/2)sin(v) + cos(u/2)sin(2v)`,
      `a = 2`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const u = progress * Math.PI * 2;
    const v = (time % 6000) / 6000 * Math.PI * 2;
    const a = 2;
    const rot = (time % 20000) / 20000 * Math.PI * 2;
    const x = (a + Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v)) * Math.cos(u);
    const y = (a + Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v)) * Math.sin(u);
    const z = Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v);
    const xr = x * Math.cos(rot) + z * Math.sin(rot);
    const zr = -x * Math.sin(rot) + z * Math.cos(rot);
    const perspective = 40 / (40 + zr * 0.3);
    return { x: 50 + xr * (cfg.scale as number) * perspective, y: 50 + y * (cfg.scale as number) * perspective, depth: zr };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.55,
      baseRadius: 0.6,
      maxRadius: 2.0,
      minOpacity: 0.05,
      depthAware: true,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code() {
    return `const u = progress * Math.PI * 2;
const v = (time % 6000) / 6000 * Math.PI * 2;
const a = 2;
let x = (a + Math.cos(u/2)*Math.sin(v)
        - Math.sin(u/2)*Math.sin(2*v)) * Math.cos(u);
let y = (a + Math.cos(u/2)*Math.sin(v)
        - Math.sin(u/2)*Math.sin(2*v)) * Math.sin(u);
let z = Math.sin(u/2)*Math.sin(v)
        + Math.cos(u/2)*Math.sin(2*v);
// 3D rotation + perspective
const xr = x * Math.cos(rot) + z * Math.sin(rot);
const zr = -x * Math.sin(rot) + z * Math.cos(rot);
const perspective = 40 / (40 + zr * 0.3);
return {
  x: 50 + xr * scale * perspective,
  y: 50 + y * scale * perspective
};`;
  },
};
