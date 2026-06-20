import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

const nodes = [
  { x: 50, y: 20 },
  { x: 20, y: 50 },
  { x: 80, y: 50 },
  { x: 50, y: 80 },
  { x: 35, y: 35 },
  { x: 65, y: 65 },
];

const edges: Array<[number, number]> = [
  [0, 1], [0, 2], [0, 4], [0, 5],
  [1, 3], [1, 4], [1, 5],
  [2, 3], [2, 4], [2, 5],
  [3, 4], [3, 5], [4, 5],
];

export const graphFlow: AnimationDef = {
  id: 'graph-flow',
  category: 'Network',
  name: 'Graph Flow',
  tag: 'Network Topology Animation',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 50, max: 150, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.3 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 4000, max: 12000, step: 100, val: 7000 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', type: 'range', min: 0, max: 360, step: 1, val: 330 },
    { key: 'hueSpeed', label: 'Hue Speed', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    // --- Static fallback color ---
    { key: 'color', label: 'Static Color', type: 'color', val: '#f472b6' },
  ],
  formula(cfg) {
    return [
      `Graph traversal with spring forces`,
      `Nodes: 6, Edges: 13`,
      `Force-directed layout`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}\u00B7t`,
    ].join('\n');
  },
  point(progress, time, _cfg) {
    const edgeIndex = Math.floor(progress * edges.length) % edges.length;
    const edgeProgress = (progress * edges.length) % 1;
    const edge = edges[edgeIndex];
    const n1 = nodes[edge[0]];
    const n2 = nodes[edge[1]];
    const wobble = Math.sin(time / 500 + progress * 10) * 2;
    return {
      x: n1.x + (n2.x - n1.x) * edgeProgress + wobble,
      y: n1.y + (n2.y - n1.y) * edgeProgress + wobble,
    };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 300);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.6,
      maxRadius: 2.0,
      minOpacity: 0.08,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code() {
    return `const edgeIndex = Math.floor(progress * edges.length) % edges.length;
const edgeProgress = (progress * edges.length) % 1;
const edge = edges[edgeIndex];
const n1 = nodes[edge[0]], n2 = nodes[edge[1]];
const wobble = Math.sin(time/500 + progress*10) * 2;
return {
  x: n1.x + (n2.x - n1.x) * edgeProgress + wobble,
  y: n1.y + (n2.y - n1.y) * edgeProgress + wobble
};`;
  },
};
