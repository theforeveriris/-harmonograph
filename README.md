# Harmonograph

一个基于 **React + TypeScript + Vite** 的数学曲线可视化实验室，包含 46 条精美曲线，支持参数实时调节、公式展示、源代码生成（可导出独立 HTML）和 GIF 动画导出。

---

## 在线预览

[GitHub Pages Demo](https://theforeveriris.github.io/-harmonograph/)

```bash
npm install
npm run dev
```

---

## 功能特性

- **46 条数学曲线**，涵盖 7 大分类：玫瑰线、心形、纽结、摆轮、曲线、经典、异形
- **实时参数调节**：30+ 可调参数，包括粒子数量/大小/透明度、色相/饱和度/亮度、旋转速度、路径辉光、缩放等
- **公式展示**：每条曲线附带数学公式说明
- **源代码生成**：实时生成可独立运行的 HTML 代码，支持复制和下载
- **GIF 导出**：将动画导出为 GIF 文件，可自定义帧数和帧率
- **双语界面**：中英文对照的分类名、曲线名和参数标签
- **动态 HSL 颜色**：色相随时间渐变，饱和度和亮度呼吸波动
- **SVG 路径辉光**：可调节的发光滤镜效果
- **深色主题**：精心设计的暗色 UI

---

## 曲线列表

| 分类 / Category | 曲线 / Curve | 说明 |
|---|---|---|
| **Rose / 玫瑰** | Original Thinking | 自定义玫瑰轨迹，带脉冲缩放 |
| | Multi-Frequency Rose | 多频谐波叠加玫瑰线 |
| | Rhodonea | 玫瑰线 r = cos(kθ) |
| | Maclaurin Rose | 麦克劳林玫瑰线 |
| | Shamrock | 三叶草极坐标曲线 |
| | Gear Flower | 齿轮花曲线 |
| **Heart / 心形** | Cardioid Heart | 心形线参数方程 |
| **Knot / 纽结** | Trefoil Knot | 三叶结 3D 投影 |
| | Klein Bottle | 克莱因瓶不可定向曲面 |
| | Torus Knot | 环面纽结 |
| | Lissajous Knot | 利萨如纽结 |
| | Figure Eight | 8 字形纽结 |
| | Lemniscate of Bernoulli | 伯努利双纽线 |
| **Trochoid / 摆轮** | Epitrochoid | 外摆线 |
| | Hypocycloid | 内摆线（多尖点） |
| | Astroid | 星形线 |
| | Nephroid | 肾形线 |
| | Deltoid | 三角线 |
| | Spirograph | 螺线花 |
| | Star Polygon | 星形多边形 |
| **Curve / 曲线** | Sine Wave Ring | 圆形正弦波干涉 |
| | Superellipse | 超椭圆变形 |
| | Limacon | 蜗牛线/帕斯卡螺线 |
| | Conic Ellipse | 圆锥曲线椭圆 |
| | Sunflower | 向日葵螺旋线 |
| | Lissajous | 利萨如图形 |
| | Seashell | 海螺曲线 |
| | Teardrop | 泪滴曲线 |
| | Snowflake | 雪花曲线 |
| | Spiral Galaxy | 螺旋星系（多臂） |
| | Double Helix DNA | DNA 双螺旋 |
| | Fermat Spiral | 费马螺旋线 |
| | Cycloid | 摆线 |
| | Hyperbola | 双曲线 |
| | Fourier Series | 傅里叶级数方波逼近 |
| | Beat Frequency | 拍频波干涉 |
| | Damped Oscillation | 阻尼振荡 |
| **Classic / 经典** | Cardioid (Polar) | 极坐标心形线 |
| **Exotic / 异形** | Hypotrochoid Rose | 内摆线玫瑰 |
| | Witch of Agnesi | 阿涅西箕舌线 |
| | Talbot Curve | 塔尔博特曲线 |
| | Void Sigil | 虚空符文（三层调制极坐标） |
| | Lorenz Attractor | 洛伦兹吸引子（混沌系统） |
| | Sierpinski Triangle | 谢尔宾斯基三角形（混沌博弈） |
| | Koch Snowflake | 科赫雪花（递归分形） |
| | Peano Curve | 皮亚诺曲线（空间填充） |
| | Hilbert Curve | 希尔伯特曲线（空间填充） |

---

## 技术栈

- **React 19** + **TypeScript** + **Vite**
- **SVG** 粒子动画 + `requestAnimationFrame` 高性能渲染
- **gifenc** 纯 JS GIF 编码器（导出功能）
- 自定义 Hooks：`useAnimation`、`useParticles`、`useGifExport`
- CSS 变量主题系统 + 深色模式
- GitHub Actions 自动部署

---

## 项目结构

```
src/
├── types/
│   ├── index.ts              # AnimationDef, ParamDef, LiveConfig 等类型
│   └── gifenc.d.ts           # gifenc 类型声明
├── data/
│   ├── curves/               # 曲线定义（每个文件含 1-5 条曲线）
│   │   ├── index.ts          # 动画注册表
│   │   ├── shared.ts         # buildPathGeneric, getParticleGeneric
│   │   ├── generateHTML.ts   # 独立 HTML 生成器
│   │   ├── rose.ts           # 玫瑰线类
│   │   ├── heart.ts          # 心形
│   │   ├── knot.ts           # 纽结类
│   │   ├── trochoid.ts       # 摆轮类
│   │   ├── polar.ts          # 极坐标类
│   │   ├── conic.ts          # 圆锥曲线
│   │   ├── spirograph.ts     # 螺线花
│   │   ├── orbital.ts        # 轨道类
│   │   ├── geometric.ts      # 几何类
│   │   ├── classic.ts        # 经典类
│   │   ├── flower.ts         # 花形类
│   │   ├── exotic.ts         # 异形类
│   │   ├── beauty.ts         # 美观类
│   │   ├── spiral.ts         # 螺旋星系
│   │   ├── dna.ts            # DNA 双螺旋
│   │   ├── sigil.ts          # 符文类
│   │   ├── lorenz.ts         # 洛伦兹吸引子
│   │   ├── fermat.ts         # 费马螺旋
│   │   ├── cycloid.ts        # 摆线
│   │   ├── hyperbola.ts      # 双曲线
│   │   ├── fractal.ts        # 分形类（Sierpinski, Koch）
│   │   ├── spacefill.ts      # 空间填充类（Peano, Hilbert）
│   │   └── waveMath.ts       # 波动数学类（Fourier, Beat, Damped）
│   └── utils.ts              # hexToHue, highlightCode 等
├── hooks/
│   ├── useAnimation.ts       # SVG 路径渲染 + 旋转 + 呼吸
│   ├── useParticles.ts       # 粒子 DOM 管理
│   └── useGifExport.ts       # GIF 导出
├── components/
│   ├── Header.tsx            # 分类/曲线选择导航
│   ├── Canvas.tsx            # SVG 画布
│   ├── Formula.tsx           # 公式展示
│   ├── Parameters.tsx        # 参数调节面板
│   └── CodeBlock.tsx         # 源代码 + HTML 导出 + GIF 导出
├── App.tsx                   # 主应用
└── index.css                 # 全局样式
```

---

## 如何新增一条曲线

**第一步**：在 `src/data/curves/` 下新建文件，例如 `myCurve.ts`：

```typescript
import type { AnimationDef } from '../../types';
import { buildPathGeneric, getParticleGeneric } from './shared';

export const myCurve: AnimationDef = {
  id: 'my-curve',
  category: 'Exotic',
  categoryZh: '异形',
  name: 'My Curve',
  nameZh: '我的曲线',
  tag: 'Description',
  params: [
    // 曲线特有参数
    { key: 'myParam', label: 'My Param', labelZh: '我的参数', type: 'range', min: 1, max: 10, step: 0.1, val: 5 },
    // 标准参数（粒子、颜色、动画控制等）
    { key: 'particleCount', label: 'Particles', labelZh: '粒子数量', type: 'range', min: 50, max: 250, step: 1, val: 100 },
    { key: 'trailSpan', label: 'Trail Span', labelZh: '拖尾跨度', type: 'range', min: 0.1, max: 1.0, step: 0.05, val: 0.3 },
    { key: 'durationMs', label: 'Duration (ms)', labelZh: '周期时长', type: 'range', min: 4000, max: 15000, step: 100, val: 7000 },
    // ... 其余标准参数
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
  buildPath(time, cfg, steps) {
    return buildPathGeneric(this.point.bind(this), time, cfg, steps);
  },
  getParticle(index, progress, time, cfg) {
    return getParticleGeneric(this.point.bind(this), index, progress, time, cfg);
  },
  code(cfg) {
    // 必须是自包含的代码，只使用 progress、time 和局部变量
    return `const t = progress * Math.PI * 2;\nreturn { x: 50 + 20 * Math.cos(t), y: 50 + 20 * Math.sin(t) };`;
  },
};
```

**第二步**：在 `src/data/curves/index.ts` 中导入并加入数组。

无需修改任何组件代码。

---

## License

MIT
