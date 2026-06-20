import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const hyperbola: AnimationDef = {
  id: 'hyperbola',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Hyperbola',
  nameZh: '双曲线',
  tag: 'Conic Section',
  params: [
    // --- Curve geometry ---
    { key: 'a', label: 'Semi-axis A', labelZh: '半轴A', type: 'range', min: 5, max: 25, step: 1, val: 12 },
    { key: 'b', label: 'Semi-axis B', labelZh: '半轴B', type: 'range', min: 3, max: 20, step: 1, val: 8 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.0 },
    // --- Timing ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.3 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.9 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.7 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.04 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.56 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 340 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 20 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 85 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 60 },
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
    { key: 'color', label: 'Static Color', labelZh: '静态颜色', type: 'color', val: '#f43f5e' },
  ],
  formula(cfg) {
    return [
      `x = a \u00B7 sec(t), y = b \u00B7 tan(t)`,
      `a = ${cfg.a}, b = ${cfg.b}`,
      `scale = ${cfg.scale}`,
      `pulse = 1 + sin(\u03C0 \u00B7 2 \u00B7 (time % 5000) / 5000) \u00B7 0.08`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = (progress - 0.5) * Math.PI * 1.8;
    const sec = 1 / Math.cos(t);
    const tan = Math.tan(t);
    if (Math.abs(sec) > 10 || Math.abs(tan) > 10) {
      return { x: 50, y: 50 };
    }
    const pulse = 1 + Math.sin(((time % 5000) / 5000) * Math.PI * 2) * 0.08;
    const a = cfg.a as number;
    const b = cfg.b as number;
    const scale = cfg.scale as number;
    return {
      x: 50 + a * sec * pulse * scale,
      y: 50 + b * tan * pulse * scale,
    };
  },
  getRotation(time, _cfg) {
    return -((time % 20000) / 20000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 300);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.56,
      baseRadius: 0.9,
      maxRadius: 2.7,
      minOpacity: 0.04,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const t = (progress - 0.5) * Math.PI * 1.8;
const sec = 1 / Math.cos(t);
const tan = Math.tan(t);
if (Math.abs(sec) > 10 || Math.abs(tan) > 10) {
  return { x: 50, y: 50 };
}
const pulse = 1 + Math.sin(((time % 5000) / 5000) * Math.PI * 2) * 0.08;
return {
  x: 50 + ${cfg.a} * sec * pulse * ${cfg.scale},
  y: 50 + ${cfg.b} * tan * pulse * ${cfg.scale}
};`;
  },
};
