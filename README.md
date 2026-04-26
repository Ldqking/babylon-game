# Orb Collector 3D

基于 **React + Vite + Babylon.js** 的 3D 收集小游戏。玩家控制球体在 3D 场景中收集目标物品，躲避追击敌人，争取最高分。

## 游戏玩法

- 使用 **WASD** 控制球体在地图中移动
- 收集 **蓝色小球 (Orb)**、**绿色水晶 (Gem)**、**金色几何结 (Star)** 获得分数
- 躲避红色追击敌人，碰撞会损失生命值
- 按 **空格键** 发射激光消灭敌人（冷却 350ms）
- 集齐所有收集品即可通关，剩余时间和生命值将转化为额外奖励分数
- 游戏结束后可查看排行榜

## 技术栈

| 层 | 技术 |
|------|--------|
| 构建工具 | Vite 5 |
| UI 框架 | React 19 |
| 样式 | Tailwind CSS v4 |
| 3D 引擎 | Babylon.js 9.x |
| 存储 | localStorage（排行榜） |
| 国际化 | 自建 Context（中/英文） |

## 项目结构

```
src/
├── App.jsx                # 根组件，管理游戏阶段与 UI 切换
├── main.jsx               # 入口文件，包裹 I18nProvider
├── index.css              # Tailwind 全局样式
├── i18n/                  # 国际化模块
│   ├── index.jsx          # I18nProvider + useI18n Hook
│   ├── zh.js              # 中文翻译
│   └── en.js              # 英文翻译
├── components/            # UI 展示组件
│   ├── MenuScreen.jsx     # 主菜单（含昵称输入、语言切换）
│   ├── GameHUD.jsx        # 游戏内 HUD（生命值、分数、计时）
│   ├── ResultScreen.jsx   # 结算页面（成绩展示 + 排行榜）
│   └── Leaderboard.jsx    # 可复用排行榜组件
├── game/                  # 纯逻辑模块（不依赖 React）
│   ├── constants.js       # 游戏常量配置（调参入口）
│   ├── entities.js        # Babylon 3D 实体创建函数
│   ├── helpers.js         # 通用工具函数
│   └── leaderboard.js     # 排行榜 localStorage 读写
└── hooks/
    └── useGame.js         # Babylon 场景管理 + 游戏循环 Hook
```

## 开发命令

```bash
npm run dev      # 启动开发服务器（默认 http://localhost:5173）
npm run build    # 生产构建，输出到 dist/
npm run preview  # 预览生产构建
npm run lint     # 代码检查
```

## 部署

项目基于 GitHub Pages 部署，base 路径为 `/babylon-game/`。构建后推送到 `gh-pages` 分支即可上线。

```bash
npm run build
npx gh-pages -d dist
```
