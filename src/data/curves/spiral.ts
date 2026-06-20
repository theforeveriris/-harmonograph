import type { AnimationDef } from '../../types';
import { buildPathGeneric, particleHSL } from './shared';

/* ============================================================
   Spiral Galaxy / 螺旋星系
   多旋臂对数螺线，粒子按臂分配颜色
   ============================================================ */
export const spiralGalaxy: AnimationDef = {
  id: 'spiral-galaxy',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Spiral Galaxy',
  nameZh: '螺旋星系',
  tag: 'Logarithmic Spiral Arms',
  params: [
    { key: 'a', label: 'Growth Coeff', labelZh: '增长系数', type: 'range', min: 0.05, max: 0.4, step: 0.01, val: 0.15 },
    { key: 'b', label: 'Spread Coeff', labelZh: '扩展系数', type: 'range', min: 0.1, max: 0.5, step: 0.01, val: 0.25 },
    { key: 'arms', label: 'Arms', labelZh: '旋臂数', type: 'range', min: 2, max: 6, step: 1, val: 3 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 60, max: 300, step: 1, val: 160 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.6 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 20000, step: 100, val: 12000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.9 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.7 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.04 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.56 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 25 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 6 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 50 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 85 },
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
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#ff6b35' },
  ],
  formula(cfg) {
    return [
      `r(\u03B8) = ${cfg.a}\u00B7e^(${cfg.b}\u00B7\u03B8)`,
      `Arms: ${cfg.arms}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const a = cfg.a as number;
    const b = cfg.b as number;
    const arms = cfg.arms as number;
    // Build combined path: trace all arms sequentially
    // progress 0→1 covers all arms
    const armIdx = Math.floor(progress * arms);
    const armP = (progress * arms) - armIdx;
    const t = armP * Math.PI * 6;
    const armOffset = (armIdx / arms) * Math.PI * 2;
    const rotation = (time % 30000) / 30000 * Math.PI * 2;
    const theta = t + armOffset + rotation;
    const r = a * Math.exp(b * t) * 38;
    return {
      x: 50 + r * Math.cos(theta),
      y: 50 + r * Math.sin(theta),
    };
  },
  getRotation(_time, _cfg) {
    return 0; // rotation is handled inside point()
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    const arms = cfg.arms as number;
    const count = cfg.particleCount as number;
    const tailOffset = index / (count - 1);
    const arm = index % arms;

    // Normalize progress for this arm
    const normalizeProgress = (p: number) => ((p % 1) + 1) % 1;
    const armProgress = normalizeProgress(progress - tailOffset * (cfg.trailSpan as number));

    // Calculate point on this arm
    const a = cfg.a as number;
    const b = cfg.b as number;
    const t = armProgress * Math.PI * 6;
    const armOffset = (arm / arms) * Math.PI * 2;
    const rotation = (time % 30000) / 30000 * Math.PI * 2;
    const theta = t + armOffset + rotation;
    const r = a * Math.exp(b * t) * 38;
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);

    const fade = Math.pow(1 - tailOffset, 0.45);
    const pulseAmount = cfg.particlePulse as number;
    let radius = 0.4 + fade * 2.0;
    let opacity = 0.03 + fade * 0.97;

    if (pulseAmount > 0) {
      const ts = time / 1000;
      const pulse = 1 + Math.sin(ts * 3 + index * 0.3) * pulseAmount;
      radius *= pulse;
      opacity *= (0.7 + Math.sin(ts * 1.2 + tailOffset * 2) * 0.3);
    }

    // Per-arm color variation
    const armHueOffset = arm * (30 / arms);
    const color = particleHSL(time, tailOffset + armHueOffset / 60, cfg);

    return { x, y, radius, opacity, color };
  },
  code(cfg) {
    return `const t = progress * Math.PI * 6;
const armIndex = 0;
const armOffset = (armIndex / ${(cfg.arms as number)}) * Math.PI * 2;
const rotation = (time % 30000) / 30000 * Math.PI * 2;
const theta = t + armOffset + rotation;
const r = ${(cfg.a as number)} * Math.exp(${(cfg.b as number)} * t) * 38;
return {
  x: 50 + r * Math.cos(theta),
  y: 50 + r * Math.sin(theta)
};`;
  },
};
