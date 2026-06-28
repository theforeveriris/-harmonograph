import { useState, useMemo, useCallback } from 'react';
import { animations, categories } from './data/curves';
import type { AnimationDef, LiveConfig } from './types';
import { Header } from './components/Header';
import { Canvas } from './components/Canvas';
import { Formula } from './components/Formula';
import { Parameters } from './components/Parameters';
import { CodeBlock } from './components/CodeBlock';
import { CustomEditor } from './components/CustomEditor';

export default function App() {
  const allAnimations = animations;
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeAnim, setActiveAnim] = useState<AnimationDef>(allAnimations[0]);
  const [isCustomMode, setIsCustomMode] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, AnimationDef[]>();
    allAnimations.forEach((anim) => {
      const list = map.get(anim.category) || [];
      list.push(anim);
      map.set(anim.category, list);
    });
    return map;
  }, [allAnimations]);

  const liveConfig = useMemo(() => {
    if (isCustomMode) return {} as LiveConfig;
    const cfg: LiveConfig = {};
    activeAnim.params.forEach((p) => (cfg[p.key] = p.val));
    return cfg;
  }, [activeAnim, isCustomMode]);

  const handleConfigChange = useCallback(
    (key: string, value: number | string) => {
      if (isCustomMode) return;
      setActiveAnim((prev) => ({
        ...prev,
        params: prev.params.map((p) =>
          p.key === key ? { ...p, val: value } : p,
        ),
      }));
    },
    [isCustomMode],
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">Harmonograph</div>
        <Header
          categories={categories}
          activeCategory={isCustomMode ? 'Custom' : activeCategory}
          onSelectCategory={(cat) => {
            if (cat === 'Custom') {
              setIsCustomMode(true);
            } else {
              setIsCustomMode(false);
              setActiveCategory(cat);
              const first = grouped.get(cat)?.[0];
              if (first) setActiveAnim(first);
            }
          }}
          animations={grouped.get(activeCategory) || []}
          activeAnimation={isCustomMode ? null : activeAnim}
          onSelectAnimation={(anim) => {
            setIsCustomMode(false);
            setActiveAnim(anim);
          }}
        />
      </header>

      <main className="app-body">
        {isCustomMode ? (
          <CustomEditor />
        ) : (
          <>
            <Canvas animation={activeAnim} liveConfig={liveConfig} />
            <Formula animation={activeAnim} liveConfig={liveConfig} />
            <Parameters
              animation={activeAnim}
              liveConfig={liveConfig}
              onConfigChange={handleConfigChange}
            />
            <CodeBlock animation={activeAnim} liveConfig={liveConfig} />
          </>
        )}
      </main>
    </div>
  );
}
