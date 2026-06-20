import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

/* ============================================================
   1. 海贝壳曲线 (Seashell) —— 对数螺线 + 椭圆截面
   ============================================================ */
export const seashell: AnimationDef = {
  id: 'seashell',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Seashell',
  nameZh: '海贝壳',
  tag: 'Logarithmic Spiral Shell',
  params: [
    { key: 'a', label: 'Base Radius', labelZh: '基础半径', type: 'range', min: 1, max: 8, step: 0.1, val: 3.5 },
    { key: 'b', label: 'Growth Rate', labelZh: '增长率', type: 'range', min: 0.05, max: 0.3, step: 0.01, val: 0.15 },
    { key: 'turns', label: 'Turns', labelZh: '圈数', type: 'range', min: 2, max: 6, step: 0.5, val: 4 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.3, max: 2, step: 0.1, val: 1.0 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 160 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.55 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 9000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 25 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 6 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 50 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 72 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 65 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#f4a460' },
  ],
  formula(cfg) {
    return [
      `r = ${cfg.a} * e^(${cfg.b} * θ)`,
      `θ = 0 → ${cfg.turns} * 2π`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const a = cfg.a as number;
    const b = cfg.b as number;
    const turns = cfg.turns as number;
    const scale = cfg.scale as number;
    const theta = progress * Math.PI * 2 * turns;
    const r = a * Math.exp(b * theta) * 2.5;
    return {
      x: 50 + r * Math.cos(theta) * scale,
      y: 50 + r * Math.sin(theta) * scale,
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
      fadePower: 0.55,
      baseRadius: 0.6,
      maxRadius: 2.4,
      minOpacity: 0.05,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const theta = progress * Math.PI * 2 * ${cfg.turns};
const r = ${cfg.a} * Math.exp(${cfg.b} * theta) * 2.5;
return {
  x: 50 + r * Math.cos(theta) * ${cfg.scale},
  y: 50 + r * Math.sin(theta) * ${cfg.scale}
};`;
  },
};

/* ============================================================
   2. 三叶草 (Shamrock) —— 三瓣对称闭合曲线
   ============================================================ */
export const shamrock: AnimationDef = {
  id: 'shamrock',
  category: 'Rose',
  categoryZh: '玫瑰',
  name: 'Shamrock',
  nameZh: '三叶草',
  tag: 'Three-Leaf Symmetry',
  params: [
    { key: 'a', label: 'Radius', labelZh: '半径', type: 'range', min: 10, max: 35, step: 1, val: 22 },
    { key: 'n', label: 'Leaf Count', labelZh: '叶片数', type: 'range', min: 2, max: 8, step: 1, val: 3 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.2 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 130 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 12000, step: 100, val: 7000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 120 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 7 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 55 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 75 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 62 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#32cd32' },
  ],
  formula(cfg) {
    return [
      `r = ${cfg.a} * cos(${cfg.n} * θ)`,
      `x = 50 + r * cos(θ) * ${cfg.scale}`,
      `y = 50 + r * sin(θ) * ${cfg.scale}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const a = cfg.a as number;
    const n = cfg.n as number;
    const scale = cfg.scale as number;
    const theta = progress * Math.PI * 2;
    const r = a * Math.cos(n * theta);
    return {
      x: 50 + r * Math.cos(theta) * scale,
      y: 50 + r * Math.sin(theta) * scale,
    };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 360);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.7,
      maxRadius: 2.3,
      minOpacity: 0.06,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const theta = progress * Math.PI * 2;
const r = ${cfg.a} * Math.cos(${cfg.n} * theta);
return {
  x: 50 + r * Math.cos(theta) * ${cfg.scale},
  y: 50 + r * Math.sin(theta) * ${cfg.scale}
};`;
  },
};

/* ============================================================
   3. 水滴曲线 (Teardrop) —— 水滴形闭合曲线
   ============================================================ */
export const teardrop: AnimationDef = {
  id: 'teardrop',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Teardrop',
  nameZh: '水滴',
  tag: 'Pear-Shaped Closed Loop',
  params: [
    { key: 'a', label: 'Width', labelZh: '宽度', type: 'range', min: 10, max: 35, step: 1, val: 25 },
    { key: 'b', label: 'Pointiness', labelZh: '尖锐度', type: 'range', min: 0.5, max: 3, step: 0.1, val: 1.5 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.3 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 120 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 12000, step: 100, val: 7000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 195 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 6 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 50 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 68 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#87ceeb' },
  ],
  formula(cfg) {
    return [
      `x = ${cfg.a} * cos(t)`,
      `y = ${cfg.a} * sin(t) * sin²(t/2)^${cfg.b}`,
      `scale = ${cfg.scale}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const a = cfg.a as number;
    const b = cfg.b as number;
    const scale = cfg.scale as number;
    const t = progress * Math.PI * 2;
    const x = a * Math.cos(t);
    const y = a * Math.sin(t) * Math.pow(Math.sin(t / 2), b);
    return {
      x: 50 + x * scale,
      y: 50 + y * scale,
    };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 360);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.7,
      maxRadius: 2.3,
      minOpacity: 0.06,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const t = progress * Math.PI * 2;
const x = ${cfg.a} * Math.cos(t);
const y = ${cfg.a} * Math.sin(t) * Math.pow(Math.sin(t / 2), ${cfg.b});
return {
  x: 50 + x * ${cfg.scale},
  y: 50 + y * ${cfg.scale}
};`;
  },
};

/* ============================================================
   4. 齿轮花 (Gear Flower) —— 齿轮状闭合曲线
   ============================================================ */
export const gearFlower: AnimationDef = {
  id: 'gear-flower',
  category: 'Rose',
  categoryZh: '玫瑰',
  name: 'Gear Flower',
  nameZh: '齿轮花',
  tag: 'Gear-Shaped Rose',
  params: [
    { key: 'R', label: 'Outer Radius', labelZh: '外半径', type: 'range', min: 10, max: 35, step: 1, val: 25 },
    { key: 'n', label: 'Teeth', labelZh: '齿数', type: 'range', min: 3, max: 16, step: 1, val: 8 },
    { key: 'depth', label: 'Tooth Depth', labelZh: '齿深', type: 'range', min: 1, max: 10, step: 0.5, val: 4 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.2 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 140 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 12000, step: 100, val: 8000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 280 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#da70d6' },
  ],
  formula(cfg) {
    return [
      `r = ${cfg.R} + ${cfg.depth} * cos(${cfg.n} * θ)`,
      `x = 50 + r * cos(θ) * ${cfg.scale}`,
      `y = 50 + r * sin(θ) * ${cfg.scale}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const R = cfg.R as number;
    const n = cfg.n as number;
    const depth = cfg.depth as number;
    const scale = cfg.scale as number;
    const theta = progress * Math.PI * 2;
    const r = R + depth * Math.cos(n * theta);
    return {
      x: 50 + r * Math.cos(theta) * scale,
      y: 50 + r * Math.sin(theta) * scale,
    };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 360);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.55,
      baseRadius: 0.6,
      maxRadius: 2.2,
      minOpacity: 0.05,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const theta = progress * Math.PI * 2;
const r = ${cfg.R} + ${cfg.depth} * Math.cos(${cfg.n} * theta);
return {
  x: 50 + r * Math.cos(theta) * ${cfg.scale},
  y: 50 + r * Math.sin(theta) * ${cfg.scale}
};`;
  },
};

/* ============================================================
   5. 雪花 (Snowflake) —— Koch-like 参数化雪花
   ============================================================ */
export const snowflake: AnimationDef = {
  id: 'snowflake',
  category: 'Curve',
  categoryZh: '曲线',
  name: 'Snowflake',
  nameZh: '雪花',
  tag: 'Six-Fold Symmetry',
  params: [
    { key: 'a', label: 'Radius', labelZh: '半径', type: 'range', min: 10, max: 35, step: 1, val: 28 },
    { key: 'n', label: 'Branches', labelZh: '分支数', type: 'range', min: 3, max: 12, step: 1, val: 6 },
    { key: 'm', label: 'Detail', labelZh: '细节度', type: 'range', min: 1, max: 8, step: 1, val: 4 },
    { key: 'scale', label: 'Scale', labelZh: '缩放', type: 'range', min: 0.5, max: 2, step: 0.1, val: 1.1 },
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 200, step: 1, val: 150 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 3000, max: 12000, step: 100, val: 8000 },
    { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 200 },
    { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 5 },
    { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 45 },
    { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 65 },
    { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 72 },
    { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#b0e0e6' },
  ],
  formula(cfg) {
    return [
      `r = ${cfg.a} * (1 + 0.3 * cos(${cfg.m} * θ))`,
      `θ = k * 2π / ${cfg.n}`,
      `scale = ${cfg.scale}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const a = cfg.a as number;
    const m = cfg.m as number;
    const scale = cfg.scale as number;
    const theta = progress * Math.PI * 2;
    const r = a * (1 + 0.3 * Math.cos(m * theta));
    return {
      x: 50 + r * Math.cos(theta) * scale,
      y: 50 + r * Math.sin(theta) * scale,
    };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 360);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.7,
      maxRadius: 2.3,
      minOpacity: 0.06,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code(cfg) {
    return `const theta = progress * Math.PI * 2;
const r = ${cfg.a} * (1 + 0.3 * Math.cos(${cfg.m} * theta));
return {
  x: 50 + r * Math.cos(theta) * ${cfg.scale},
  y: 50 + r * Math.sin(theta) * ${cfg.scale}
};`;
  },
};
