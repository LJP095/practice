# 交接文档（HANDOFF）

> 让新 agent 无需聊天记录即可接续。

## 当前阶段与状态

**第一版六阶段（0–5）全部完成，且后置增量（阈值复核定稿 + 减盐提示）已完成。** 主流程可用：打开 → 填一次资料（本地保存）→ 自选菜数 → 得到符合三高限制的一餐组合 + 换一换。

## 已完成

- 产品需求冻结（含「一餐组合」范围变更）
- 架构、构建计划、文档体系
- 阶段 0 基础骨架：Vite + React + TS 静态站
- 阶段 1 数据层：食材 47 种 + 菜 33 道 + 校验脚本
- 阶段 2 个人资料：`UserProfile` 类型、表单 UI、资料校验、localStorage 存取
- 阶段 3 规则引擎：`Meal`/`MealCounts`、默认阈值 + 用户指标优先、忌口硬过滤、一餐组装（半荤归荤）、硬指标整餐/脂肪逐菜判定
- 阶段 4 推荐 UI：自选菜数控件 + 一餐组合展示 + 逐菜营养 + 整餐硬指标 + 推荐原因 + 换一换
- 阶段 5 收尾：文档校正、README 部署说明、最终校验
- 后置：默认阈值复核定稿（碳水90g/钠1500mg/胆固醇200mg/脂肪20g）+ 减盐提示（单菜钠≥600mg 标「偏咸：建议少放盐/酱油」，软提示不参与判定）

## 未完成（可选后续）

- 食材营养数值与原书核对
- eslint 建立（typescript-eslint 尚不支持 TS 7.0.2）
- 开启 GitHub Pages（Settings → Pages → Source=gh-pages；站点已推该分支，本机无 gh CLI 需手动一步）

## 下一步（1–3 个有界任务）

1. 开启 GitHub Pages：仓库 Settings → Pages → Source=Deploy from a branch → gh-pages /(root)，然后访问 https://ljp095.github.io/practice/
2. 食材营养数值（47 种，手工参考值）与原书核对
3. （可选）TS 7 兼容的 lint 方案

## 必读

1. `docs/product/PRODUCT_REQUIREMENTS.md`
2. `docs/construction/ARCHITECTURE.md`
3. `docs/construction/CONSTRUCTION_PLAN.md`
4. `docs/construction/DEV_PROGRESS.md`

## 重要文件

- `AGENTS.md`、`README.md`
- `docs/product/PRODUCT_REQUIREMENTS.md`
- `docs/construction/ARCHITECTURE.md`、`CONSTRUCTION_PLAN.md`
- `src/domain/types.ts`、`limits.ts`、`rules.ts`、`profile.ts`、`nutrition.ts`
- `src/storage/profile.ts`
- `src/data/loadDishes.ts`、`src/data/dishes.json`、`src/data/ingredients.json`
- `src/ui/ProfileForm.tsx`、`src/ui/Recommendation.tsx`、`src/App.tsx`
- `scripts/deploy.mjs`（一键部署 `npm run deploy`）

## 测试基线

- `npm run build`（`tsc --noEmit && vite build`）✅ 通过
- `npm run validate:data` ✅ 通过
- `npm run check:profile` ✅ 通过
- `npm test`（vitest）✅ 通过（15 用例：引擎 12 + 组件 3）
- `git diff --check` ✅ 干净
- lint：未建立（typescript-eslint 与 TS 7.0.2 不兼容）

## 分支与提交

- 开发分支：`feat/food-planner`
- 基线提交：`1a5e9c5`
- 备份分支：`backup/food-planner-phase0/1/2/3/4/5-20261005`、`backup/food-planner-threshold-review-20261005`（均已推送 origin）
- 最新提交：`338c3e5`（部署：base 相对路径 + 日志）

## 工作区状态

干净（阈值复核 + 减盐提示 + 部署 base 变更均已提交；gh-pages 分支已推送）。

## 风险

- 食材营养数值为手工参考值，正式使用前需与原书核对。
- 默认阈值已定稿，但钠 1500mg/餐 为「过滤高钠叠加」的宽松值（临床理想约 670mg/餐），根因是菜谱每菜约 1g 盐；已用「减盐提示」缓解，正式用前仍建议数据核对。
- 浏览器端交互未经真机手动点验（逻辑已由 jsdom 组件测试覆盖）。
