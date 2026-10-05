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
- 阶段 4 开始（推荐 UI）：自选菜数控件 + 一餐组合展示 + 逐菜营养 + 整餐硬指标合计 + 推荐原因。
- 阶段 4 完成：`src/ui/Recommendation.tsx`（自选菜数控件 + 一餐展示 + 逐菜营养 + 整餐硬指标 + 推荐原因 + 换一换）、App 集成推荐页；引入 @testing-library/react + jsdom；组件测试 3 个；全套 14 测试全绿。
- 阶段 5 开始（收尾）：建立 lint（eslint）、复跑 build/测试、文档校正、部署说明、提交推送。
- 阶段 5·lint 尝试失败（保留记录）：`npm i -D eslint typescript-eslint @eslint/js eslint-plugin-react-hooks` 报 ERESOLVE —— typescript-eslint@8 的 peer 依赖要求 `typescript >=4.8.4 <6.1.0`，本项目用 7.0.2（native tsc），无法安装。决策：不 `--force/--legacy-peer-deps` 强制（有破坏风险、也未必能解析 TS7）；静态检查由 `npm run build` 内的 `tsc --noEmit`（strict + noUnusedLocals/Parameters）承担，eslint 记为「未建立」。
- 阶段 5 完成（收尾）：文档校正（ARCHITECTURE 层状态/目录/阈值、PRD 开放问题、新增 README 部署说明）；`npm run build` / `test`(14) / `validate:data` / `check:profile` / `diff --check` 全绿。第一版六阶段（0–5）全部完成。
- 阈值复核（产品负责人拍板，2026-10-05）：四项阈值定稿保持现状——碳水90g / 钠1500mg / 胆固醇200mg / 总脂肪20g。钠1500mg 正式标注为「过滤高钠叠加」的宽松值：临床理想约670mg/餐（成人每日盐≤5g≈2000mg钠），但菜谱每菜约1g盐≈393mg钠、1荤1素1主食最低约920mg，过严会无解；缺口交给数据核对。
- 新增「减盐提示」（软提示，不参与判定）：`limits.ts` 增 `SODIUM_TIP_MG=600`；`rules.ts` 增 `isHighSodium`；`Recommendation.tsx` 在偏咸菜卡与推荐原因标注「偏咸：建议少放盐/酱油」；`rules.test.ts` 增 1 用例。`build` 通过、`test` 15 个全绿。建回滚分支 `backup/food-planner-threshold-review-20261005`（已推送）。
- 真机点验通过（2026-10-05）：`npm run dev` 冒烟（标题「稳稳吃」、入口 200）+ 用户浏览器手动点验全流程（资料 / 选菜数 / 推荐 / 换一换 / 减盐提示 / 忌口 / localStorage 持久化）均正常。
- 部署（2026-10-05）：`vite.config.ts` 加 `base: './'`（相对路径，适配任意子路径）；`dist/` 以孤儿提交推至新分支 `gh-pages`（index.html + assets/ + .nojekyll）。GitHub Pages 需在仓库 Settings 手动开启（本机无 gh CLI）：Source=Deploy from a branch → gh-pages /(root)。预期 URL https://ljp095.github.io/practice/ 。
- 一键部署脚本（2026-10-05）：新增 `scripts/deploy.mjs` + `npm run deploy`（build → 浅克隆 gh-pages → 清空重建 → 追加提交，不用 `git push --force`）；README 增部署说明。实测 dist 无变化时正确跳过。
