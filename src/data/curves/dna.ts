import type { AnimationDef } from '../../types';
import { buildPathGeneric, particleHSL } from './shared';

/* ============================================================
   Double Helix DNA / 双螺旋DNA
   两条参数化螺旋链 + 连接桥
   ============================================================ */
export const doubleHelixDNA: AnimationDef = {
  id: 'double-helix-dna',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Double Helix DNA',
  nameZh: '双螺旋DNA',
  tag: 'Parametric Double Spiral',
  params: [
    { key: 'radius', label: 'Helix Radius', labelZh: '螺旋半径', type: 'range', min: 5, max: 35, step: 1, val: 20 },
    { key: 'turns', label: 'Turns', labelZh: '圈数', type: 'range', min: 1, max: 6, step: 0.5, val: 3 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 40, max: 200, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.25 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 10000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.25 },
    { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.9 },
    { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.7 },
    { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.04 },
    { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.56 },
    { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 150 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 6 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 50 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 80 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#10b981' },
  ],
  formula(cfg) {
    return [
      `x = 50 + ${cfg.radius}\u00B7cos(t + phase)`,
      `y = 50 + (progress - 0.5) \u00D7 70`,
      `Turns: ${cfg.turns}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, cfg) {
    const r = cfg.radius as number;
    const turns = cfg.turns as number;
    // Combined path: first half = strand 1, second half = strand 2
    if (progress < 0.5) {
      const p = progress / 0.5;
      const t = p * Math.PI * 2 * turns;
      const rot = (time % 20000) / 20000 * Math.PI * 2;
      const angle = t + rot;
      return {
        x: 50 + r * Math.cos(angle),
        y: 50 + (p - 0.5) * 70,
      };
    } else {
      const p = (progress - 0.5) / 0.5;
      const t = p * Math.PI * 2 * turns;
      const rot = (time % 20000) / 20000 * Math.PI * 2;
      const angle = t + Math.PI + rot;
      return {
        x: 50 + r * Math.cos(angle),
        y: 50 + (p - 0.5) * 70,
      };
    }
  },
  getRotation(_time, _cfg) {
    return 0; // rotation handled inside point()
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 300);
  },
  getParticle(index, progress, time, cfg) {
    const count = cfg.particleCount as number;
    const tailOffset = index / (count - 1);
    const strand = index % 2; // alternate between two strands

    const normalizeProgress = (p: number) => ((p % 1) + 1) % 1;
    const p = normalizeProgress(progress - tailOffset * (cfg.trailSpan as number));

    const r = cfg.radius as number;
    const turns = cfg.turns as number;
    const t = p * Math.PI * 2 * turns;
    const rot = (time % 20000) / 20000 * Math.PI * 2;
    const phase = strand === 0 ? 0 : Math.PI;
    const angle = t + phase + rot;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + (p - 0.5) * 70;

    const fade = Math.pow(1 - tailOffset, 0.6);
    const pulseAmount = cfg.particlePulse as number;
    let radius = 0.6 + fade * 2.0;
    let opacity = 0.08 + fade * 0.92;

    if (pulseAmount > 0) {
      const ts = time / 1000;
      const pulse = 1 + Math.sin(ts * 3 + index * 0.3) * pulseAmount;
      radius *= pulse;
      opacity *= (0.7 + Math.sin(ts * 1.2 + tailOffset * 2) * 0.3);
    }

    // Per-strand color: strand 0 = greenish, strand 1 = bluish
    const strandHueOffset = strand * 60;
    const color = particleHSL(time, tailOffset + strandHueOffset / 60, cfg);

    return { x, y, radius, opacity, color };
  },
  code(cfg) {
    return `const t = progress * Math.PI * 2 * ${cfg.turns};
const rot = (time % 20000) / 20000 * Math.PI * 2;
const angle = t + phase + rot;
return {
  x: 50 + ${cfg.radius} * Math.cos(angle),
  y: 50 + (progress - 0.5) * 70
};`;
  },
};
