# 稳稳吃（food-planner）

为三高人群推荐「一餐家常菜组合」的极简网页工具。纯前端静态站，无后端 / 数据库 / 登录，个人资料存本机浏览器 localStorage。

## 本地运行

```bash
npm install
npm run dev        # 开发服务器
```

## 测试与校验

```bash
npm run build         # tsc 类型检查 + vite 打包
npm test              # vitest 单元/组件测试
npm run validate:data # 校验食材/菜品数据
npm run check:profile # 校验个人资料存取逻辑
```

## 构建与部署

```bash
npm run build    # 产物在 dist/
npm run preview  # 本地预览产物
npm run deploy   # 构建并把 dist/ 推送到 gh-pages 分支（GitHub Pages）
```

`dist/` 为纯静态文件，可部署到任意静态托管（GitHub Pages / Netlify / Vercel / 任意静态服务器），无需后端。`npm run deploy` 会先构建再推送到 `gh-pages`，首次使用前需在仓库 Settings → Pages 里把 Source 设为 `gh-pages`。

## 说明

- 食材营养值为手工参考值（参考《中国食物成分表（第6版）》），正式使用前需核对。
- 默认阈值（碳水 90g / 钠 1500mg / 胆固醇 200mg 单餐，脂肪 20g 单菜）已于 2026-10-05 复核定稿，见 `docs/construction/ARCHITECTURE.md` 与 `docs/product/PRODUCT_REQUIREMENTS.md`。
- lint：eslint 未建立（`typescript-eslint` 尚不支持本项目使用的 TypeScript 7.0.2）；静态检查由 `npm run build` 内的 `tsc --noEmit` 承担。
