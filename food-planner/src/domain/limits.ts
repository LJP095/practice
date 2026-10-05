// 三高判定阈值：默认指南常量 + 用户指标优先的解析

import type { UserLimits, UserProfile } from './types'

// 默认指南阈值（单餐），已于 2026-10-05 与产品负责人复核定稿。
// - 钠 1500mg：宽松值，仅过滤「高钠叠加」（高钠荤/素堆叠）。临床理想值约 670mg/餐
//   （成人每日盐 ≤5g ≈ 2000mg 钠），但家常菜谱每道菜约 1g 盐 ≈ 393mg 钠，
//   1荤1素1主食最低也约 920mg，过严会导致无合法组合。缺口交给数据核对 + 减盐提示。
// - 胆固醇 200mg：过滤蛋类（约 585mg/道）等高胆固醇菜，保留清蒸鱼（约 172mg/道）。
export const DEFAULT_LIMITS: Required<UserLimits> = {
  carbsGPerMeal: 90, // 单餐碳水（血糖）
  sodiumMgPerMeal: 1500, // 单餐钠（血压）
  cholesterolMgPerMeal: 200, // 单餐胆固醇（血脂）
  fatGPerDish: 20, // 单菜总脂肪（逐菜，>20g 视为高油/肥腻）
}

// 减盐提示阈值：单道菜钠 ≥ 600mg（约 1.5g 盐）视为偏咸，UI 提示少放盐/酱油。
// 这是「软提示」而非硬过滤，不参与推荐判定。
export const SODIUM_TIP_MG = 600

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
