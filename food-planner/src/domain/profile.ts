// 用户个人资料领域规则：默认值、校验

import type { ActivityLevel, UserProfile } from './types'

export const ACTIVITIES: readonly ActivityLevel[] = ['light', 'moderate', 'high']

const LIMIT_KEYS = [
  'carbsGPerMeal',
  'sodiumMgPerMeal',
  'cholesterolMgPerMeal',
  'fatGPerDish',
] as const

// 校验任意来源（localStorage / 表单）的资料对象；通过则收窄为 UserProfile。
export function validateProfile(p: unknown): p is UserProfile {
  if (typeof p !== 'object' || p === null) return false
  const o = p as Record<string, unknown>

  if (typeof o.age !== 'number' || !Number.isFinite(o.age) || o.age <= 0 || o.age > 120) return false
  if (o.sex !== 'male' && o.sex !== 'female') return false
  if (typeof o.heightCm !== 'number' || !Number.isFinite(o.heightCm) || o.heightCm <= 0 || o.heightCm > 250) return false
  if (typeof o.weightKg !== 'number' || !Number.isFinite(o.weightKg) || o.weightKg <= 0 || o.weightKg > 400) return false
  if (!ACTIVITIES.includes(o.activity as ActivityLevel)) return false
  if (!Array.isArray(o.avoid) || o.avoid.some((x) => typeof x !== 'string')) return false

  if (o.limits != null) {
    if (typeof o.limits !== 'object') return false
    const l = o.limits as Record<string, unknown>
    for (const key of LIMIT_KEYS) {
      const v = l[key]
      if (v != null && (typeof v !== 'number' || !Number.isFinite(v) || v < 0)) return false
    }
  }

  return true
}
