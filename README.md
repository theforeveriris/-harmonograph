# Harmonograph

一个基于 **React + TypeScript + Vite** 的谐振摆可视化实验室，灵感来源于19世纪英国科学家 Hugh Blackburn 发明的机械绘图仪。通过 SVG 粒子动画实时渲染阻尼简谐振动叠加产生的精美曲线，支持参数动态调节与公式展示。

---

## 在线预览

```bash
npm install
npm run dev
```

---

## 什么是 Harmonograph（谐振摆）

> 发明于19世纪（英国科学家 Hugh Blackburn，约1844年）。
>
> 利用两个或多个相互独立摆动的钟摆，带动笔在纸上做简谐振动。笔的位置由各个摆的组合运动决定，由于摆动逐渐衰减（阻尼），画出的图案呈螺旋状收缩，形成精美对称的曲线图形。

**数学模型：**

```
x(t) = A1 * sin(f1 * t + p1) * e^(-d1 * t)
y(t) = A3 * sin(f3 * t + p3) * e^(-d3 * t)
```

其中 A 为振幅，f 为频率，p 为相位，d 为阻尼系数。

---

## 包含的曲线

| 分类 | 曲线 | 说明 |
|---|---|---|
| **Rose** | Original Thinking | 自定义玫瑰轨迹，带脉冲缩放 |
| | Multi-Frequency Rose | 多频谐波叠加 |
| **Lissajous** | Lissajous | 双频简谐振动 |
| **Spiral** | Spiral Galaxy | 对数螺旋臂 |
| | DNA Helix | 参数化双螺旋 |
| **Heart** | Cardioid Heart | 极坐标心形线 |
| | Butterfly Curve | Temple H. Fay, 1989 |
| **Topology** | Trefoil Knot | 三叶结 3D 投影 |
| | Klein Bottle | 不可定向曲面 |
| **Trochoid** | Epitrochoid | 外摆线 |
| | Hypocycloid | 内摆线（多尖点） |
| | Astroid | 星形线 |
| **Morphing** | Superellipse | Lamé 曲线变形 |
| **Fractal** | Dragon Curve | Heighway 龙形曲线 |
| **Wave** | Sine Wave Ring | 圆形波干涉 |
| **Network** | Graph Flow | 网络拓扑遍历 |
| **Harmonograph** | Harmonograph | 阻尼谐振摆（核心） |

---

## 技术栈

- **React 19** + **TypeScript** + **Vite**
- 自定义 Hooks：`useAnimation`（SVG 路径渲染）、`useParticles`（粒子 DOM 管理）
- `requestAnimationFrame` 驱动的高性能动画
- CSS 变量主题系统

---

## 项目结构

```
src/
├── types/
│   └── index.ts          # TypeScript 类型定义
├── data/
│   ├── curves/           # 每个动画独立文件
│   │   ├── shared.ts     # 共享工具函数
│   │   ├── index.ts      # 动画注册表
│   │   ├── rose.ts
│   │   ├── lissajous.ts
│   │   ├── spiral.ts
│   │   ├── heart.ts
│   │   ├── topology.ts
│   │   ├── trochoid.ts
│   │   ├── morphing.ts
│   │   ├── fractal.ts
│   │   ├── wave.ts
│   │   ├── network.ts
│   │   └── harmonograph.ts
│   └── utils.ts          # hexToHue, highlightCode 等
├── hooks/
│   ├── useAnimation.ts
│   └── useParticles.ts
├── components/
│   ├── Header.tsx
│   ├── Canvas.tsx
│   ├── Formula.tsx
│   ├── Parameters.tsx
│   └── CodeBlock.tsx
├── App.tsx
└── index.css
```

---

## 如何新增一条曲线

**第一步**：在 `src/data/curves/` 下新建文件，例如 `myCurve.ts`：

```typescript
import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const myCurve: AnimationDef = {
  id: 'my-curve',
  category: 'MyCategory',
  name: 'My Curve',
  tag: 'Description',
  params: [
    { key: 'particleCount', label: 'Particles', type: 'range', min: 30, max: 200, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.5 },
    { key: 'durationMs', label: 'Duration (ms)', type: 'range', min: 2000, max: 15000, step: 100, val: 5000 },
    { key: 'color', label: 'Color', type: 'color', val: '#ff0000' },
  ],
  formula(cfg) {
    return `x = f(t), y = g(t)`;
  },
  point(progress, time, cfg) {
    const t = progress * Math.PI * 2;
    return { x: 50 + 20 * Math.cos(t), y: 50 + 20 * Math.sin(t) };
  },
  getRotation(_time, _cfg) {
    return 0;
  },
  buildPath(time, cfg) {
    return buildPathGeneric(this.point.bind(this), time, cfg, 400);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg);
  },
  code() {
    return `const t = progress * Math.PI * 2;\nreturn { x: 50 + 20 * Math.cos(t), y: 50 + 20 * Math.sin(t) };`;
  },
};
```

**第二步**：在 `src/data/curves/index.ts` 中导入并加入数组：

```typescript
import { myCurve } from './myCurve';

export const animations = [
  // ...existing curves
  myCurve,
];
```

无需修改任何组件代码。

---

## License

MIT
