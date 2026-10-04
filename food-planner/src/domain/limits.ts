// 三高判定阈值：默认指南常量 + 用户指标优先的解析

import type { UserLimits, UserProfile } from './types'

// 默认指南阈值（单餐）。
// 说明：这些是「兜底」参考值，具体数值 Phase 4 与产品负责人复核后再定稿。
// - 钠：取宽松值以过滤「高钠叠加」（两道高钠荤菜），临床理想值更低（约 700mg/餐）；
//   因家常菜谱里每道菜含约 1g 盐 ≈ 393mg 钠，过严会导致无合法组合。
// - 胆固醇：过滤蛋类/虾等高胆固醇菜，保留清蒸鱼（约 172mg/道）。
export const DEFAULT_LIMITS: Required<UserLimits> = {
  carbsGPerMeal: 90, // 单餐碳水（血糖）
  sodiumMgPerMeal: 1500, // 单餐钠（血压）
  cholesterolMgPerMeal: 200, // 单餐胆固醇（血脂）
  fatGPerDish: 20, // 单菜总脂肪（逐菜，>20g 视为高油/肥腻）
}

export type ResolvedLimits = Required<UserLimits>

// 用户指标优先，缺失项用默认值兜底
export function resolveLimits(profile: UserProfile): ResolvedLimits {
  return {
    carbsGPerMeal: profile.limits?.carbsGPerMeal ?? DEFAULT_LIMITS.carbsGPerMeal,
    sodiumMgPerMeal: profile.limits?.sodiumMgPerMeal ?? DEFAULT_LIMITS.sodiumMgPerMeal,
    cholesterolMgPerMeal: profile.limits?.cholesterolMgPerMeal ?? DEFAULT_LIMITS.cholesterolMgPerMeal,
    fatGPerDish: profile.limits?.fatGPerDish ?? DEFAULT_LIMITS.fatGPerDish,
  }
}
