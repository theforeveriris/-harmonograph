import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const sineWaveRing: AnimationDef = {
  id: 'sine-ring',
  category: 'Wave',
  name: 'Sine Wave Ring',
  tag: 'Circular Wave Interference',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 50, max: 200, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.4 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 3000, max: 12000, step: 100, val: 6000 },
    { key: 'baseRadius', label: 'Base Radius', type: 'range', min: 15, max: 35, step: 1, val: 25 },
    { key: 'waveCount', label: 'Wave Count', type: 'range', min: 4, max: 24, step: 1, val: 12 },
    { key: 'waveAmp', label: 'Wave Amp', type: 'range', min: 2, max: 12, step: 0.5, val: 6 },
    { key: 'color', label: 'Color', type: 'color', val: '#22c55e' },
  ],
  formula(cfg) {
    return [
      `r(\u03B8) = R + A\u00B7sin(n\u03B8 + \u03C9t)`,
      `R = ${cfg.baseRadius}, A = ${cfg.waveAmp}, n = ${cfg.waveCount}`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const phase = (time % (cfg.durationMs as number)) / (cfg.durationMs as number) * Math.PI * 2;
    const r = (cfg.baseRadius as number) + (cfg.waveAmp as number) * Math.sin((cfg.waveCount as number) * t + phase);
    return { x: 50 + r * Math.cos(t), y: 50 + r * Math.sin(t) };
  },
  getRotation(_time, _cfg) {
    return ((0 % 12000) / 12000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.55,
      baseRadius: 0.7,
      maxRadius: 2.2,
      minOpacity: 0.06,
    });
  },
  code() {
    return `const t = progress * Math.PI * 2;
const phase = (time % duration) / duration * Math.PI * 2;
const r = baseRadius + waveAmp * Math.sin(waveCount * t + phase);
return {
  x: 50 + r * Math.cos(t),
  y: 50 + r * Math.sin(t)
};`;
  },
};
