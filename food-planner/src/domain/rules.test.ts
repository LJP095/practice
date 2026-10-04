import { describe, it, expect } from 'vitest'
import type { Dish, MealCounts, Nutrition, UserProfile } from './types'
import { loadDishes } from '../data/loadDishes'
import { groupDishes, isAvoided, isFatOk, isMealHardOk, listValidMeals, recommendMeal } from './rules'
import { DEFAULT_LIMITS, resolveLimits } from './limits'

function nut(over: Partial<Nutrition> = {}): Nutrition {
  return { caloriesKcal: 0, carbsG: 0, sodiumMg: 0, fatG: 0, cholesterolMg: 0, ...over }
}

function makeDish(over: Partial<Dish> = {}): Dish {
  return {
    id: 'd',
    name: '测试菜',
    category: '素',
    ingredients: [],
    allergens: [],
    perServing: nut(),
    ...over,
  }
}

const baseProfile: UserProfile = {
  age: 60,
  sex: 'male',
  heightCm: 170,
  weightKg: 70,
  activity: 'light',
  avoid: [],
}

const defaultCounts: MealCounts = { staple: 1, meat: 1, veg: 1, soup: 0 }

describe('忌口硬过滤', () => {
  it('avoid 与 allergens 交集非空则排除', () => {
    const shrimp = makeDish({ name: '白灼虾', allergens: ['虾'] })
    expect(isAvoided(shrimp, ['虾'])).toBe(true)
    expect(isAvoided(shrimp, ['花生'])).toBe(false)
    expect(isAvoided(shrimp, [])).toBe(false)
    expect(isAvoided(shrimp, [' 虾 '])).toBe(true) // 首尾空格不误判
  })
})

describe('其他指标逐菜（总脂肪）', () => {
  it('单菜总脂肪超阈值排除', () => {
    const limits = resolveLimits(baseProfile)
    expect(isFatOk(makeDish({ perServing: nut({ fatG: 21 }) }), limits)).toBe(false)
    expect(isFatOk(makeDish({ perServing: nut({ fatG: 20 }) }), limits)).toBe(true)
    expect(isFatOk(makeDish({ perServing: nut({ fatG: 5 }) }), limits)).toBe(true)
  })
})

describe('硬指标整餐判定', () => {
  it('任一硬指标合计超限则排除，未超限则通过', () => {
    const limits = resolveLimits(baseProfile)
    const a = makeDish({ perServing: nut({ sodiumMg: 1200 }) })
    const b = makeDish({ perServing: nut({ sodiumMg: 400 }) })
    expect(isMealHardOk([a, b], limits)).toBe(false) // 1600 > 1500
    expect(isMealHardOk([b], limits)).toBe(true)
    expect(isMealHardOk([], limits)).toBe(true)

    const egg = makeDish({ perServing: nut({ cholesterolMg: 250 }) })
    expect(isMealHardOk([egg], limits)).toBe(false) // 250 > 200
  })
})

describe('默认阈值兜底与用户指标优先', () => {
  it('未填 limits 时用默认指南阈值', () => {
    expect(resolveLimits(baseProfile)).toEqual(DEFAULT_LIMITS)
  })

  it('用户填写的指标覆盖默认，未填的兜底', () => {
    const p: UserProfile = { ...baseProfile, limits: { sodiumMgPerMeal: 800 } }
    const r = resolveLimits(p)
    expect(r.sodiumMgPerMeal).toBe(800)
    expect(r.carbsGPerMeal).toBe(DEFAULT_LIMITS.carbsGPerMeal)
    expect(r.cholesterolMgPerMeal).toBe(DEFAULT_LIMITS.cholesterolMgPerMeal)
    expect(r.fatGPerDish).toBe(DEFAULT_LIMITS.fatGPerDish)
  })
})

describe('组装与自选菜数', () => {
  it('半荤归入荤槽位', () => {
    const banhun = makeDish({ id: 'bh', name: '番茄炒蛋', category: '半荤' })
    const hun = makeDish({ id: 'h', name: '红烧肉', category: '荤' })
    const su = makeDish({ id: 's', name: '青菜', category: '素' })
    const pools = groupDishes([banhun, hun, su])
    expect(pools.meat.map((d) => d.name).sort()).toEqual(['番茄炒蛋', '红烧肉'])
    expect(pools.veg.map((d) => d.name)).toEqual(['青菜'])
  })

  it('默认 1荤1素1主食：真实数据能产出对应菜数的合法组合', () => {
    const meals = listValidMeals(loadDishes(), baseProfile, defaultCounts)
    expect(meals.length).toBeGreaterThan(0)
    for (const m of meals) {
      expect(m.dishes).toHaveLength(3)
      const cats = m.dishes.map((d) => d.category)
      expect(cats).toContain('主食')
      expect(cats.some((c) => c === '荤' || c === '半荤')).toBe(true)
      expect(cats).toContain('素')
    }
  })

  it('忌口「虾」后，所有合法组合均不含虾', () => {
    const profile: UserProfile = { ...baseProfile, avoid: ['虾'] }
    const meals = listValidMeals(loadDishes(), profile, defaultCounts)
    expect(meals.length).toBeGreaterThan(0)
    for (const m of meals) {
      for (const d of m.dishes) {
        expect(d.allergens).not.toContain('虾')
      }
    }
  })

  it('可选汤：counts.soup=1 时组合含一道汤', () => {
    const counts: MealCounts = { staple: 1, meat: 1, veg: 0, soup: 1 }
    const meals = listValidMeals(loadDishes(), baseProfile, counts)
    expect(meals.length).toBeGreaterThan(0)
    for (const m of meals) {
      expect(m.dishes.map((d) => d.category)).toContain('汤')
    }
  })
})

describe('推荐与无解兜底', () => {
  it('recommendMeal 从合法组合中选取（random 可注入）', () => {
    const dishes = loadDishes()
    const meals = listValidMeals(dishes, baseProfile, defaultCounts)
    const pick = recommendMeal(dishes, baseProfile, defaultCounts, () => 0)
    expect(pick).not.toBeNull()
    expect(pick!.dishes.map((d) => d.id).sort()).toEqual(meals[0].dishes.map((d) => d.id).sort())
  })

  it('过严限制导致无合法组合：返回空数组 / null', () => {
    const profile: UserProfile = {
      ...baseProfile,
      limits: { carbsGPerMeal: 1, sodiumMgPerMeal: 1, cholesterolMgPerMeal: 1, fatGPerDish: 0 },
    }
    expect(listValidMeals(loadDishes(), profile, defaultCounts)).toEqual([])
    expect(recommendMeal(loadDishes(), profile, defaultCounts)).toBeNull()
  })
})
