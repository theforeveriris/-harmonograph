import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

/* ============================================================
   Cycloid / 摆线
   滚动圆在直线上生成的摆线
   ============================================================ */
export const cycloid: AnimationDef = {
  id: 'cycloid',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Cycloid',
  nameZh: '摆线',
  tag: 'Rolling Circle on Line',
  params: [
    // --- Curve geometry ---
    { key: 'r', label: 'Wheel Radius', labelZh: '滚轮半径', type: 'range', min: 3, max: 15, step: 1, val: 8 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.3, max: 2, step: 0.1, val: 0.7 },
    // --- Particles ---
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.35 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 6000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 240 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 20 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 80 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    // --- Static fallback color ---
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#6366f1' },
  ],
  formula(cfg) {
    const r = cfg.r as number;
    return [
      `x = r(t - sin(t))`,
      `y = r(1 - cos(t))`,
      `r = ${r}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const r = cfg.r as number;
    const scale = cfg.scale as number;
    const t = progress * Math.PI * 4;
    const x = r * (t - Math.sin(t));
    const y = r * (1 - Math.cos(t));
    const pulse = 1 + Math.sin(((time % 4000) / 4000) * Math.PI * 2) * 0.05;
    return {
      x: 10 + x * pulse * scale,
      y: 50 + y * pulse * scale,
    };
  },
  getRotation(_time, _cfg) {
    return 0;
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
    const r = cfg.r as number;
    const scale = cfg.scale as number;
    return `const t = progress * Math.PI * 4;
const r = ${r}, scale = ${scale};
const x = r * (t - Math.sin(t));
const y = r * (1 - Math.cos(t));
const pulse = 1 + Math.sin(((time % 4000) / 4000) * Math.PI * 2) * 0.05;
return {
  x: 10 + x * pulse * scale,
  y: 50 + y * pulse * scale
};`;
  },
};
