import type { AnimationDef } from '../types';

interface HeaderProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  animations: AnimationDef[];
  activeAnimation: AnimationDef | null;
  onSelectAnimation: (anim: AnimationDef) => void;
}

const CATEGORY_ZH: Record<string, string> = {
  Rose: '玫瑰',
  Heart: '心形',
  Knot: '纽结',
  Trochoid: '摆轮',
  Curve: '曲线',
  Classic: '经典',
  Exotic: '异形',
  Custom: '自定义',
};

export function Header({
  categories,
  activeCategory,
  onSelectCategory,
  animations,
  activeAnimation,
  onSelectAnimation,
}: HeaderProps) {
  const categoryAnims = animations.filter((a) => a.category === activeCategory);
  const isCustom = activeCategory === 'Custom';

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">Harmonograph</div>
        <nav className="nav-l1">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`nav-l1-btn${cat === activeCategory ? ' active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {CATEGORY_ZH[cat] ? `${cat} / ${CATEGORY_ZH[cat]}` : cat}
            </button>
          ))}
        </nav>
        {!isCustom && (
          <nav className="nav-l2">
            {categoryAnims.map((anim) => (
              <button
                key={anim.id}
                className={`nav-l2-btn${anim.id === activeAnimation?.id ? ' active' : ''}`}
                onClick={() => onSelectAnimation(anim)}
              >
                {anim.nameZh ? `${anim.name} / ${anim.nameZh}` : anim.name}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
