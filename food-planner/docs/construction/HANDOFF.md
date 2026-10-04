# 交接文档（HANDOFF）

> 让新 agent 无需聊天记录即可接续。

## 当前阶段与状态

**第一版六阶段（0–5）全部完成。** 主流程可用：打开 → 填一次资料（本地保存）→ 自选菜数 → 得到符合三高限制的一餐组合 + 换一换。

## 已完成

- 产品需求冻结（含「一餐组合」范围变更）
- 架构、构建计划、文档体系
- 阶段 0 基础骨架：Vite + React + TS 静态站
- 阶段 1 数据层：食材 47 种 + 菜 33 道 + 校验脚本
- 阶段 2 个人资料：`UserProfile` 类型、表单 UI、资料校验、localStorage 存取
- 阶段 3 规则引擎：`Meal`/`MealCounts`、默认阈值 + 用户指标优先、忌口硬过滤、一餐组装（半荤归荤）、硬指标整餐/脂肪逐菜判定
- 阶段 4 推荐 UI：自选菜数控件 + 一餐组合展示 + 逐菜营养 + 整餐硬指标 + 推荐原因 + 换一换
- 阶段 5 收尾：文档校正、README 部署说明、最终校验

## 未完成（可选后续）

- 硬指标默认阈值复核定稿（尤其钠 1500mg 偏宽松）
- 食材营养数值与原书核对
- eslint 建立（typescript-eslint 尚不支持 TS 7.0.2）
- 真机浏览器手动点验 + 部署上线

## 下一步（1–3 个有界任务）

1. 产品负责人复核默认阈值（`src/domain/limits.ts`）与营养数据
2. 真机 `npm run dev` 点验；部署 `dist/` 到静态托管
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

## 测试基线

- `npm run build`（`tsc --noEmit && vite build`）✅ 通过
- `npm run validate:data` ✅ 通过
- `npm run check:profile` ✅ 通过
- `npm test`（vitest）✅ 通过（14 用例：引擎 11 + 组件 3）
- `git diff --check` ✅ 干净
- lint：未建立（typescript-eslint 与 TS 7.0.2 不兼容）

## 分支与提交

- 开发分支：`feat/food-planner`
- 基线提交：`1a5e9c5`
- 备份分支：`backup/food-planner-phase0/1/2/3/4/5-20261005`（均已推送 origin）
- 最新提交：`3859e03`（阶段 5 完成）

## 工作区状态

干净（阶段 5 已提交，待推送）。

## 风险

- 食材营养数值为手工参考值，正式使用前需与原书核对。
- 默认阈值为参考值，需产品负责人复核定稿。
- 浏览器端交互未经真机手动点验（逻辑已由 jsdom 组件测试覆盖）。
