# 架构文档

> 第一版目标：最简单、可演进的结构。纯前端静态站，模块化单应用，无后端/数据库/登录。

## 1. 分层

| 层 | 职责 | 允许依赖 | 禁止依赖 | 状态 | 扩展点 |
|---|---|---|---|---|---|
| UI 层（React 组件） | 表单、推荐结果展示、解释原因 | 领域层（规则）、数据层 | 直接读写外部数据格式 | 已实现 | 多人登录页、摄入记录页 |
| 领域/规则层 | 一餐组合组装、三高判定规则、硬过滤（忌口）+ 软匹配（硬指标整餐合计/其他逐菜） | 数据类型定义 | UI、存储实现细节 | 已实现 | 健身/过敏/文化规则、智能配餐 |
| 数据层 | 家常菜库、食材营养数据、用户资料读写 | 类型定义 | UI | 已实现 | 后端 API、真实数据库 |
| 存储层 | localStorage 读写用户资料 | 无 | 领域规则 | 已实现 | 云端存储/账号 |

## 2. 目录结构（规划）

```text
food-planner/
├── AGENTS.md
├── docs/
│   ├── product/PRODUCT_REQUIREMENTS.md
│   └── construction/
│       ├── ARCHITECTURE.md
│       ├── CONSTRUCTION_PLAN.md
│       ├── DEV_PROGRESS.md
│       ├── LOG.md
│       └── HANDOFF.md
└── src/
    ├── data/          # 家常菜库、食材营养 JSON + loadDishes.ts（装载为 Dish[]）
    ├── domain/        # 类型 + 营养推导 + 资料校验 + 规则引擎（rules.ts / limits.ts）
    ├── storage/       # localStorage（profile.ts）
    ├── ui/            # React 组件（ProfileForm.tsx / Recommendation.tsx）
    └── main.tsx
```

（实际落地结构与上一致，另有 `scripts/` 校验脚本与 `src/**/*.test.ts(x)` 测试文件。）

## 3. 数据模型

### 用户资料 UserProfile

```ts
{
  // 基础信息
  age: number;
  sex: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  activity: 'light' | 'moderate' | 'high';

  // 三高指标（可选；留空则用默认指南阈值）
  limits?: {
    carbsGPerMeal?: number;        // 单餐碳水上限（血糖）
    sodiumMgPerMeal?: number;      // 单餐钠上限（血压）
    cholesterolMgPerMeal?: number; // 单餐胆固醇上限（血脂）
    fatGPerDish?: number;          // 单菜总脂肪阈值（血脂，逐菜）
  };

  // 忌口 / 禁忌（硬过滤）
  avoid: string[];  // 如 ["花生", "虾", "香菜"]
}
```

### 家常菜 Dish

```ts
{
  id: string;
  name: string;            // 如 "清蒸鲈鱼"
  category: '荤' | '半荤' | '素' | '汤' | '主食';
  perServing: {
    caloriesKcal: number;
    carbsG: number;        // 碳水化合物（硬指标·血糖）
    sodiumMg: number;      // 钠（硬指标·血压）
    fatG: number;          // 脂肪（其他·血脂）
    cholesterolMg: number; // 胆固醇（硬指标·血脂）
  };
  ingredients: { name: string; grams: number }[];
  allergens: string[];     // 过敏原/忌口关键字，用于硬过滤
  note?: string;           // 做法/说明
}
```

### 一餐组合 Meal

```ts
{
  dishes: Dish[];      // 该餐包含的菜品
  total: {             // 整餐营养合计（用于硬指标整餐判定）
    carbsG: number;
    sodiumMg: number;
    cholesterolMg: number;
  };
}
```

### 推荐规则

1. **硬过滤**：菜品的 `allergens` 与用户 `avoid` 交集非空 → 排除。
2. **组装候选餐**：按用户自选菜数（主食0-2、荤0-3、素0-3、汤0-1）从各分类取菜，拼成候选一餐。
3. **硬指标整餐判定**：`碳水 / 钠 / 胆固醇` 三项，将一餐所有菜的值**合计**后与单餐上限（用户 `limits` 或默认指南）比较；超限的组合排除。
4. **其他指标逐菜判定**：`总脂肪` 一项，逐菜与单菜阈值比较；超限的菜排除。
5. 从合法组合中随机/轮换选出一套推荐（第一版不做复杂算法）。

## 4. 数据来源

- 家常菜库：自建 JSON（约 30–50 道常见中餐，营养值由食材估算）。
- 食材营养：《中国食物成分表（第6版）》开源数据（1677 种食材，每 100g），导入为 JSON，仅保留所需字段。

## 5. 默认指南阈值

参考值已落地于 `src/domain/limits.ts`（待产品负责人复核定稿，尤其钠值偏宽松）：
- 硬指标（碳水/钠/胆固醇）：单餐**合计**上限 —— 碳水 90g / 钠 1500mg / 胆固醇 200mg。
- 其他指标（总脂肪）：单菜阈值 —— 20g。
- 判定规则：用户 `limits` 优先，缺失项用默认值兜底（`resolveLimits`）。
