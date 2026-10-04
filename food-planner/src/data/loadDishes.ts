// 数据层：把 dishes.json（原始菜）+ ingredients.json（食材表）装载为 Dish[]（含推导 perServing）

import dishesRaw from './dishes.json'
import ingredientsRaw from './ingredients.json'
import type { Dish, RawDish } from '../domain/types'
import { deriveServing, type IngredientTable } from '../domain/nutrition'

const table = ingredientsRaw as unknown as IngredientTable

export function loadDishes(): Dish[] {
  return (dishesRaw as unknown as RawDish[]).map((d) => ({
    ...d,
    perServing: deriveServing(d.ingredients, table),
  }))
}
