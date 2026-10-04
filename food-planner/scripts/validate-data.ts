import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deriveServing } from '../src/domain/nutrition'
import type { NutritionPer100g, RawDish } from '../src/domain/types'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

const ingredients = JSON.parse(
  readFileSync(join(root, 'src/data/ingredients.json'), 'utf8'),
) as Record<string, NutritionPer100g>

const dishes = JSON.parse(
  readFileSync(join(root, 'src/data/dishes.json'), 'utf8'),
) as RawDish[]

const CATEGORIES = ['荤', '半荤', '素', '汤', '主食']
const NUTRIENT_KEYS = ['caloriesKcal', 'carbsG', 'sodiumMg', 'fatG', 'cholesterolMg'] as const

const errors: string[] = []

// 1. 食材表校验
for (const [name, n] of Object.entries(ingredients)) {
  for (const key of NUTRIENT_KEYS) {
    const v = n[key]
    if (typeof v !== 'number' || !Number.isFinite(v) || v < 0) {
      errors.push(`食材「${name}」字段 ${key} 缺失或非法：${v}`)
    }
  }
}

// 2. 菜品校验
const seenIds = new Set<string>()
for (const d of dishes) {
  if (!d.id || seenIds.has(d.id)) errors.push(`菜品 id 缺失或重复：${d.id}`)
  seenIds.add(d.id)

  if (!d.name) errors.push(`菜品 ${d.id} 缺 name`)
  if (!CATEGORIES.includes(d.category)) errors.push(`菜品「${d.name}」分类非法：${d.category}`)
  if (!Array.isArray(d.allergens)) errors.push(`菜品「${d.name}」allergens 非数组`)

  if (!Array.isArray(d.ingredients) || d.ingredients.length === 0) {
    errors.push(`菜品「${d.name}」缺 ingredients`)
  } else {
    for (const ing of d.ingredients) {
      if (typeof ing.grams !== 'number' || ing.grams <= 0) {
        errors.push(`菜品「${d.name}」食材「${ing.name}」用量非法：${ing.grams}`)
      }
      if (!ingredients[ing.name]) {
        errors.push(`菜品「${d.name}」含未知食材「${ing.name}」`)
      }
    }
  }

  // 推导每份营养（应无异常且字段齐全）
  try {
    const ps = deriveServing(d.ingredients, ingredients)
    for (const key of NUTRIENT_KEYS) {
      if (!Number.isFinite(ps[key])) errors.push(`菜品「${d.name}」推导后 ${key} 非法`)
    }
  } catch (e) {
    errors.push(`菜品「${d.name}」推导失败：${(e as Error).message}`)
  }
}

// 3. 报告
console.log(`食材表：${Object.keys(ingredients).length} 种`)
console.log(`家常菜库：${dishes.length} 道`)
const byCat = dishes.reduce<Record<string, number>>((acc, d) => {
  acc[d.category] = (acc[d.category] ?? 0) + 1
  return acc
}, {})
console.log('分类分布：', JSON.stringify(byCat))

if (errors.length > 0) {
  console.error(`\n❌ 校验失败，共 ${errors.length} 处问题：`)
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
} else {
  console.log('\n✅ 数据校验通过：字段齐全、无缺失关键营养值、食材均能解析。')
}
