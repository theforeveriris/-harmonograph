import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

/* ============================================================
   Fourier Series / 傅里叶级数
   谐波合成，方波逼近 —— 实时计算，无需预计算
   ============================================================ */

export const fourierSeries: AnimationDef = {
  id: 'fourier-series',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Fourier Series',
  nameZh: '傅里叶级数',
  tag: 'Harmonic Synthesis',
  params: [
    // --- Curve-specific ---
    { key: 'harmonics', label: 'Harmonics', labelZh: '谐波数', type: 'range', min: 1, max: 30, step: 1, val: 12 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.3 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.15 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.05 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.6 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.0 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.08 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.6 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 320 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 20 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 85 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    // --- Animation Control ---
    { key: 'rotationSpeed', label: 'Rotation Speed', labelZh: '旋转速度', type: 'range', min: 0, max: 5, step: 0.1, val: 0 },
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
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#f472b6' },
  ],
  formula(cfg) {
    const harmonics = cfg.harmonics as number;
    return [
      `f(x) = \u03A3 (4/\u03C0n)\u00B7sin(nx)`,
      `n = 1,3,5,...N`,
      `Square wave approximation`,
      `N = ${harmonics} harmonics`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const x = (progress - 0.5) * Math.PI * 4;
    const harmonics = cfg.harmonics as number;
    const t = (time % 6000) / 6000 * Math.PI * 2;
    let y = 0;
    for (let n = 1; n <= harmonics; n += 2) {
      y += (4 / (Math.PI * n)) * Math.sin(n * x + t);
    }
    return { x: 50 + x * 6, y: 50 - y * 15 };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.6,
      maxRadius: 2.0,
      minOpacity: 0.08,
    });
  },
  code(cfg) {
    const harmonics = cfg.harmonics as number;
    return `// Fourier Series - Square Wave Approximation
const harmonics = ${harmonics};
const x = (progress - 0.5) * Math.PI * 4;
const t = (time % 6000) / 6000 * Math.PI * 2;
let y = 0;
for (let n = 1; n <= harmonics; n += 2) {
  y += (4 / (Math.PI * n)) * Math.sin(n * x + t);
}
return { x: 50 + x * 6, y: 50 - y * 15 };`;
  },
};

/* ============================================================
   Beat Frequency / 拍频
   波的干涉，振幅调制 —— 实时计算，无需预计算
   ============================================================ */

export const beatFrequency: AnimationDef = {
  id: 'beat-frequency',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Beat Frequency',
  nameZh: '拍频',
  tag: 'Wave Interference',
  params: [
    // --- Curve-specific ---
    { key: 'f1', label: 'Frequency f\u2081', labelZh: '频率 f\u2081', type: 'range', min: 1, max: 20, step: 0.1, val: 8 },
    { key: 'f2', label: 'Frequency f\u2082', labelZh: '频率 f\u2082', type: 'range', min: 1, max: 20, step: 0.1, val: 8.5 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.3 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.15 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.05 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.6 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.0 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.08 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.6 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 180 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 20 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 85 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    // --- Animation Control ---
    { key: 'rotationSpeed', label: 'Rotation Speed', labelZh: '旋转速度', type: 'range', min: 0, max: 5, step: 0.1, val: 0 },
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
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#22d3ee' },
  ],
  formula(cfg) {
    const f1 = cfg.f1 as number;
    const f2 = cfg.f2 as number;
    const beatFreq = Math.abs(f1 - f2) / 2;
    return [
      `y = sin(f\u2081\u00B7x) + sin(f\u2082\u00B7x)`,
      `Beat freq = |f\u2081-f\u2082|/2`,
      `Amplitude modulation`,
      `f\u2081=${f1}, f\u2082=${f2}, beat=${beatFreq.toFixed(2)}`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const x = (progress - 0.5) * Math.PI * 4;
    const f1 = cfg.f1 as number;
    const f2 = cfg.f2 as number;
    const t = (time % 8000) / 8000 * Math.PI * 2;
    const y = Math.sin(f1 * x + t) + Math.sin(f2 * x + t);
    return { x: 50 + x * 7, y: 50 - y * 8 };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.6,
      maxRadius: 2.0,
      minOpacity: 0.08,
    });
  },
  code(cfg) {
    const f1 = cfg.f1 as number;
    const f2 = cfg.f2 as number;
    return `// Beat Frequency - Wave Interference
const f1 = ${f1}, f2 = ${f2};
const x = (progress - 0.5) * Math.PI * 4;
const t = (time % 8000) / 8000 * Math.PI * 2;
const y = Math.sin(f1 * x + t) + Math.sin(f2 * x + t);
return { x: 50 + x * 7, y: 50 - y * 8 };`;
  },
};

/* ============================================================
   Damped Oscillation / 阻尼振荡
   指数衰减简谐运动 —— 实时计算，无需预计算
   ============================================================ */

export const dampedOscillation: AnimationDef = {
  id: 'damped-oscillation',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Damped Oscillation',
  nameZh: '阻尼振荡',
  tag: 'Exponential Decay',
  params: [
    // --- Curve-specific ---
    { key: 'amplitude', label: 'Amplitude', labelZh: '振幅', type: 'range', min: 5, max: 40, step: 1, val: 30 },
    { key: 'frequency', label: 'Frequency', labelZh: '频率', type: 'range', min: 1, max: 10, step: 0.5, val: 3 },
    { key: 'damping', label: 'Damping', labelZh: '阻尼系数', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.4 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.3 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.15 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.05 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.6 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.0 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.08 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.6 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 260 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 20 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 85 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    // --- Animation Control ---
    { key: 'rotationSpeed', label: 'Rotation Speed', labelZh: '旋转速度', type: 'range', min: 0, max: 5, step: 0.1, val: 0 },
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
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#a78bfa' },
  ],
  formula(cfg) {
    const amplitude = cfg.amplitude as number;
    const frequency = cfg.frequency as number;
    const damping = cfg.damping as number;
    return [
      `y = A\u00B7e^(-\u03BBt)\u00B7sin(\u03C9t)`,
      `A=${amplitude}, \u03C9=${frequency}, \u03BB=${damping}`,
      `Underdamped harmonic motion`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const amplitude = cfg.amplitude as number;
    const frequency = cfg.frequency as number;
    const damping = cfg.damping as number;
    const t = progress * 6;
    const phase = (time % 8000) / 8000 * Math.PI * 2;
    const y = amplitude * Math.exp(-damping * t) * Math.sin(frequency * t + phase);
    return { x: 10 + progress * 80, y: 50 - y };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.6,
      maxRadius: 2.0,
      minOpacity: 0.08,
    });
  },
  code(cfg) {
    const amplitude = cfg.amplitude as number;
    const frequency = cfg.frequency as number;
    const damping = cfg.damping as number;
    return `// Damped Oscillation - Exponential Decay
const amplitude = ${amplitude};
const frequency = ${frequency};
const damping = ${damping};
const t = progress * 6;
const phase = (time % 8000) / 8000 * Math.PI * 2;
const y = amplitude * Math.exp(-damping * t) * Math.sin(frequency * t + phase);
return { x: 10 + progress * 80, y: 50 - y };`;
  },
};
