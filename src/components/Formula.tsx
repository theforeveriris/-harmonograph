import type { AnimationDef, LiveConfig } from '../types';

interface FormulaProps {
  animation: AnimationDef;
  liveConfig: LiveConfig;
}

export function Formula({ animation, liveConfig }: FormulaProps) {
  const formulaText =
    typeof animation.formula === 'function'
      ? animation.formula(liveConfig)
      : animation.formula;

  return (
    <section>
      <div className="section-label">Formula</div>
      <div className="formula-box">
        <pre>{formulaText}</pre>
      </div>
    </section>
  );
}
