import type { AnimationDef, LiveConfig, ParamDef } from '../types';

interface ParametersProps {
  animation: AnimationDef;
  liveConfig: LiveConfig;
  onConfigChange: (key: string, value: number | string) => void;
}

function ParamField({
  param,
  value,
  onChange,
}: {
  param: ParamDef;
  value: number | string;
  onChange: (key: string, value: number | string) => void;
}) {
  if (param.type === 'range') {
    return (
      <div className="param-field">
        <div className="param-label">
          <span>{param.label}{param.labelZh ? ` / ${param.labelZh}` : ''}</span>
          <span>{value}</span>
        </div>
        <input
          type="range"
          className="param-input"
          min={param.min}
          max={param.max}
          step={param.step}
          value={value}
          onChange={(e) => onChange(param.key, parseFloat(e.target.value))}
        />
      </div>
    );
  }

  if (param.type === 'color') {
    return (
      <div className="param-field">
        <div className="param-label">
          <span>{param.label}{param.labelZh ? ` / ${param.labelZh}` : ''}</span>
          <span>{value}</span>
        </div>
        <input
          type="color"
          className="param-input"
          value={value as string}
          onChange={(e) => onChange(param.key, e.target.value)}
        />
      </div>
    );
  }

  if (param.type === 'number') {
    return (
      <div className="param-field">
        <div className="param-label">
          <span>{param.label}{param.labelZh ? ` / ${param.labelZh}` : ''}</span>
          <span>{value}</span>
        </div>
        <input
          type="number"
          className="param-input"
          value={value}
          onChange={(e) => onChange(param.key, parseFloat(e.target.value))}
        />
      </div>
    );
  }

  return null;
}

export function Parameters({ animation, liveConfig, onConfigChange }: ParametersProps) {
  return (
    <section>
      <div className="section-label">Parameters</div>
      <div className="params-box">
        <div className="params-grid">
          {animation.params.map((p) => (
            <ParamField
              key={p.key}
              param={p}
              value={liveConfig[p.key]}
              onChange={onConfigChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
