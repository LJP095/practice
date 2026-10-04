import type { Ingredient, Nutrition, NutritionPer100g } from './types'

export type IngredientTable = Record<string, NutritionPer100g>

const NUTRIENT_KEYS = ['caloriesKcal', 'carbsG', 'sodiumMg', 'fatG', 'cholesterolMg'] as const

export function emptyNutrition(): Nutrition {
  return { caloriesKcal: 0, carbsG: 0, sodiumMg: 0, fatG: 0, cholesterolMg: 0 }
}

// 由食材用量 × 每100g 营养，推导一份菜的营养
export function deriveServing(ingredients: Ingredient[], table: IngredientTable): Nutrition {
  const total = emptyNutrition()
  for (const ing of ingredients) {
    const per100 = table[ing.name]
    if (!per100) {
      throw new Error(`未知食材：${ing.name}（不在食材基础表中）`)
    }
    const factor = ing.grams / 100
    for (const key of NUTRIENT_KEYS) {
      total[key] += per100[key] * factor
    }
  }
  return roundNutrition(total)
}

// 多个营养值求和（用于整餐硬指标合计）
export function sumNutrition(list: Nutrition[]): Nutrition {
  const total = emptyNutrition()
  for (const n of list) {
    for (const key of NUTRIENT_KEYS) {
      total[key] += n[key]
    }
  }
  return roundNutrition(total)
}

function roundNutrition(n: Nutrition): Nutrition {
  return {
    caloriesKcal: Math.round(n.caloriesKcal),
    carbsG: round1(n.carbsG),
    sodiumMg: Math.round(n.sodiumMg),
    fatG: round1(n.fatG),
    cholesterolMg: Math.round(n.cholesterolMg),
  }
}

function round1(x: number): number {
  return Math.round(x * 10) / 10
}
