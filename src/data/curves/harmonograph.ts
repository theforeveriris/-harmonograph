import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

/**
 * Harmonograph (谐振摆 / 摆式绘图仪)
 *
 * 发明于19世纪（英国科学家 Hugh Blackburn，约1844年）。
 * 利用两个或多个相互独立摆动的钟摆，带动笔在纸上做简谐振动。
 * 笔的位置由各个摆的组合运动决定，由于摆动逐渐衰减（阻尼），
 * 画出的图案呈螺旋状收缩，形成精美对称的曲线图形。
 *
 * 数学模型：
 *   x(t) = A1 * sin(f1 * t + p1) * e^(-d1 * t) + A2 * sin(f2 * t + p2) * e^(-d2 * t)
 *   y(t) = A3 * sin(f3 * t + p3) * e^(-d3 * t) + A4 * sin(f4 * t + p4) * e^(-d4 * t)
 *
 * 其中 A 为振幅，f 为频率，p 为相位，d 为阻尼系数。
 */

export const harmonograph: AnimationDef = {
  id: 'harmonograph',
  category: 'Harmonograph',
  name: 'Harmonograph',
  tag: 'Damped Pendulum Harmonics',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 50, max: 250, step: 1, val: 160 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.55 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 5000, max: 20000, step: 100, val: 12000 },
    { key: 'ampX1', label: 'Amp X1', type: 'range', min: 5, max: 40, step: 1, val: 25 },
    { key: 'freqX1', label: 'Freq X1', type: 'range', min: 1, max: 8, step: 0.5, val: 3 },
    { key: 'phaseX1', label: 'Phase X1', type: 'range', min: 0, max: 6.28, step: 0.1, val: 0 },
    { key: 'dampX1', label: 'Damp X1', type: 'range', min: 0.001, max: 0.1, step: 0.001, val: 0.015 },
    { key: 'ampY1', label: 'Amp Y1', type: 'range', min: 5, max: 40, step: 1, val: 25 },
    { key: 'freqY1', label: 'Freq Y1', type: 'range', min: 1, max: 8, step: 0.5, val: 2 },
    { key: 'phaseY1', label: 'Phase Y1', type: 'range', min: 0, max: 6.28, step: 0.1, val: 1.57 },
    { key: 'dampY1', label: 'Damp Y1', type: 'range', min: 0.001, max: 0.1, step: 0.001, val: 0.012 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', type: 'range', min: 0, max: 360, step: 1, val: 40 },
    { key: 'hueSpeed', label: 'Hue Speed', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Static Color', type: 'color', val: '#f59e0b' },
  ],
  formula(cfg) {
    return [
      `x(t) = ${cfg.ampX1}sin(${cfg.freqX1}t + ${(cfg.phaseX1 as number).toFixed(2)})e^(-${(cfg.dampX1 as number).toFixed(3)}t)`,
      `y(t) = ${cfg.ampY1}sin(${cfg.freqY1}t + ${(cfg.phaseY1 as number).toFixed(2)})e^(-${(cfg.dampY1 as number).toFixed(3)}t)`,
      `Damped harmonic oscillation superposition`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    // progress 0->1 maps to t 0->6*PI (multiple decay cycles)
    const t = progress * Math.PI * 6;
    const ax1 = cfg.ampX1 as number;
    const fx1 = cfg.freqX1 as number;
    const px1 = cfg.phaseX1 as number;
    const dx1 = cfg.dampX1 as number;
    const ay1 = cfg.ampY1 as number;
    const fy1 = cfg.freqY1 as number;
    const py1 = cfg.phaseY1 as number;
    const dy1 = cfg.dampY1 as number;

    const x = ax1 * Math.sin(fx1 * t + px1) * Math.exp(-dx1 * t);
    const y = ay1 * Math.sin(fy1 * t + py1) * Math.exp(-dy1 * t);

    return { x: 50 + x, y: 50 + y };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 600);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.5,
      baseRadius: 0.5,
      maxRadius: 2.0,
      minOpacity: 0.05,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code() {
    return `// Harmonograph: damped harmonic oscillation
const t = progress * Math.PI * 6;

const x = ampX1 * Math.sin(freqX1 * t + phaseX1)
        * Math.exp(-dampX1 * t);
const y = ampY1 * Math.sin(freqY1 * t + phaseY1)
        * Math.exp(-dampY1 * t);

return {
  x: 50 + x,
  y: 50 + y
};`;
  },
};
