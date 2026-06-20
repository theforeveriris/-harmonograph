import type { AnimationDef, LiveConfig } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

const cache: Record<string, string> = {};

function getSequence(cfg: LiveConfig): string {
  const key = String(cfg.iterations);
  if (cache[key]) return cache[key];
  let seq = 'FX';
  for (let i = 0; i < (cfg.iterations as number); i++) {
    let next = '';
    for (const c of seq) {
      if (c === 'X') next += 'X+YF';
      else if (c === 'Y') next += '-FX-Y';
      else next += c;
    }
    seq = next;
  }
  cache[key] = seq;
  return seq;
}

export const dragonCurve: AnimationDef = {
  id: 'dragon-curve',
  category: 'Fractal',
  name: 'Dragon Curve',
  tag: 'Fractal Space-Filling',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 50, max: 150, step: 1, val: 96 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.3 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 3000, max: 12000, step: 100, val: 6000 },
    { key: 'iterations', label: 'Iterations', type: 'range', min: 8, max: 14, step: 1, val: 12 },
    // --- Path appearance ---
    { key: 'strokeWidth', label: 'Stroke Width', type: 'range', min: 0.5, max: 10, step: 0.1, val: 3 },
    { key: 'pathOpacity', label: 'Path Opacity', type: 'range', min: 0, max: 1, step: 0.05, val: 0.5 },
    // --- Particles ---
    { key: 'particlePulse', label: 'Particle Pulse', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.3 },
    // --- Color (HSL dynamic) ---
    { key: 'hueBase', label: 'Hue Base', type: 'range', min: 0, max: 360, step: 1, val: 190 },
    { key: 'hueSpeed', label: 'Hue Speed', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
    { key: 'hueSpread', label: 'Hue Spread', type: 'range', min: 0, max: 180, step: 1, val: 60 },
    { key: 'satBase', label: 'Saturation', type: 'range', min: 20, max: 100, step: 1, val: 70 },
    { key: 'lightBase', label: 'Lightness', type: 'range', min: 30, max: 90, step: 1, val: 67 },
    { key: 'color', label: 'Color', type: 'color', val: '#22d3ee' },
  ],
  formula(cfg) {
    return [
      `Heighway Dragon Curve`,
      `L-system: FX → X+YF+, Y → -FX-Y`,
      `Iterations: ${cfg.iterations}`,
      `hue(t) = ${cfg.hueBase} + ${cfg.hueSpeed}·t`,
    ].join('\n');
  },
  point(progress, _time, cfg) {
    const seq = getSequence(cfg);
    const totalSteps = seq.length;
    const stepIndex = Math.floor(progress * totalSteps);
    let x = 50;
    let y = 80;
    let angle = 0;
    const stepSize = 0.8;
    for (let i = 0; i <= stepIndex; i++) {
      const c = seq[i];
      if (c === 'F') {
        x += stepSize * Math.cos((angle * Math.PI) / 180);
        y -= stepSize * Math.sin((angle * Math.PI) / 180);
      } else if (c === '+') angle += 90;
      else if (c === '-') angle -= 90;
    }
    return { x, y };
  },
  getRotation(_time, _cfg) {
    return ((0 % 15000) / 15000) * 360;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 500);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg, {
      fadePower: 0.6,
      baseRadius: 0.5,
      maxRadius: 1.8,
      minOpacity: 0.08,
      pulseAmount: cfg.particlePulse as number,
      pulseSpeed: 3,
    });
  },
  code() {
    return `// L-system generation
let seq = "FX";
for (let i = 0; i < iterations; i++) {
  let next = "";
  for (let c of seq) {
    if (c === "X") next += "X+YF";
    else if (c === "Y") next += "-FX-Y";
    else next += c;
  }
  seq = next;
}

// Turtle rendering
let x = 50, y = 80, angle = 0;
for (let c of seq.slice(0, stepIndex)) {
  if (c === "F") {
    x += stepSize * Math.cos(angle * \u03C0/180);
    y -= stepSize * Math.sin(angle * \u03C0/180);
  } else if (c === "+") angle += 90;
  else if (c === "-") angle -= 90;
}
return { x, y };`;
  },
};
