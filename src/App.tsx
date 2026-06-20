import { useState, useCallback } from 'react';
import type { AnimationDef, LiveConfig } from './types';
import { animations } from './data/curves';
import { Header } from './components/Header';
import { Canvas } from './components/Canvas';
import { Formula } from './components/Formula';
import { Parameters } from './components/Parameters';
import { CodeBlock } from './components/CodeBlock';

function App() {
  const [activeCategory, setActiveCategory] = useState(animations[0].category);
  const [activeAnim, setActiveAnim] = useState<AnimationDef>(animations[0]);
  const [liveConfig, setLiveConfig] = useState<LiveConfig>(() => {
    const cfg: LiveConfig = {};
    animations[0].params.forEach((p) => {
      cfg[p.key] = p.val;
    });
    return cfg;
  });

  const handleAnimationChange = useCallback((anim: AnimationDef) => {
    setActiveAnim(anim);
    setActiveCategory(anim.category);
    const cfg: LiveConfig = {};
    anim.params.forEach((p) => {
      cfg[p.key] = p.val;
    });
    setLiveConfig(cfg);
  }, []);

  const handleConfigChange = useCallback((key: string, value: number | string) => {
    setLiveConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <>
      <Header
        animations={animations}
        activeCategory={activeCategory}
        activeAnimId={activeAnim.id}
        onCategoryChange={setActiveCategory}
        onAnimationChange={handleAnimationChange}
      />
      <main className="main">
        <Canvas animation={activeAnim} liveConfig={liveConfig} />
        <Formula animation={activeAnim} liveConfig={liveConfig} />
        <Parameters
          animation={activeAnim}
          liveConfig={liveConfig}
          onConfigChange={handleConfigChange}
        />
        <CodeBlock animation={activeAnim} liveConfig={liveConfig} />
      </main>
    </>
  );
}

export default App;
