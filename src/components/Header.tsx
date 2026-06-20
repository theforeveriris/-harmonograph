import type { AnimationDef } from '../types';
import { getCategories } from '../data/utils';

interface HeaderProps {
  animations: AnimationDef[];
  activeCategory: string;
  activeAnimId: string | null;
  onCategoryChange: (category: string) => void;
  onAnimationChange: (anim: AnimationDef) => void;
}

export function Header({
  animations,
  activeCategory,
  activeAnimId,
  onCategoryChange,
  onAnimationChange,
}: HeaderProps) {
  const categories = getCategories(animations);
  const categoryAnims = animations.filter((a) => a.category === activeCategory);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">Harmonograph</div>
        <nav className="nav-l1">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`nav-l1-btn${cat === activeCategory ? ' active' : ''}`}
              onClick={() => {
                onCategoryChange(cat);
                const first = animations.find((a) => a.category === cat);
                if (first) onAnimationChange(first);
              }}
            >
              {cat}
            </button>
          ))}
        </nav>
        <nav className="nav-l2">
          {categoryAnims.map((anim) => (
            <button
              key={anim.id}
              className={`nav-l2-btn${anim.id === activeAnimId ? ' active' : ''}`}
              onClick={() => onAnimationChange(anim)}
            >
              {anim.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
