import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

/* ============================================================
   Fermat Spiral / 费马螺线
   抛物线增长螺线，双臂对称
   ============================================================ */
export const fermatSpiral: AnimationDef = {
  id: 'fermat-spiral',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Fermat Spiral',
  nameZh: '费马螺线',
  tag: 'Parabolic Growth',
  params: [
    // --- Curve geometry ---
    { key: 'a', label: 'Coefficient', labelZh: '系数', type: 'range', min: 1, max: 15, step: 1, val: 8 },
    { key: 'turns', label: 'Turns', labelZh: '圈数', type: 'range', min: 2, max: 10, step: 1, val: 6 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.3, max: 2, step: 0.1, val: 1.2 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.4 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 9000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 70 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 30 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 85 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 55 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#84cc16' },
  ],
  formula(cfg) {
    const a = cfg.a as number;
    const turns = cfg.turns as number;
    return [
      `r(θ) = ${a}·√θ`,
      `θ = progress · 2π · ${turns}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const a = cfg.a as number;
    const turns = cfg.turns as number;
    const scale = cfg.scale as number;
    const t = progress * Math.PI * 2 * turns;
    const r = a * Math.sqrt(t) * 1.2;
    const phase = ((time % 5000) / 5000) * Math.PI * 2;
    const rMod = r * (1 + Math.sin(phase) * 0.08);
    return {
      x: 50 + rMod * Math.cos(t) * scale,
      y: 50 + rMod * Math.sin(t) * scale,
    };
  },
  getRotation(time, _cfg) {
    return -((time % 20000) / 20000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.5,
      baseRadius: 0.7,
      maxRadius: 2.3,
      minOpacity: 0.06,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    const a = cfg.a as number;
    const turns = cfg.turns as number;
    const scale = cfg.scale as number;
    return `const t = progress * Math.PI * 2 * ${turns};
const r = ${a} * Math.sqrt(t) * 1.2;
const phase = ((time % 5000) / 5000) * Math.PI * 2;
const rMod = r * (1 + Math.sin(phase) * 0.08);
return {
  x: 50 + rMod * Math.cos(t) * ${scale},
  y: 50 + rMod * Math.sin(t) * ${scale}
};`;
  },
};
