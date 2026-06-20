import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const originalRose: AnimationDef = {
  id: 'original-rose',
  category: 'Rose',
  name: 'Original Thinking',
  tag: 'Custom Rose Trail',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 30, max: 200, step: 1, val: 112 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 2000, max: 15000, step: 100, val: 7300 },
    { key: 'rotationDurationMs', label: 'Rotation (ms)', type: 'range', min: 5000, max: 60000, step: 500, val: 44500 },
    { key: 'strokeWidth', label: 'Stroke Width', type: 'range', min: 0.5, max: 10, step: 0.1, val: 4.1 },
    { key: 'baseRadius', label: 'Base Radius', type: 'range', min: 2, max: 15, step: 0.1, val: 8.1 },
    { key: 'detailAmplitude', label: 'Detail Amp', type: 'range', min: 0, max: 10, step: 0.1, val: 3.9 },
    { key: 'petalCount', label: 'Petal Count', type: 'range', min: 2, max: 16, step: 1, val: 8 },
    { key: 'curveScale', label: 'Curve Scale', type: 'range', min: 2, max: 8, step: 0.1, val: 4.5 },
    { key: 'color', label: 'Color', type: 'color', val: '#f5f5f5' },
  ],
  formula(cfg) {
    return [
      `x(t) = 50 + (${(cfg.baseRadius as number).toFixed(1)} cos t - ${(cfg.detailAmplitude as number).toFixed(1)}s cos ${Math.round(cfg.petalCount as number)}t) * ${(cfg.curveScale as number).toFixed(1)}`,
      `y(t) = 50 + (${(cfg.baseRadius as number).toFixed(1)} sin t - ${(cfg.detailAmplitude as number).toFixed(1)}s sin ${Math.round(cfg.petalCount as number)}t) * ${(cfg.curveScale as number).toFixed(1)}`,
      `s = 0.52 + 0.48 * (sin(2\u03C0t/T + 0.55) + 1)/2`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const petals = Math.round(cfg.petalCount as number);
    const pulse = (time % (cfg.durationMs as number)) / (cfg.durationMs as number) * Math.PI * 2;
    const s = 0.52 + ((Math.sin(pulse + 0.55) + 1) / 2) * 0.48;
    const x = (cfg.baseRadius as number) * Math.cos(t) - (cfg.detailAmplitude as number) * s * Math.cos(petals * t);
    const y = (cfg.baseRadius as number) * Math.sin(t) - (cfg.detailAmplitude as number) * s * Math.sin(petals * t);
    return { x: 50 + x * (cfg.curveScale as number), y: 50 + y * (cfg.curveScale as number) };
  },
  getRotation(time, cfg) {
    return -((time % (cfg.rotationDurationMs as number)) / (cfg.rotationDurationMs as number)) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 480);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg);
  },
  code() {
    return `const t = progress * Math.PI * 2;
const petals = Math.round(cfg.petalCount);
const s = 0.52 + ((Math.sin(pulse + 0.55) + 1) / 2) * 0.48;
const x = cfg.baseRadius * Math.cos(t) - cfg.detailAmplitude * s * Math.cos(petals * t);
const y = cfg.baseRadius * Math.sin(t) - cfg.detailAmplitude * s * Math.sin(petals * t);
return {
  x: 50 + x * cfg.curveScale,
  y: 50 + y * cfg.curveScale
};`;
  },
};

export const multiFreqRose: AnimationDef = {
  id: 'multi-freq-rose',
  category: 'Rose',
  name: 'Multi-Frequency Rose',
  tag: 'Harmonic Superposition',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 30, max: 200, step: 1, val: 112 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 2000, max: 15000, step: 100, val: 7300 },
    { key: 'baseRadius', label: 'Base Radius', type: 'range', min: 2, max: 15, step: 0.1, val: 8.1 },
    { key: 'detailAmplitude', label: 'Detail Amp', type: 'range', min: 0, max: 10, step: 0.1, val: 3.9 },
    { key: 'petalCount', label: 'Petal Count', type: 'range', min: 2, max: 16, step: 1, val: 8 },
    { key: 'secondaryFreq', label: '2nd Freq', type: 'range', min: 1, max: 12, step: 1, val: 3 },
    { key: 'secondaryAmp', label: '2nd Amp', type: 'range', min: 0, max: 5, step: 0.1, val: 1.5 },
    { key: 'curveScale', label: 'Curve Scale', type: 'range', min: 2, max: 8, step: 0.1, val: 4.5 },
    { key: 'color', label: 'Color', type: 'color', val: '#f5f5f5' },
  ],
  formula(cfg) {
    return [
      `x(t) = 50 + (${(cfg.baseRadius as number).toFixed(1)} cos t - ${(cfg.detailAmplitude as number).toFixed(1)}s cos ${Math.round(cfg.petalCount as number)}t - ${(cfg.secondaryAmp as number).toFixed(1)}s\u2032 cos ${(cfg.secondaryFreq as number)}t) * ${(cfg.curveScale as number).toFixed(1)}`,
      `y(t) = 50 + (${(cfg.baseRadius as number).toFixed(1)} sin t - ${(cfg.detailAmplitude as number).toFixed(1)}s sin ${Math.round(cfg.petalCount as number)}t - ${(cfg.secondaryAmp as number).toFixed(1)}s\u2032 sin ${(cfg.secondaryFreq as number)}t) * ${(cfg.curveScale as number).toFixed(1)}`,
      `s = detailScale(time), s\u2032 = secondaryScale(time)`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const petals = Math.round(cfg.petalCount as number);
    const pulse1 = (time % (cfg.durationMs as number)) / (cfg.durationMs as number) * Math.PI * 2;
    const pulse2 = (time % ((cfg.durationMs as number) * 1.5)) / ((cfg.durationMs as number) * 1.5) * Math.PI * 2;
    const s1 = 0.52 + ((Math.sin(pulse1 + 0.55) + 1) / 2) * 0.48;
    const s2 = 0.6 + ((Math.sin(pulse2 * 1.3 + 1.2) + 1) / 2) * 0.4;
    const x = (cfg.baseRadius as number) * Math.cos(t) - (cfg.detailAmplitude as number) * s1 * Math.cos(petals * t) - (cfg.secondaryAmp as number) * s2 * Math.cos((cfg.secondaryFreq as number) * t);
    const y = (cfg.baseRadius as number) * Math.sin(t) - (cfg.detailAmplitude as number) * s1 * Math.sin(petals * t) - (cfg.secondaryAmp as number) * s2 * Math.sin((cfg.secondaryFreq as number) * t);
    return { x: 50 + x * (cfg.curveScale as number), y: 50 + y * (cfg.curveScale as number) };
  },
  getRotation(_time, _cfg) {
    return -((0 % 44500) / 44500) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 480);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg);
  },
  code() {
    return `const t = progress * Math.PI * 2;
const s1 = 0.52 + ((Math.sin(pulse1 + 0.55) + 1) / 2) * 0.48;
const s2 = 0.6 + ((Math.sin(pulse2 * 1.3 + 1.2) + 1) / 2) * 0.4;
const x = baseRadius * Math.cos(t)
        - detailAmp * s1 * Math.cos(petals * t)
        - secondaryAmp * s2 * Math.cos(secondaryFreq * t);
const y = baseRadius * Math.sin(t)
        - detailAmp * s1 * Math.sin(petals * t)
        - secondaryAmp * s2 * Math.sin(secondaryFreq * t);
return { x: 50 + x * curveScale, y: 50 + y * curveScale };`;
  },
};
