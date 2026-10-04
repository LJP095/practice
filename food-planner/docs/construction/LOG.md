# 构建日志（LOG）

> 按时间记录每次会话的关键事件、决策变更、失败与修复。失败历史不删除。

## 2026-10-05

- 恢复模式：读取已冻结的 PRD / ARCHITECTURE / CONSTRUCTION_PLAN。
- 与产品负责人澄清并确认第一版范围变更：
  - 产品名：三高吃什么 → **稳稳吃**
  - 推荐单位：单道菜 → **一餐组合**（用户自选菜数）
  - 判定口径：**硬指标（钠/胆固醇/糖）整餐合计 + 其他（总脂肪/饱和脂肪/碳水）逐菜**
  - 选菜数范围：主食 0-2、荤 0-3、素 0-3、汤 0-1（默认 1荤 1素 1主食）
- 同步更新 PRD / ARCHITECTURE / CONSTRUCTION_PLAN / DEV_PROGRESS / AGENTS.md。
- 仓库检查：feat/food-planner 与 main 同在基线 `1a5e9c5`；food-planner/ 此前未提交。
- 建立远程回滚点：`backup/food-planner-phase0-20261005`（已推送 origin）。
- 待处理隐患：`.gitignore` 的 `data/` 规则会匹配 `src/data/`，阶段 1 数据层落地时需处理（改名或加否定规则）。
- 阶段 0 完成：Vite + React + TS 脚手架；`npm run build` 通过；dev 服务器冒烟测试通过（页面标题「稳稳吃」返回正常）。
- 阶段 1 开始（数据层）：Dish/Ingredient 类型 + 家常菜库 + 食材营养子集 + 校验脚本。
- 数据源调研：网络受限，无法从 GitHub 下载《中国食物成分表》开源数据 → 改手工整理约 45 种常用食材子集（数值参考第6版，标注「待逐条核对」）。
- 字段调整（与产品负责人确认）：第6版一般营养成分无「糖」「饱和脂肪」字段 → 硬指标（整餐）= 碳水/钠/胆固醇，其他（逐菜）= 总脂肪；去掉糖、饱和脂肪。
- 阶段 1 完成：47 种食材 + 33 道家常菜；`npm run validate:data` 与 `npm run build` 均通过；`.gitignore` 加 `!food-planner/src/data/` 修正 data/ 误伤。
- 阶段 2 开始（个人资料）：`UserProfile` 类型 + 表单 UI + 校验 + localStorage 保存/读取。
- 阶段 2 完成：`src/domain/profile.ts`（校验）+ `src/storage/profile.ts`（localStorage 存取）+ `src/ui/ProfileForm.tsx`（表单）+ `App.tsx`（已保存概览）；新增 `check:profile` 冒烟脚本；`npm run build` 与 `npm run check:profile` 均通过。
- 阶段 3 开始（规则引擎）：`Meal` 类型 + 默认阈值常量 + 忌口硬过滤 + 一餐组装 + 硬指标整餐/其他逐菜判定 + 单元测试。半荤归入「荤」槽位（荤+半荤共用菜池）。
- 阶段 3 完成：`src/domain/limits.ts`（默认阈值 + resolveLimits 用户优先）、`src/domain/rules.ts`（规则引擎纯函数）、`src/data/loadDishes.ts`（数据装载为 Dish[]）；引入 vitest；11 个单测全绿；`build`/`test`/`validate:data`/`check:profile`/`diff --check` 全绿。
