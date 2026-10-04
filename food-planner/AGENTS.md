# 稳稳吃（food-planner）

为三高人群提供「一餐家常菜组合推荐」的极简网页工具。第一版：单人自用。

## 指令优先级

1. 用户最新明确指令
2. 本文件（AGENTS.md）
3. `docs/construction/` 下的构建文档
4. `docs/product/PRODUCT_REQUIREMENTS.md`
5. 已有代码
6. 智能体自身偏好

## 必读顺序

1. `docs/product/PRODUCT_REQUIREMENTS.md`
2. `docs/construction/ARCHITECTURE.md`
3. `docs/construction/CONSTRUCTION_PLAN.md`
4. `docs/construction/DEV_PROGRESS.md`

## 开始 / 结束规则

- **开始**：读必读文档；确认当前阶段；不要实现阶段之外的功能。
- **结束**：更新 `DEV_PROGRESS.md`、`LOG.md`、`HANDOFF.md`；核对文档与实际代码一致；如实报告状态。

## 当前阶段

阶段 4：推荐 UI（已完成）→ 下一阶段：阶段 5 收尾

## 关键事实

- 仓库根：`c:/Users/lljjp/Desktop/git`（practice 仓库）
- 本子目录：`food-planner/`
- 远程：`git@github.com:LJP095/practice.git`
- 开发分支：`feat/food-planner`
- 第一版：纯前端静态站，无后端 / 数据库 / 登录；推荐「一餐组合」（用户自选菜数）

## 禁止的破坏性操作

- `git reset --hard` / `git clean -fd` / `git push --force` / `git checkout -- <file>` / `git restore <file>`
- 删除或覆盖仓库根目录已有的 `fruit.txt` 及其他内容
- 读取或暴露 SSH 私钥
- 未经许可改动全局 Git 身份
