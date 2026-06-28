import type { AnimationDef, LiveConfig } from '../types';

/**
 * Generate a complete, standalone HTML file that reproduces the current
 * animation with the given live config. The output can be saved as .html
 * and opened directly in a browser.
 */
export function generateStandaloneHTML(animation: AnimationDef, cfg: LiveConfig): string {
  const title = `${animation.name} — ${animation.nameZh}`;
  const bgColor = (cfg.backgroundColor as string) || '#050505';
  const color = (cfg.color as string) || '#f5f5f5';

  // Get the point function code from the animation's code() method
  const pointCode = animation.code(cfg);

  // Build the formula text
  const formulaText = animation.formula(cfg)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Determine if the animation uses rotation
  const rotationSpeed = (cfg.rotationSpeed as number) ?? 1;
  const hasRotation = rotationSpeed > 0;
  const durationMs = (cfg.durationMs as number) || 7000;

  // Build config object with ALL parameters from liveConfig
  const configEntries = Object.entries(cfg)
    .filter(([key]) => key !== 'backgroundColor' && key !== 'color')
    .map(([key, value]) => {
      if (typeof value === 'string') return `      ${key}: '${value}',`;
      return `      ${key}: ${JSON.stringify(value)},`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHTML(title)}</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; margin: 0; }
    body {
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: ${bgColor};
      color: #f5f5f5;
      font-family: Inter, system-ui, sans-serif;
    }
    .demo { display: grid; gap: 20px; justify-items: center; padding: 32px; }
    .frame { width: min(72vmin, 420px); aspect-ratio: 1; }
    svg { width: 100%; height: 100%; overflow: visible; }
    .meta { text-align: center; }
    .title { font-size: 22px; font-weight: 700; }
    .tag { font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.58); }
    .formula { max-width: min(92vw, 720px); padding: 14px 16px; border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.82); font: 13px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="demo">
    <div class="frame">
      <svg viewBox="${(50 - 50 * (cfg.zoom as number || 1)).toFixed(1)} ${(50 - 50 * (cfg.zoom as number || 1)).toFixed(1)} ${(100 * (cfg.zoom as number || 1)).toFixed(1)} ${(100 * (cfg.zoom as number || 1)).toFixed(1)}" fill="none" aria-hidden="true">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g id="group">
          <path id="path" stroke="${color}" stroke-width="${cfg.strokeWidth || 2.5}" stroke-linecap="round" stroke-linejoin="round" opacity="${cfg.pathOpacity || 0.15}"${(cfg.pathGlow as number) > 0 ? ' filter="url(#glow)"' : ''}></path>
        </g>
      </svg>
    </div>
    <div class="meta">
      <div class="title">${escapeHTML(animation.name)} / ${escapeHTML(animation.nameZh)}</div>
      <div class="tag">${escapeHTML(animation.tag)}</div>
    </div>
    <pre class="formula">${formulaText}</pre>
  </div>
  <script>
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const config = {
${configEntries}
    };

    const group = document.querySelector('#group');
    const path = document.querySelector('#path');

    // --- Point function (from live parameters) ---
    function point(progress, time, cfg) {
      cfg = cfg || config;
${indentLines(pointCode, 6)}
    }

    // --- Build SVG path ---
    function buildPath(time, steps) {
      steps = steps || (config.pathResolution || 400);
      let d = '';
      for (let i = 0; i <= steps; i++) {
        const pt = point(i / steps, time);
        d += (i === 0 ? 'M ' : 'L ') + pt.x.toFixed(2) + ' ' + pt.y.toFixed(2) + ' ';
      }
      return d;
    }

    // --- Particles ---
    const particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('fill', 'hsl(' + (config.hueBase || 280) + ', ' + (config.satBase || 70) + '%, ' + (config.lightBase || 67) + '%)');
      group.appendChild(circle);
      particles.push(circle);
    }

    function normalizeProgress(p) { return ((p % 1) + 1) % 1; }

    function getParticle(index, progress, time) {
      const count = config.particleCount;
      const tailOffset = index / (count - 1);
      const pt = point(normalizeProgress(progress - tailOffset * config.trailSpan), time);
      const fade = Math.pow(1 - tailOffset, config.particleFadePower || 0.56);
      const baseRadius = config.particleBaseRadius || 0.9;
      const maxRadius = config.particleMaxRadius || 2.7;
      const minOpacity = config.particleMinOpacity || 0.04;
      const pulseAmount = config.particlePulse || 0;
      const pulseSpeed = config.particlePulseSpeed || 3;
      const pulse = pulseAmount * (Math.sin(time / 1000 * pulseSpeed + index * 0.3) * 0.5 + 0.5);
      return {
        x: pt.x,
        y: pt.y,
        radius: baseRadius + fade * (maxRadius - baseRadius) + pulse,
        opacity: minOpacity + fade * (1 - minOpacity)
      };
    }

    // --- Animation loop ---
    const startedAt = performance.now();
    function render(now) {
      const time = now - startedAt;
      const effectiveTime = config.animationDirection < 0 ? -time : time;
      const progress = (time % config.durationMs) / config.durationMs;

      // Rotation
      ${hasRotation ? `const rot = ((effectiveTime % ${durationMs * 4}) / ${durationMs * 4}) * 360 * config.rotationSpeed;
      group.setAttribute('transform', 'rotate(' + rot.toFixed(2) + ' 50 50)');` : '// No rotation'}

      // Path
      path.setAttribute('d', buildPath(effectiveTime));

      // Dynamic path color (HSL cycling)
      const t = time / 1000;
      const hueSpeed = config.hueSpeed || 8;
      const satRange = config.satRange || 30;
      const lightRange = config.lightRange || 18;
      const h = (config.hueBase + t * hueSpeed) % 360;
      const s = config.satBase + Math.sin(t * 1.3) * satRange;
      const l = config.lightBase + Math.cos(t * 0.9) * lightRange;
      path.setAttribute('stroke', 'hsl(' + h.toFixed(1) + ', ' + s.toFixed(1) + '%, ' + l.toFixed(1) + '%)');

      // Path breathing opacity
      const breathSpeed = config.pathBreathingSpeed || 1.5;
      const breathe = 0.5 + Math.sin(t * breathSpeed) * 0.25;
      path.setAttribute('opacity', Math.max(0.08, breathe * config.pathOpacity * 0.9).toFixed(3));

      // Particles
      for (let i = 0; i < config.particleCount; i++) {
        const p = getParticle(i, progress, effectiveTime);
        const tailOffset = i / (config.particleCount - 1);
        const ph = (config.hueBase + t * hueSpeed + tailOffset * config.hueSpread) % 360;
        const ps = config.satBase + Math.sin(t * 1.3 + tailOffset * 4) * satRange;
        const pl = config.lightBase + Math.cos(t * 0.9 + tailOffset * 3) * lightRange;
        particles[i].setAttribute('cx', p.x.toFixed(2));
        particles[i].setAttribute('cy', p.y.toFixed(2));
        particles[i].setAttribute('r', p.radius.toFixed(2));
        particles[i].setAttribute('opacity', p.opacity.toFixed(3));
        particles[i].setAttribute('fill', 'hsl(' + ph.toFixed(1) + ', ' + ps.toFixed(1) + '%, ' + pl.toFixed(1) + '%)');
      }

      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  </script>
</body>
</html>`;
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function indentLines(code: string, spaces: number): string {
  const indent = ' '.repeat(spaces);
  return code
    .split('\n')
    .map((line) => (line.trim() ? indent + line : ''))
    .join('\n');
}
