# 交接文档（HANDOFF）

> 让新 agent 无需聊天记录即可接续。

## 当前阶段与状态

阶段 3：规则引擎 —— 已完成。下一阶段：阶段 4 推荐 UI。

## 已完成

- 产品需求冻结（含「一餐组合」范围变更）
- 架构、构建计划、文档体系（PRD / ARCHITECTURE / CONSTRUCTION_PLAN / DEV_PROGRESS / LOG / HANDOFF）
- 阶段 0 基础骨架：Vite + React + TS 静态站
- 阶段 1 数据层：食材子集 47 种 + 家常菜库 33 道 + 校验脚本
- 阶段 2 个人资料：`UserProfile` 类型、表单 UI、资料校验、localStorage 存取
- 阶段 3 规则引擎：`Meal`/`MealCounts` 类型、默认阈值 + 用户指标优先、忌口硬过滤、一餐组装（半荤归荤）、硬指标整餐/脂肪逐菜判定、vitest 11 用例

## 未完成

- 阶段 4 推荐 UI、阶段 5 收尾

## 下一步（1–3 个有界任务）

1. 阶段 4：推荐 UI（自选菜数控件 + 一餐组合展示 + 逐菜营养 + 整餐硬指标合计 + 推荐原因）
2. 阶段 5：收尾（lint/build/测试 + 文档校正 + 部署 + 提交推送）

## 必读

1. `docs/product/PRODUCT_REQUIREMENTS.md`
2. `docs/construction/ARCHITECTURE.md`
3. `docs/construction/CONSTRUCTION_PLAN.md`
4. `docs/construction/DEV_PROGRESS.md`

## 重要文件

- `AGENTS.md`
- `docs/product/PRODUCT_REQUIREMENTS.md`
- `docs/construction/ARCHITECTURE.md`、`CONSTRUCTION_PLAN.md`
- `src/domain/types.ts`（类型）、`src/domain/limits.ts`（阈值）、`src/domain/rules.ts`（规则引擎）
- `src/domain/profile.ts`（资料校验）、`src/storage/profile.ts`（localStorage）
- `src/data/loadDishes.ts`（数据装载）、`src/ui/ProfileForm.tsx`（表单）

## 测试基线

- `npm run build`（`tsc --noEmit && vite build`）✅ 通过
- `npm run validate:data` ✅ 通过
- `npm run check:profile` ✅ 通过
- `npm test`（vitest）✅ 通过（11 用例）
- `git diff --check` ✅ 干净

## 分支与提交

- 开发分支：`feat/food-planner`
- 基线提交：`1a5e9c5`
- 备份分支：`backup/food-planner-phase0/1/2/3-20261005`（均已推送 origin）
- 最新提交：`32fe51e`（阶段 3 完成）

## 工作区状态

干净（阶段 3 已提交，待推送）。

## 风险

- 食材营养数值为手工参考值，正式使用前需与原书核对。
- 硬指标默认阈值（碳水90g/钠1500mg/胆固醇200mg 单餐）为 Phase 3 占位参考值，Phase 4 需与产品负责人复核定稿（尤其钠值偏宽松）。
- 浏览器端「刷新后资料仍在」尚未自动化验证，需手动点验。
