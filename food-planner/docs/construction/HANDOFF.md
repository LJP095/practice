# 交接文档（HANDOFF）

> 让新 agent 无需聊天记录即可接续。

## 当前阶段与状态

阶段 0：基础骨架 —— 未开始（第一版范围已于 2026-10-05 确认）。

## 已完成

- 产品需求冻结（含「一餐组合」范围变更）
- 架构、构建计划、文档体系（PRD / ARCHITECTURE / CONSTRUCTION_PLAN / DEV_PROGRESS / LOG / HANDOFF）

## 未完成

- 全部代码

## 下一步（1–3 个有界任务）

1. 阶段 0：Vite + React 脚手架，`npm run build` 通过
2. 阶段 1：数据层（`Dish` 类型 + 家常菜库 30–50 道 + 食材营养数据导入与字段裁剪）
3. 阶段 2：个人资料表单 + localStorage

## 必读

1. `docs/product/PRODUCT_REQUIREMENTS.md`
2. `docs/construction/ARCHITECTURE.md`
3. `docs/construction/CONSTRUCTION_PLAN.md`
4. `docs/construction/DEV_PROGRESS.md`

## 重要文件

- `AGENTS.md`
- `docs/product/PRODUCT_REQUIREMENTS.md`
- `docs/construction/ARCHITECTURE.md`
- `docs/construction/CONSTRUCTION_PLAN.md`

## 测试基线

尚未建立（无代码）。

## 分支与提交

- 开发分支：`feat/food-planner`
- 基线提交：`1a5e9c5`
- 备份分支：`backup/food-planner-phase0-20261005`（已推送 origin）
- 最新提交：见 `git log`（文档基线提交）

## 工作区状态

food-planner/ 目录（文档）待提交。

## 风险

- `.gitignore` 的 `data/` 会匹配 `src/data/`，阶段 1 需处理。
- 中国食物成分表数据质量待验证（Phase 2）。
- 通用指南默认阈值具体数值待定（Phase 4）。
