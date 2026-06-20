import type { AnimationDef } from '../../types';
import { buildPathGeneric, particleHSL } from './shared';

/* ============================================================
   Void Sigil / 虚空符印
   三层叠加的调制极坐标曲线，各层独立旋转
   r(θ,t) = A + B·sin(N·θ + ωt + φ)·s(t)
   ============================================================ */
export const voidSigil: AnimationDef = {
  id: 'void-sigil',
  category: 'Exotic',
  categoryZh: '异形',
  name: 'Void Sigil',
  nameZh: '虚空符印',
  tag: 'Multi-Layer Arcane Geometry',
  params: [
    // Outer curve
    { key: 'n1', label: 'Outer N', labelZh: '外层N', type: 'range', min: 2, max: 12, step: 1, val: 5 },
    { key: 'a1', label: 'Outer A', labelZh: '外层A', type: 'range', min: 5, max: 30, step: 1, val: 18 },
    { key: 'b1', label: 'Outer B', labelZh: '外层B', type: 'range', min: 1, max: 15, step: 0.5, val: 7 },
    // Mid curve
    { key: 'n2', label: 'Mid N', labelZh: '中层N', type: 'range', min: 2, max: 12, step: 1, val: 3 },
    { key: 'a2', label: 'Mid A', labelZh: '中层A', type: 'range', min: 5, max: 25, step: 1, val: 12 },
    { key: 'b2', label: 'Mid B', labelZh: '中层B', type: 'range', min: 1, max: 15, step: 0.5, val: 5 },
    // Inner curve
    { key: 'n3', label: 'Inner N', labelZh: '内层N', type: 'range', min: 2, max: 12, step: 1, val: 7 },
    { key: 'a3', label: 'Inner A', labelZh: '内层A', type: 'range', min: 3, max: 20, step: 1, val: 7 },
    { key: 'b3', label: 'Inner B', labelZh: '内层B', type: 'range', min: 1, max: 12, step: 0.5, val: 3 },
    // Global
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 3, step: 0.1, val: 2.0 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 200, step: 1, val: 60 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.6 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 12000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.2, max: 5, step: 0.1, val: 0.8 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.9 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.7 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.04 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.56 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 270 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 55 },
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
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#a78bfa' },
  ],
  formula(cfg) {
    return [
      `r(\u03B8,t) = A + B\u00B7sin(N\u00B7\u03B8 + \u03C9t + \u03C6)\u00B7s(t)`,
      `s(t) = 0.5 + 0.5\u00B7sin(2\u03C0t/12)`,
      `Outer: N=${cfg.n1}  \u03C9=+0.4  \u03C6=0`,
      `Mid:   N=${cfg.n2}  \u03C9=-0.6  \u03C6=\u03C0/3`,
      `Inner: N=${cfg.n3}  \u03C9=+0.8  \u03C6=\u03C0/2`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const baseScale = cfg.scale as number;
    const t = time / 1000;
    const s = 0.5 + 0.5 * Math.sin(t * 0.52);

    // Combine three layers: progress 0→0.4 = outer, 0.4→0.7 = mid, 0.7→1 = inner
    let n: number, a: number, b: number, speed: number, phase: number, scale: number;
    if (progress < 0.4) {
      n = cfg.n1 as number; a = cfg.a1 as number; b = cfg.b1 as number;
      speed = 0.4; phase = 0; scale = baseScale * 1.0; // outer: 2.0
    } else if (progress < 0.7) {
      n = cfg.n2 as number; a = cfg.a2 as number; b = cfg.b2 as number;
      speed = -0.6; phase = Math.PI / 3; scale = baseScale * 1.1; // mid: 2.2
    } else {
      n = cfg.n3 as number; a = cfg.a3 as number; b = cfg.b3 as number;
      speed = 0.8; phase = Math.PI / 2; scale = baseScale * 1.25; // inner: 2.5
    }

    const theta = progress * Math.PI * 2;
    const mod = b * Math.sin(n * theta + t * speed + phase) * s;
    const r = a + mod;
    return {
      x: 50 + r * Math.cos(theta) * scale,
      y: 50 + r * Math.sin(theta) * scale,
    };
  },
  getRotation(_time, _cfg) {
    return 0; // rotation handled inside point()
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    const count = cfg.particleCount as number;
    const tailOffset = index / (count - 1);
    const curveIdx = index % 3; // 0=outer, 1=mid, 2=inner

    const normalizeProgress = (p: number) => ((p % 1) + 1) % 1;
    const p = normalizeProgress(progress - tailOffset * (cfg.trailSpan as number));

    const baseScale = cfg.scale as number;
    const t = time / 1000;
    const s = 0.5 + 0.5 * Math.sin(t * 0.52);

    let n: number, a: number, b: number, speed: number, phase: number, scale: number;
    if (curveIdx === 0) {
      n = cfg.n1 as number; a = cfg.a1 as number; b = cfg.b1 as number;
      speed = 0.4; phase = 0; scale = baseScale * 1.0;
    } else if (curveIdx === 1) {
      n = cfg.n2 as number; a = cfg.a2 as number; b = cfg.b2 as number;
      speed = -0.6; phase = Math.PI / 3; scale = baseScale * 1.1;
    } else {
      n = cfg.n3 as number; a = cfg.a3 as number; b = cfg.b3 as number;
      speed = 0.8; phase = Math.PI / 2; scale = baseScale * 1.25;
    }

    const theta = p * Math.PI * 2;
    const mod = b * Math.sin(n * theta + t * speed + phase) * s;
    const r = a + mod;
    const x = 50 + r * Math.cos(theta) * scale;
    const y = 50 + r * Math.sin(theta) * scale;

    const fade = Math.pow(1 - tailOffset, 0.5);
    const pulseAmount = cfg.particlePulse as number;
    let radius = 0.4 + fade * 1.8;
    let opacity = 0.05 + fade * 0.95;

    if (pulseAmount > 0) {
      const pulse = 1 + Math.sin(t * 3 + index * 0.3) * pulseAmount;
      radius *= pulse;
      opacity *= (0.7 + Math.sin(t * 1.2 + tailOffset * 2) * 0.3);
    }

    // Per-layer color offset
    const layerHueOffset = curveIdx * 30;
    const color = particleHSL(time, tailOffset + layerHueOffset / 60, cfg);

    return { x, y, radius, opacity, color };
  },
  code(cfg) {
    return `const t = time / 1000;
const theta = progress * Math.PI * 2;
const s = 0.5 + 0.5 * Math.sin(t * 0.52);
const N = ${(cfg.n1 as number)}, A = ${(cfg.a1 as number)}, B = ${(cfg.b1 as number)};
const omega = 0.4, phi = 0;
const mod = B * Math.sin(N * theta + t * omega + phi) * s;
const r = A + mod;
return {
  x: 50 + r * Math.cos(theta) * ${(cfg.scale as number)},
  y: 50 + r * Math.sin(theta) * ${(cfg.scale as number)}
};`;
  },
};
