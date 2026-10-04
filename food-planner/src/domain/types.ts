// 领域类型定义（数据层与规则层共享）

// 菜品分类
export type Category = '荤' | '半荤' | '素' | '汤' | '主食'

// 每 100g 可食部营养（食材基础表）
export interface NutritionPer100g {
  caloriesKcal: number
  carbsG: number // 碳水化合物
  sodiumMg: number // 钠
  fatG: number // 脂肪
  cholesterolMg: number // 胆固醇
}

// 菜品中的一项食材用量
export interface Ingredient {
  name: string
  grams: number
}

// 每份营养（由食材用量 × 每100g 营养推导）
export interface Nutrition {
  caloriesKcal: number
  carbsG: number
  sodiumMg: number
  fatG: number
  cholesterolMg: number
}

// 原始菜品（营养值由食材推导，不直接存）
export interface RawDish {
  id: string
  name: string
  category: Category
  ingredients: Ingredient[]
  allergens: string[] // 过敏原/忌口关键字
  note?: string // 做法/说明
}

// 完整菜品（含推导出的每份营养）
export interface Dish extends RawDish {
  perServing: Nutrition
}
