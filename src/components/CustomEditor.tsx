import { useState, useMemo, useCallback, useEffect } from 'react';
import type { AnimationDef, LiveConfig, ParamDef, Point2D } from '../types';
import { buildPathGeneric, getParticleGeneric } from '../data/curves/shared';
import { Canvas } from './Canvas';
import { Parameters } from './Parameters';
import { Formula } from './Formula';
import { CodeBlock } from './CodeBlock';

const DEFAULT_CODE = `const t = progress * Math.PI * 2;
const petals = cfg.petalCount || 6;
const r = cfg.baseRadius || 25;
return {
  x: 50 + r * Math.cos(petals * t) * Math.cos(t),
  y: 50 + r * Math.cos(petals * t) * Math.sin(t)
};`;

const DEFAULT_FORMULA = `r(θ) = a·cos(kθ)\nx = r·cos θ, y = r·sin θ`;

const STANDARD_PARAMS: ParamDef[] = [
  { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 100 },
  { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.3 },
  { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 7000 },
  { key: 'strokeWidth', label: 'Stroke Width', labelZh: '描边宽度', type: 'range', min: 0.5, max: 10, step: 0.1, val: 2.5 },
  { key: 'pathOpacity', label: 'Path Opacity', labelZh: '路径透明度', type: 'range', min: 0, max: 1, step: 0.05, val: 0.15 },
  { key: 'particlePulse', label: 'Particle Pulse', labelZh: '粒子脉冲', type: 'range', min: 0, max: 0.8, step: 0.05, val: 0.05 },
  { key: 'particleBaseRadius', label: 'Particle Base Size', labelZh: '粒子基础大小', type: 'range', min: 0.1, max: 3, step: 0.1, val: 0.9 },
  { key: 'particleMaxRadius', label: 'Particle Max Size', labelZh: '粒子最大大小', type: 'range', min: 0.5, max: 6, step: 0.1, val: 2.7 },
  { key: 'particleMinOpacity', label: 'Particle Min Opacity', labelZh: '粒子最小透明度', type: 'range', min: 0, max: 0.5, step: 0.01, val: 0.04 },
  { key: 'particleFadePower', label: 'Particle Fade Power', labelZh: '粒子淡出力度', type: 'range', min: 0.1, max: 2, step: 0.05, val: 0.56 },
  { key: 'particlePulseSpeed', label: 'Particle Pulse Speed', labelZh: '粒子脉冲速度', type: 'range', min: 0.5, max: 10, step: 0.5, val: 3 },
  { key: 'hueBase', label: 'Hue Base', labelZh: '色相基准', type: 'range', min: 0, max: 360, step: 1, val: 280 },
  { key: 'hueSpeed', label: 'Hue Speed', labelZh: '色相速度', type: 'range', min: 0, max: 30, step: 0.5, val: 8 },
  { key: 'hueSpread', label: 'Hue Spread', labelZh: '色相展开', type: 'range', min: 0, max: 180, step: 1, val: 60 },
  { key: 'satBase', label: 'Saturation', labelZh: '饱和度', type: 'range', min: 20, max: 100, step: 1, val: 70 },
  { key: 'lightBase', label: 'Lightness', labelZh: '亮度', type: 'range', min: 30, max: 90, step: 1, val: 67 },
  { key: 'rotationSpeed', label: 'Rotation Speed', labelZh: '旋转速度', type: 'range', min: 0, max: 5, step: 0.1, val: 1 },
  { key: 'pathBreathingSpeed', label: 'Breathing Speed', labelZh: '呼吸速度', type: 'range', min: 0.1, max: 5, step: 0.1, val: 1.5 },
  { key: 'pathResolution', label: 'Path Resolution', labelZh: '路径精度', type: 'range', min: 60, max: 800, step: 10, val: 360 },
  { key: 'animationDirection', label: 'Direction', labelZh: '动画方向', type: 'range', min: -1, max: 1, step: 1, val: 1 },
  { key: 'satRange', label: 'Saturation Range', labelZh: '饱和度范围', type: 'range', min: 0, max: 40, step: 1, val: 30 },
  { key: 'lightRange', label: 'Lightness Range', labelZh: '亮度范围', type: 'range', min: 0, max: 30, step: 1, val: 18 },
  { key: 'pathGlow', label: 'Path Glow', labelZh: '路径辉光', type: 'range', min: 0, max: 5, step: 0.5, val: 0 },
  { key: 'zoom', label: 'Zoom', labelZh: '缩放', type: 'range', min: 0.3, max: 3, step: 0.1, val: 1 },
  { key: 'backgroundColor', label: 'Background', labelZh: '背景色', type: 'color', val: '#050505' },
  { key: 'color', label: 'Color', labelZh: '静态颜色', type: 'color', val: '#f5f5f5' },
];

function compileAnimation(
  codeBody: string,
  customParams: ParamDef[],
  formulaText: string,
): { animation: AnimationDef; error: null } | { animation: null; error: string } {
  try {
    const pointFn = new Function('progress', 'time', 'cfg', codeBody) as (
      progress: number,
      time: number,
      cfg: LiveConfig,
    ) => Point2D;

    // Test execution
    const testCfg: LiveConfig = {};
    STANDARD_PARAMS.forEach((p) => (testCfg[p.key] = p.val));
    customParams.forEach((p) => (testCfg[p.key] = p.val));
    const result = pointFn(0.5, 0, testCfg);
    if (typeof result?.x !== 'number' || typeof result?.y !== 'number') {
      return { animation: null, error: 'point() 必须返回 { x: number, y: number } 对象' };
    }

    const allParams = [...STANDARD_PARAMS, ...customParams];

    const anim: AnimationDef = {
      id: 'custom-curve',
      category: 'Custom',
      categoryZh: '自定义',
      name: 'Custom Curve',
      nameZh: '自定义曲线',
      tag: 'User Defined',
      params: allParams,
      formula: () => formulaText,
      point: pointFn,
      getRotation: () => 0,
      buildPath(time, cfg, steps) {
        return buildPathGeneric(pointFn, time, cfg, steps ?? 360);
      },
      getParticle(index, progress, time, cfg) {
        return getParticleGeneric(pointFn, index, progress, time, cfg);
      },
      code: () => codeBody,
    };

    return { animation: anim, error: null };
  } catch (e) {
    return { animation: null, error: String(e) };
  }
}

function buildLiveConfig(params: ParamDef[]): LiveConfig {
  const cfg: LiveConfig = {};
  params.forEach((p) => (cfg[p.key] = p.val));
  return cfg;
}

export function CustomEditor() {
  const [codeBody, setCodeBody] = useState(DEFAULT_CODE);
  const [formulaText, setFormulaText] = useState(DEFAULT_FORMULA);
  const [customParams, setCustomParams] = useState<ParamDef[]>([
    { key: 'baseRadius', label: 'Base Radius', labelZh: '基础半径', type: 'range', min: 5, max: 40, step: 0.1, val: 25 },
    { key: 'petalCount', label: 'Petal Count', labelZh: '花瓣数量', type: 'range', min: 2, max: 20, step: 1, val: 6 },
  ]);
  const [compileError, setCompileError] = useState<string | null>(null);

  const compiled = useMemo(() => {
    return compileAnimation(codeBody, customParams, formulaText);
  }, [codeBody, customParams, formulaText]);

  const animation = compiled.animation;
  const error = compiled.error;

  // Sync compile error state for display
  useEffect(() => {
    setCompileError(error);
  }, [error]);

  const [liveConfig, setLiveConfig] = useState<LiveConfig>(() =>
    buildLiveConfig([...STANDARD_PARAMS, ...customParams]),
  );

  // Rebuild liveConfig when animation changes (initial compile)
  useEffect(() => {
    if (animation) {
      setLiveConfig(buildLiveConfig(animation.params));
    }
  }, [animation?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfigChange = useCallback(
    (key: string, value: number | string) => {
      setLiveConfig((prev) => ({ ...prev, [key]: value }));
      // Also update customParams if it's a custom param
      setCustomParams((prev) =>
        prev.map((p) => (p.key === key ? { ...p, val: value } : p)),
      );
    },
    [],
  );

  const addParam = useCallback(() => {
    const id = customParams.length + 1;
    setCustomParams((prev) => [
      ...prev,
      {
        key: `param${id}`,
        label: `Param ${id}`,
        labelZh: `参数${id}`,
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
        val: 10,
      },
    ]);
  }, [customParams.length]);

  const removeParam = useCallback((index: number) => {
    setCustomParams((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateParam = useCallback((index: number, field: keyof ParamDef, value: unknown) => {
    setCustomParams((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    );
  }, []);

  return (
    <div className="custom-editor">
      {/* Left: Editor */}
      <div className="custom-editor-left">
        <div className="editor-section">
          <div className="section-label">Point Function / 点函数</div>
          <div className="editor-hint">
            输入 point(progress, time, cfg) 的函数体。可用变量：progress [0,1], time (ms), cfg (参数对象)
          </div>
          <textarea
            className="code-editor"
            value={codeBody}
            onChange={(e) => setCodeBody(e.target.value)}
            spellCheck={false}
            rows={10}
          />
        </div>

        <div className="editor-section">
          <div className="section-label">Formula / 公式</div>
          <textarea
            className="formula-editor"
            value={formulaText}
            onChange={(e) => setFormulaText(e.target.value)}
            spellCheck={false}
            rows={3}
          />
        </div>

        <div className="editor-section">
          <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Custom Parameters / 自定义参数</span>
            <button className="add-param-btn" onClick={addParam}>
              + Add / 添加
            </button>
          </div>
          <div className="custom-params-list">
            {customParams.map((p, i) => (
              <div className="custom-param-row" key={i}>
                <input
                  className="param-input"
                  placeholder="key"
                  value={p.key}
                  onChange={(e) => updateParam(i, 'key', e.target.value)}
                />
                <input
                  className="param-input"
                  placeholder="label"
                  value={p.label}
                  onChange={(e) => updateParam(i, 'label', e.target.value)}
                />
                <input
                  className="param-input"
                  placeholder="labelZh"
                  value={p.labelZh}
                  onChange={(e) => updateParam(i, 'labelZh', e.target.value)}
                />
                <input
                  className="param-input num"
                  type="number"
                  placeholder="min"
                  value={p.min}
                  onChange={(e) => updateParam(i, 'min', Number(e.target.value))}
                />
                <input
                  className="param-input num"
                  type="number"
                  placeholder="max"
                  value={p.max}
                  onChange={(e) => updateParam(i, 'max', Number(e.target.value))}
                />
                <input
                  className="param-input num"
                  type="number"
                  placeholder="step"
                  value={p.step}
                  onChange={(e) => updateParam(i, 'step', Number(e.target.value))}
                />
                <input
                  className="param-input num"
                  type="number"
                  placeholder="val"
                  value={p.val as number}
                  onChange={(e) => updateParam(i, 'val', Number(e.target.value))}
                />
                <button className="remove-param-btn" onClick={() => removeParam(i)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {compileError && (
          <div className="compile-error">
            <strong>Error / 错误：</strong>
            {compileError}
          </div>
        )}
      </div>

      {/* Right: Preview */}
      <div className="custom-editor-right">
        {animation ? (
          <>
            <Canvas animation={animation} liveConfig={liveConfig} />
            <Formula animation={animation} liveConfig={liveConfig} />
            <Parameters
              animation={animation}
              liveConfig={liveConfig}
              onConfigChange={handleConfigChange}
            />
            <CodeBlock animation={animation} liveConfig={liveConfig} />
          </>
        ) : (
          <div className="preview-placeholder">
            <div className="preview-placeholder-text">
              请在左侧输入有效的曲线代码以预览
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
