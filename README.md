# 医学科技兴趣协会官网

医学科技兴趣协会（Medical Technology Interest Association，EST. 2002 · YICHUN UNIVERSITY）品牌官网基础版。

## 技术栈

- React 19 + Vite + TypeScript
- 原生 CSS（无 UI 框架），动画以 `transform` / `opacity` 为主，保证性能

## 运行

```bash
npm install
npm run dev      # 开发预览 http://localhost:5173
npm run build    # 生产构建，输出到 dist/
```

## 页面结构

单页滚动式四幕结构，导航平滑滚动到对应锚点：

1. **主页 HOME**（`#home`）：3D 会徽占位、品牌信息、协会简介、四理念关键词、滚动收拢过渡
2. **关于我们 OUR JOURNEY**（`#about`）：三行标题 + 四个横向历史板块（桌面端）
3. **特色活动 FEATURED ACTIVITIES**（`#activities`）：立体漂浮照片墙 + 点击放大 + 收束过渡
4. **加入我们 JOIN US**（`#join`）：白色楼梯与光门 SVG、剪影人物、招新信息

## 目录

- `src/data/content.ts` — 全部文案与照片墙数据集中于此
- `src/components/` — 各页面组件与样式
- `src/hooks/` — `useReveal`（进入视口揭示）、`useSectionProgress`（滚动驱动动画）

## 待补充素材

- 协会会徽（当前为蛇杖占位图形，位于 `src/components/Emblem.tsx`）
- 各历史板块照片与活动照片（当前为占位块，替换 `src/data/content.ts` 中的照片数据并接入真实图片）
- 联系方式（当前显示“联系方式待补充”）
