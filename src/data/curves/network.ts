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
    { key: 'color', label: 'Color', type: 'color', val: '#f472b6' },
  ],
  formula(_cfg) {
    return [
      `Graph traversal with spring forces`,
      `Nodes: 6, Edges: 13`,
      `Force-directed layout`,
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
