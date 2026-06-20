import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const torusKnot: AnimationDef = {
  id: 'torus-knot',
  category: 'Knot',
  categoryZh: '纽结',
  name: 'Torus Knot',
  nameZh: '环面纽结',
  tag: '(p,q) Torus Knot',
  params: [
    // --- Curve geometry ---
    { key: 'p', label: 'Meridian p', labelZh: '经线参数p', type: 'range', min: 1, max: 8, step: 1, val: 2 },
    { key: 'q', label: 'Latitude q', labelZh: '纬线参数q', type: 'range', min: 1, max: 8, step: 1, val: 3 },
    { key: 'R', label: 'Major Radius', labelZh: '大圆半径', type: 'range', min: 15, max: 35, step: 1, val: 25 },
    { key: 'r', label: 'Minor Radius', labelZh: '小圆半径', type: 'range', min: 3, max: 12, step: 0.5, val: 8 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.3, max: 1.2, step: 0.1, val: 0.7 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 250, step: 1, val: 160 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.55 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.9 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.7 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.04 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.56 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 200 },
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
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#4169e1' },
  ],
  formula(cfg) {
    return [
      `x = (R + r\u00B7cos(q\u00B7t))\u00B7cos(p\u00B7t)`,
      `y = (R + r\u00B7cos(q\u00B7t))\u00B7sin(p\u00B7t)`,
      `z = r\u00B7sin(q\u00B7t)`,
      `p = ${Math.round(cfg.p as number)}, q = ${Math.round(cfg.q as number)}`,
      `R = ${(cfg.R as number).toFixed(1)}, r = ${(cfg.r as number).toFixed(1)}`,
      `3D projection with Y-axis rotation`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const p = Math.round(cfg.p as number);
    const q = Math.round(cfg.q as number);
    const R = cfg.R as number;
    const r = cfg.r as number;
    const scale = cfg.scale as number;

    // 3D torus knot coordinates
    const x3d = (R + r * Math.cos(q * t)) * Math.cos(p * t);
    const y3d = (R + r * Math.cos(q * t)) * Math.sin(p * t);
    const z3d = r * Math.sin(q * t);

    // Time-based rotation around Y axis for 3D effect
    const rotY = (time % 12000) / 12000 * Math.PI * 2;
    const cosR = Math.cos(rotY);
    const sinR = Math.sin(rotY);

    const xRot = x3d * cosR - z3d * sinR;
    const zRot = x3d * sinR + z3d * cosR;

    // Perspective projection
    const perspective = 200;
    const depth = zRot + 50;
    const projScale = perspective / (perspective + depth);

    return {
      x: 50 + xRot * scale * projScale,
      y: 50 + y3d * scale * projScale,
      depth: zRot,
    };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 500);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.6,
      maxRadius: 2.4,
      minOpacity: 0.03,
      depthAware: true,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    const p = Math.round(cfg.p as number);
    const q = Math.round(cfg.q as number);
    const R = cfg.R as number;
    const r = cfg.r as number;
    const scale = cfg.scale as number;
    return `const t = progress * Math.PI * 2;
const p = ${p}, q = ${q};
const R = ${R}, r = ${r};
const scale = ${scale};

// 3D torus knot
const x3d = (R + r * Math.cos(q * t)) * Math.cos(p * t);
const y3d = (R + r * Math.cos(q * t)) * Math.sin(p * t);
const z3d = r * Math.sin(q * t);

// Time-based Y-axis rotation
const rotY = (time % 12000) / 12000 * Math.PI * 2;
const xRot = x3d * Math.cos(rotY) - z3d * Math.sin(rotY);
const zRot = x3d * Math.sin(rotY) + z3d * Math.cos(rotY);

// Perspective projection
const perspective = 200;
const depth = zRot + 50;
const projScale = perspective / (perspective + depth);

return {
  x: 50 + xRot * scale * projScale,
  y: 50 + y3d * scale * projScale,
  depth: zRot
};`;
  },
};

export const lissajousKnot: AnimationDef = {
  id: 'lissajous-knot',
  category: 'Knot',
  categoryZh: '纽结',
  name: 'Lissajous Knot',
  nameZh: '利萨如纽结',
  tag: '3D Lissajous Projection',
  params: [
    // --- Curve geometry ---
    { key: 'nx', label: 'Freq X', labelZh: 'X频率', type: 'range', min: 1, max: 6, step: 1, val: 3 },
    { key: 'ny', label: 'Freq Y', labelZh: 'Y频率', type: 'range', min: 1, max: 6, step: 1, val: 2 },
    { key: 'nz', label: 'Freq Z', labelZh: 'Z频率', type: 'range', min: 1, max: 6, step: 1, val: 5 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 10, max: 25, step: 1, val: 15 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 30, max: 250, step: 1, val: 150 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 15000, step: 100, val: 8000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.9 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.7 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.04 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.56 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 180 },
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
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#00ced1' },
  ],
  formula(cfg) {
    return [
      `x = cos(nx\u00B7t + \u03C0/2)`,
      `y = cos(ny\u00B7t)`,
      `z = cos(nz\u00B7t + \u03C0/4)`,
      `nx = ${Math.round(cfg.nx as number)}, ny = ${Math.round(cfg.ny as number)}, nz = ${Math.round(cfg.nz as number)}`,
      `3D rotation + perspective projection`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    const nx = Math.round(cfg.nx as number);
    const ny = Math.round(cfg.ny as number);
    const nz = Math.round(cfg.nz as number);
    const scale = cfg.scale as number;

    // 3D Lissajous coordinates
    const x3d = Math.cos(nx * t + Math.PI / 2);
    const y3d = Math.cos(ny * t);
    const z3d = Math.cos(nz * t + Math.PI / 4);

    // Time-based 3D rotation
    const rotY = (time % 15000) / 15000 * Math.PI * 2;
    const rotX = Math.PI * 0.3;
    const cosRY = Math.cos(rotY);
    const sinRY = Math.sin(rotY);
    const cosRX = Math.cos(rotX);
    const sinRX = Math.sin(rotX);

    // Rotate around Y
    const x1 = x3d * cosRY - z3d * sinRY;
    const z1 = x3d * sinRY + z3d * cosRY;

    // Rotate around X
    const y1 = y3d * cosRX - z1 * sinRX;
    const z2 = y3d * sinRX + z1 * cosRX;

    // Perspective projection
    const perspective = 200;
    const depth = z2 + 50;
    const projScale = perspective / (perspective + depth);

    return {
      x: 50 + x1 * scale * projScale,
      y: 50 + y1 * scale * projScale,
      depth: z2,
    };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 500);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.6,
      maxRadius: 2.4,
      minOpacity: 0.03,
      depthAware: true,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    const nx = Math.round(cfg.nx as number);
    const ny = Math.round(cfg.ny as number);
    const nz = Math.round(cfg.nz as number);
    const scale = cfg.scale as number;
    return `const t = progress * Math.PI * 2;
const nx = ${nx}, ny = ${ny}, nz = ${nz};
const scale = ${scale};

// 3D Lissajous
const x3d = Math.cos(nx * t + Math.PI / 2);
const y3d = Math.cos(ny * t);
const z3d = Math.cos(nz * t + Math.PI / 4);

// Time-based 3D rotation
const rotY = (time % 15000) / 15000 * Math.PI * 2;
const rotX = Math.PI * 0.3;
const x1 = x3d * Math.cos(rotY) - z3d * Math.sin(rotY);
const z1 = x3d * Math.sin(rotY) + z3d * Math.cos(rotY);
const y1 = y3d * Math.cos(rotX) - z1 * Math.sin(rotX);
const z2 = y3d * Math.sin(rotX) + z1 * Math.cos(rotX);

// Perspective projection
const perspective = 200;
const depth = z2 + 50;
const projScale = perspective / (perspective + depth);

return {
  x: 50 + x1 * scale * projScale,
  y: 50 + y1 * scale * projScale,
  depth: z2
};`;
  },
};
