# CLAUDE.md — 项目规范与经验记录

## 项目概述

Orb Collector 是一个基于 React + Vite + Babylon.js 的 3D 收集小游戏。玩家控制球体在地图中收集 orb、gem 和 star，躲避追击的敌人，争取最高分。支持中英文切换。

## 技术栈

| 层 | 技术 |
|------|--------|
| 构建工具 | Vite 5 |
| UI 框架 | React 18 |
| 样式 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| 3D 引擎 | Babylon.js 9.x |
| 存储 | localStorage（排行榜） |
| 国际化 | 自建 Context（`src/i18n/`） |

## 目录结构规范

```
src/
├── App.jsx                # 根组件，组合状态与 UI
├── main.jsx               # 入口，包裹 I18nProvider
├── i18n/                  # 国际化模块
│   ├── index.jsx          # I18nProvider + useI18n Hook + t()
│   ├── zh.js              # 中文翻译文本
│   └── en.js              # 英文翻译文本
├── components/            # UI 展示组件
│   ├── GameHUD.jsx        # 游戏内 HUD
│   ├── Leaderboard.jsx    # 可复用排行榜
│   ├── MenuScreen.jsx     # 主菜单（含语言切换）
│   └── ResultScreen.jsx   # 结算页
├── game/                  # 纯逻辑模块（不依赖 React）
│   ├── constants.js       # 游戏常量（调参入口）
│   ├── entities.js        # Babylon 实体创建函数
│   ├── helpers.js         # 通用工具函数
│   └── leaderboard.js     # 排行榜 IO
└── hooks/
    └── useGame.js         # Babylon 场景管理 + 游戏循环 Hook
```

## 编码约定

### 注释
- 每个文件头部用 `=====` 框出职责说明
- 每个导出函数/组件用 JSDoc 说明参数和用途
- 复杂逻辑块前用 `// ----` 做分段标题
- 关键数字常量要注明含义

### 状态管理
- **游戏运行时状态**（每帧变化：生命值、分数、已用时间等）存在 `useRef` + 普通 JS 对象中，每 200ms 通过回调批量同步到 React state
- **UI 状态**（当前处于哪个界面、玩家昵称等）用 `useState`
- 避免在 React state 中存储 3D 场景引用，一律用 `useRef`

### React Hook 规范
- `useGame` 是核心 Hook，依赖数组只写 `[gamePhase]`
- `useGame` 接收 `callbacks` 对象，包含 `onStateChange` 和 `onGameEnd`
- 清理函数必须移除所有事件监听和定时器，并调用 `engine.dispose()`

### 国际化
- 翻译文本放在 `src/i18n/{zh,en}.js`，按组件名组织层级
- 组件中通过 `useI18n()` 获取 `{ t, toggleLang, locale }`
- `t('path.to.key')` 按点号路径查找翻译

### 文件职责
- `game/` 下的模块是纯函数，不依赖 React
- `components/` 下的组件是纯展示 + 轻交互，不直接操作 3D 场景
- `hooks/useGame.js` 是唯一操作 Babylon.js 的地方

## 已踩坑记录

### 1. Babylon.js 9.x 移除 `MeshBuilder.CreateStar`
- **现象**：点击 Start Game 后页面空白，控制台报 `MeshBuilder.CreateStar is not a function`
- **原因**：Babylon.js 9.x 已删除 `CreateStar` 方法
- **解决**：改用 `CreateTorusKnot`（几何结）作为高价值收集物
- **教训**：使用 Babylon.js API 前应检查 `node_modules/babylonjs/babylon.module.d.ts` 确认方法存在

### 2. W/S 方向反了
- **现象**：按 W 后退，按 S 前进
- **原因**：Babylon.js 中相机位于 Z 轴负方向看向原点，+Z 才是场景纵深方向
- **解决**：W 对应 `dz += 1`（+Z，进入场景），S 对应 `dz -= 1`（-Z，朝向相机）

### 3. Vite 8 + Node.js 20.15 不兼容
- **现象**：`Cannot find native binding` + `Node.js 20.19+` 提示
- **原因**：Vite 8 的底层构建工具 rolldown 需要 Node >= 20.19
- **解决**：降级到 Vite 5 (`npm install vite@5 @vitejs/plugin-react@4`)

### 4. ES Module 项目中禁止使用 `require`
- **原因**：ESM 环境下 `require` 会直接运行时报错
- **解决**：所有 Babylon 类的引用统一用 `import { ... } from 'babylonjs'` 导入

## 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run preview  # 预览生产构建
```
