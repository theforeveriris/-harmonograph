import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const originalRose: AnimationDef = {
  id: 'original-rose',
  category: 'Rose',
  categoryZh: '玫瑰',
  name: 'Original Thinking',
  nameZh: '原创思维',
  tag: 'Custom Rose Trail',
  params: [
    // --- Curve geometry ---
    { key: 'baseRadius', label: 'Base Radius', labelZh: '基础半径', type: 'range', min: 2, max: 15, step: 0.1, val: 8.1 },
    { key: 'detailAmplitude', label: 'Detail Amp', labelZh: '细节振幅', type: 'range', min: 0, max: 10, step: 0.1, val: 3.9 },
    { key: 'petalCount', label: 'Petal Count', labelZh: '花瓣数量', type: 'range', min: 2, max: 16, step: 1, val: 8 },
    { key: 'curveScale', label: 'Curve Scale', labelZh: '曲线缩放', type: 'range', min: 2, max: 8, step: 0.1, val: 4.5 },
    // --- Timing ---
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 2000, max: 15000, step: 100, val: 7300 },
    { key: 'rotationDurationMs', label: 'Rotation (ms)', labelZh: '旋转周期', type: 'range', min: 5000, max: 60000, step: 500, val: 44500 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 4.1 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 250, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.55 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.9 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.7 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.04 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.56 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 280 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Animation Control ---
    { key: 'rotationSpeed', label: 'Rotation Speed', labelZh: '旋转速度', type: 'range', min: 0, max: 5, step: 0.1, val: 1 },
    { key: 'pathBreathingSpeed', label: 'Breathing Speed', labelZh: '呼吸速度', type: 'range', min: 0.1, max: 5, step: 0.1, val: 1.5 },
    { key: 'pathResolution', label: 'Path Resolution', labelZh: '路径精度', type: 'range', min: 60, max: 800, step: 10, val: 360 },
    { key: 'animationDirection', label: 'Direction', labelZh: '动画方向', type: 'range', min: -1, max: 1, step: 1, val: 1 },
    // --- Visual Enhancement ---
    { key: 'satRange', label: 'Saturation Range', labelZh: '饱和度范围', type: 'range', min: 0, max: 40, step: 1, val: 30 },
    { key: 'lightRange', label: 'Lightness Range', labelZh: '亮度范围', type: 'range', min: 0, max: 30, step: 1, val: 18 },
    { key: 'pathGlow', label: 'Path Glow', labelZh: '路径辉光', type: 'range', min: 0, max: 5, step: 0.5, val: 0 },
    // --- Global ---
    { key: 'zoom', label: 'Zoom', labelZh: '缩放', type: 'range', min: 0.3, max: 3, step: 0.1, val: 1 },
    { key: 'backgroundColor', label: 'Background', labelZh: '背景色', type: 'color', val: '#050505' },
    // --- Static fallback color ---
    { key: 'color', label: 'Static Color', labelZh: '静态颜色', type: 'color', val: '#f5f5f5' },
  ],
  formula(cfg) {
    return [
      `x(t) = 50 + (${(cfg.baseRadius as number).toFixed(1)} cos t - ${(cfg.detailAmplitude as number).toFixed(1)}s cos ${Math.round(cfg.petalCount as number)}t) * ${(cfg.curveScale as number).toFixed(1)}`,
      `y(t) = 50 + (${(cfg.baseRadius as number).toFixed(1)} sin t - ${(cfg.detailAmplitude as number).toFixed(1)}s sin ${Math.round(cfg.petalCount as number)}t) * ${(cfg.curveScale as number).toFixed(1)}`,
      `s = 0.52 + 0.48 * (sin(2\u03C0t/T + 0.55) + 1)/2`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
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
const petals = ${Math.round(cfg.petalCount as number)};
const pulse = (time % ${(cfg.durationMs as number)}) / ${(cfg.durationMs as number)} * Math.PI * 2;
const s = 0.52 + ((Math.sin(pulse + 0.55) + 1) / 2) * 0.48;
const x = ${(cfg.baseRadius as number).toFixed(1)} * Math.cos(t) - ${(cfg.detailAmplitude as number).toFixed(1)} * s * Math.cos(petals * t);
const y = ${(cfg.baseRadius as number).toFixed(1)} * Math.sin(t) - ${(cfg.detailAmplitude as number).toFixed(1)} * s * Math.sin(petals * t);
return {
  x: 50 + x * ${(cfg.curveScale as number).toFixed(1)},
  y: 50 + y * ${(cfg.curveScale as number).toFixed(1)}
};`;
  },
};

export const multiFreqRose: AnimationDef = {
  id: 'multi-freq-rose',
  category: 'Rose',
  categoryZh: '玫瑰',
  name: 'Multi-Frequency Rose',
  nameZh: '多频玫瑰',
  tag: 'Harmonic Superposition',
  params: [
    // --- Curve geometry ---
    { key: 'baseRadius', label: 'Base Radius', labelZh: '基础半径', type: 'range', min: 2, max: 15, step: 0.1, val: 8.1 },
    { key: 'detailAmplitude', label: 'Detail Amp', labelZh: '细节振幅', type: 'range', min: 0, max: 10, step: 0.1, val: 3.9 },
    { key: 'petalCount', label: 'Petal Count', labelZh: '花瓣数量', type: 'range', min: 2, max: 16, step: 1, val: 8 },
    { key: 'secondaryFreq', label: '2nd Freq', labelZh: '第二频率', type: 'range', min: 1, max: 12, step: 1, val: 3 },
    { key: 'secondaryAmp', label: '2nd Amp', labelZh: '第二振幅', type: 'range', min: 0, max: 5, step: 0.1, val: 1.5 },
    { key: 'curveScale', label: 'Curve Scale', labelZh: '曲线缩放', type: 'range', min: 2, max: 8, step: 0.1, val: 4.5 },
    // --- Timing ---
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 2000, max: 15000, step: 100, val: 7300 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 4.1 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 250, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.55 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.9 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.7 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.04 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.56 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 200 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 6 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 50 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 75 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    // --- Animation Control ---
    { key: 'rotationSpeed', label: 'Rotation Speed', labelZh: '旋转速度', type: 'range', min: 0, max: 5, step: 0.1, val: 1 },
    { key: 'pathBreathingSpeed', label: 'Breathing Speed', labelZh: '呼吸速度', type: 'range', min: 0.1, max: 5, step: 0.1, val: 1.5 },
    { key: 'pathResolution', label: 'Path Resolution', labelZh: '路径精度', type: 'range', min: 60, max: 800, step: 10, val: 360 },
    { key: 'animationDirection', label: 'Direction', labelZh: '动画方向', type: 'range', min: -1, max: 1, step: 1, val: 1 },
    // --- Visual Enhancement ---
    { key: 'satRange', label: 'Saturation Range', labelZh: '饱和度范围', type: 'range', min: 0, max: 40, step: 1, val: 30 },
    { key: 'lightRange', label: 'Lightness Range', labelZh: '亮度范围', type: 'range', min: 0, max: 30, step: 1, val: 18 },
    { key: 'pathGlow', label: 'Path Glow', labelZh: '路径辉光', type: 'range', min: 0, max: 5, step: 0.5, val: 0 },
    // --- Global ---
    { key: 'zoom', label: 'Zoom', labelZh: '缩放', type: 'range', min: 0.3, max: 3, step: 0.1, val: 1 },
    { key: 'backgroundColor', label: 'Background', labelZh: '背景色', type: 'color', val: '#050505' },
    // --- Static fallback color ---
    { key: 'color', label: 'Static Color', labelZh: '静态颜色', type: 'color', val: '#f5f5f5' },
  ],
  formula(cfg) {
    return [
      `x(t) = 50 + (${(cfg.baseRadius as number).toFixed(1)} cos t - ${(cfg.detailAmplitude as number).toFixed(1)}s cos ${Math.round(cfg.petalCount as number)}t - ${(cfg.secondaryAmp as number).toFixed(1)}s\u2032 cos ${(cfg.secondaryFreq as number)}t) * ${(cfg.curveScale as number).toFixed(1)}`,
      `y(t) = 50 + (${(cfg.baseRadius as number).toFixed(1)} sin t - ${(cfg.detailAmplitude as number).toFixed(1)}s sin ${Math.round(cfg.petalCount as number)}t - ${(cfg.secondaryAmp as number).toFixed(1)}s\u2032 sin ${(cfg.secondaryFreq as number)}t) * ${(cfg.curveScale as number).toFixed(1)}`,
      `s = detailScale(time), s\u2032 = secondaryScale(time)`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
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
const petals = ${Math.round(cfg.petalCount as number)};
const pulse1 = (time % ${(cfg.durationMs as number)}) / ${(cfg.durationMs as number)} * Math.PI * 2;
const pulse2 = (time % ${(cfg.durationMs as number) * 1.5}) / ${(cfg.durationMs as number) * 1.5} * Math.PI * 2;
const s1 = 0.52 + ((Math.sin(pulse1 + 0.55) + 1) / 2) * 0.48;
const s2 = 0.6 + ((Math.sin(pulse2 * 1.3 + 1.2) + 1) / 2) * 0.4;
const x = ${(cfg.baseRadius as number).toFixed(1)} * Math.cos(t)
        - ${(cfg.detailAmplitude as number).toFixed(1)} * s1 * Math.cos(${Math.round(cfg.petalCount as number)} * t)
        - ${(cfg.secondaryAmp as number).toFixed(1)} * s2 * Math.cos(${(cfg.secondaryFreq as number)} * t);
const y = ${(cfg.baseRadius as number).toFixed(1)} * Math.sin(t)
        - ${(cfg.detailAmplitude as number).toFixed(1)} * s1 * Math.sin(${Math.round(cfg.petalCount as number)} * t)
        - ${(cfg.secondaryAmp as number).toFixed(1)} * s2 * Math.sin(${(cfg.secondaryFreq as number)} * t);
return { x: 50 + x * ${(cfg.curveScale as number).toFixed(1)}, y: 50 + y * ${(cfg.curveScale as number).toFixed(1)} };`;
  },
};
