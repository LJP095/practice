// 规则引擎：忌口硬过滤 + 一餐组装 + 硬指标整餐判定 + 其他指标逐菜判定
// 纯函数，不依赖 UI / 存储 / 数据文件；菜品以 Dish[]（含 perServing）传入。

import type { Dish, Meal, MealCounts, UserProfile } from './types'
import { resolveLimits, SODIUM_TIP_MG, type ResolvedLimits } from './limits'
import { sumNutrition } from './nutrition'

// —— 分类槽位（半荤归入荤） ——

export interface DishPools {
  staple: Dish[] // 主食
  meat: Dish[] // 荤 + 半荤
  veg: Dish[] // 素
  soup: Dish[] // 汤
}

export function groupDishes(dishes: Dish[]): DishPools {
  const pools: DishPools = { staple: [], meat: [], veg: [], soup: [] }
  for (const d of dishes) {
    if (d.category === '主食') pools.staple.push(d)
    else if (d.category === '荤' || d.category === '半荤') pools.meat.push(d)
    else if (d.category === '素') pools.veg.push(d)
    else if (d.category === '汤') pools.soup.push(d)
  }
  return pools
}

// —— 硬过滤：忌口（avoid 与菜品 allergens 交集非空则排除） ——

export function isAvoided(dish: Dish, avoid: string[]): boolean {
  if (avoid.length === 0) return false
  const set = new Set(avoid.map((s) => s.trim()).filter(Boolean))
  return dish.allergens.some((a) => set.has(a))
}

// —— 其他指标逐菜判定：总脂肪 ——

export function isFatOk(dish: Dish, limits: ResolvedLimits): boolean {
  return dish.perServing.fatG <= limits.fatGPerDish
}

// —— 减盐提示：单道菜钠偏高（软提示，不参与硬判定） ——

export function isHighSodium(dish: Dish): boolean {
  return dish.perServing.sodiumMg >= SODIUM_TIP_MG
}

// —— 硬指标整餐判定 ——

export function mealHardTotal(dishes: Dish[]): Meal['total'] {
  const n = sumNutrition(dishes.map((d) => d.perServing))
  return { carbsG: n.carbsG, sodiumMg: n.sodiumMg, cholesterolMg: n.cholesterolMg }
}

export function isMealHardOk(dishes: Dish[], limits: ResolvedLimits): boolean {
  const t = mealHardTotal(dishes)
  return (
    t.carbsG <= limits.carbsGPerMeal &&
    t.sodiumMg <= limits.sodiumMgPerMeal &&
    t.cholesterolMg <= limits.cholesterolMgPerMeal
  )
}

// —— 组装：按自选菜数从各槽位取菜，拼成候选一餐 ——

export function assembleMeals(pools: DishPools, counts: MealCounts): Meal[] {
  const meals: Meal[] = []
  for (const s of combinations(pools.staple, counts.staple))
    for (const m of combinations(pools.meat, counts.meat))
      for (const v of combinations(pools.veg, counts.veg))
        for (const t of combinations(pools.soup, counts.soup)) {
          const dishes = [...s, ...m, ...v, ...t]
          meals.push({ dishes, total: mealHardTotal(dishes) })
        }
  return meals
}

// —— 顶层：列出所有合法一餐（忌口 + 逐菜脂肪 + 整餐硬指标都通过） ——

export function listValidMeals(dishes: Dish[], profile: UserProfile, counts: MealCounts): Meal[] {
  const limits = resolveLimits(profile)
  const pools = groupDishes(dishes)
  for (const key of ['staple', 'meat', 'veg', 'soup'] as const) {
    pools[key] = pools[key].filter((d) => !isAvoided(d, profile.avoid) && isFatOk(d, limits))
  }
  return assembleMeals(pools, counts).filter((m) => isMealHardOk(m.dishes, limits))
}

// —— 推荐一道（随机；random 可注入以便测试） ——

export function recommendMeal(
  dishes: Dish[],
  profile: UserProfile,
  counts: MealCounts,
  random: () => number = Math.random,
): Meal | null {
  const meals = listValidMeals(dishes, profile, counts)
  if (meals.length === 0) return null
  return meals[Math.floor(random() * meals.length)]
}

// —— 组合（从 arr 取 k 个，k=0 返回 [[]]） ——

function combinations<T>(arr: T[], k: number): T[][] {
  if (k < 0 || k > arr.length) return []
  if (k === 0) return [[]]
  const result: T[][] = []
  const current: T[] = []
  function pick(start: number) {
    if (current.length === k) {
      result.push([...current])
      return
    }
    for (let i = start; i < arr.length; i++) {
      current.push(arr[i])
      pick(i + 1)
      current.pop()
    }
  }
  pick(0)
  return result
}
