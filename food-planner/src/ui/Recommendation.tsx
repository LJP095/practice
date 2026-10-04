import { useState } from 'react'
import type { Meal, MealCounts, UserProfile } from '../domain/types'
import { loadDishes } from '../data/loadDishes'
import { isAvoided, isFatOk, recommendMeal } from '../domain/rules'
import { resolveLimits, type ResolvedLimits } from '../domain/limits'

const ALL_DISHES = loadDishes()

const DEFAULT_COUNTS: MealCounts = { staple: 1, meat: 1, veg: 1, soup: 0 }

const COUNT_CONFIG: { key: keyof MealCounts; label: string; max: number }[] = [
  { key: 'staple', label: '主食', max: 2 },
  { key: 'meat', label: '荤（含半荤）', max: 3 },
  { key: 'veg', label: '素', max: 3 },
  { key: 'soup', label: '汤', max: 1 },
]

const ACTIVITY_LABELS: Record<UserProfile['activity'], string> = {
  light: '轻体力',
  moderate: '中体力',
  high: '重体力',
}

interface Props {
  profile: UserProfile
  onEditProfile: () => void
}

export default function Recommendation({ profile, onEditProfile }: Props) {
  const [counts, setCounts] = useState<MealCounts>(DEFAULT_COUNTS)
  const [meal, setMeal] = useState<Meal | null>(() => recommendMeal(ALL_DISHES, profile, DEFAULT_COUNTS))

  const limits = resolveLimits(profile)
  const avoidedCount = ALL_DISHES.filter((d) => isAvoided(d, profile.avoid)).length
  const fattyCount = ALL_DISHES.filter((d) => !isAvoided(d, profile.avoid) && !isFatOk(d, limits)).length

  function recommend() {
    setMeal(recommendMeal(ALL_DISHES, profile, counts))
  }

  function change(key: keyof MealCounts, delta: number) {
    setCounts((c) => {
      const cfg = COUNT_CONFIG.find((x) => x.key === key)!
      return { ...c, [key]: Math.min(cfg.max, Math.max(0, c[key] + delta)) }
    })
  }

  return (
    <div className="recommendation">
      <header className="rec-header">
        <p className="profile-line">
          {profile.age} 岁 · {profile.sex === 'male' ? '男' : '女'} · 身高 {profile.heightCm}cm · 体重 {profile.weightKg}kg · {ACTIVITY_LABELS[profile.activity]}
        </p>
        <button type="button" className="link-btn" onClick={onEditProfile}>
          重新填写资料
        </button>
      </header>

      <section className="counts">
        {COUNT_CONFIG.map(({ key, label, max }) => (
          <div className="counter" key={key}>
            <span className="counter-label">{label}</span>
            <button type="button" aria-label={`${label}减少`} onClick={() => change(key, -1)} disabled={counts[key] <= 0}>
              −
            </button>
            <span className="counter-value" aria-label={`${label}数量`}>
              {counts[key]}
            </span>
            <button type="button" aria-label={`${label}增加`} onClick={() => change(key, 1)} disabled={counts[key] >= max}>
              +
            </button>
          </div>
        ))}
      </section>

      <div className="rec-actions">
        <button type="button" onClick={recommend}>
          推荐一餐
        </button>
        {meal && (
          <button type="button" className="secondary" onClick={recommend}>
            换一换
          </button>
        )}
      </div>

      {meal ? (
        <Result meal={meal} limits={limits} avoidedCount={avoidedCount} fattyCount={fattyCount} />
      ) : (
        <p className="empty">没有符合条件的组合。试试减少菜数，或在「重新填写资料」里放宽三高指标。</p>
      )}
    </div>
  )
}

function Result({
  meal,
  limits,
  avoidedCount,
  fattyCount,
}: {
  meal: Meal
  limits: ResolvedLimits
  avoidedCount: number
  fattyCount: number
}) {
  const checks = [
    { label: '碳水', value: meal.total.carbsG, unit: 'g', limit: limits.carbsGPerMeal },
    { label: '钠', value: meal.total.sodiumMg, unit: 'mg', limit: limits.sodiumMgPerMeal },
    { label: '胆固醇', value: meal.total.cholesterolMg, unit: 'mg', limit: limits.cholesterolMgPerMeal },
  ]

  return (
    <>
      <ul className="dish-list">
        {meal.dishes.map((d) => (
          <li key={d.id} className="dish-card">
            <h3>
              {d.name} <span className="cat">{d.category}</span>
            </h3>
            {d.note && <p className="dish-note">{d.note}</p>}
            {d.allergens.length > 0 && <p className="allergen">含：{d.allergens.join('、')}</p>}
            <p className="dish-nutrition">
              {d.perServing.caloriesKcal} kcal · 碳水 {d.perServing.carbsG}g · 钠 {d.perServing.sodiumMg}mg · 脂肪 {d.perServing.fatG}g · 胆固醇 {d.perServing.cholesterolMg}mg
            </p>
          </li>
        ))}
      </ul>

      <section className="meal-total">
        <h2>整餐硬指标（符合上限）</h2>
        <ul>
          {checks.map((c) => (
            <li key={c.label}>
              {c.label} {c.value}
              {c.unit} ≤ {c.limit}
              {c.unit} <span className="ok">✓</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="reason">
        推荐原因：每道菜脂肪未超单菜上限；忌口已过滤 {avoidedCount} 道、脂肪超限已过滤 {fattyCount} 道；整餐三项硬指标均在上限内。
      </p>
    </>
  )
}
