import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const sineWaveRing: AnimationDef = {
  id: 'sine-ring',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Sine Wave Ring',
  nameZh: '正弦波环',
  tag: 'Circular Wave Interference',
  params: [
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.4 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 12000, step: 100, val: 6000 },
    { key: 'baseRadius', label: 'Base Radius', labelZh: '基础半径', type: 'range', min: 15, max: 35, step: 1, val: 25 },
    { key: 'waveCount', label: 'Wave Count', labelZh: '波纹数量', type: 'range', min: 4, max: 24, step: 1, val: 12 },
    { key: 'waveAmp', label: 'Wave Amp', labelZh: '波纹振幅', type: 'range', min: 2, max: 12, step: 0.5, val: 6 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 140 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Static Color', labelZh: '静态颜色', type: 'color', val: '#22c55e' },
  ],
  formula(cfg) {
    return [
      `r(θ) = R + A·sin(nθ + ωt)`,
      `R = ${cfg.baseRadius}, A = ${cfg.waveAmp}, n = ${cfg.waveCount}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
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
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const t = progress * Math.PI * 2;
const phase = (time % duration) / duration * Math.PI * 2;
const r = ${cfg.baseRadius} + ${cfg.waveAmp} * Math.sin(${cfg.waveCount} * t + phase);
return {
  x: 50 + r * Math.cos(t),
  y: 50 + r * Math.sin(t)
};`;
  },
};
