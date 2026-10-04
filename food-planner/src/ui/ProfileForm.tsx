import { useState, type FormEvent } from 'react'
import type { ActivityLevel, Sex, UserProfile } from '../domain/types'

interface Props {
  initial: UserProfile | null
  onSave: (profile: UserProfile) => void
}

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  light: '轻体力（久坐 / 办公）',
  moderate: '中体力（日常活动 / 站立）',
  high: '重体力（体力劳动 / 运动量大）',
}

export default function ProfileForm({ initial, onSave }: Props) {
  const [age, setAge] = useState(initial?.age?.toString() ?? '')
  const [sex, setSex] = useState<Sex>(initial?.sex ?? 'male')
  const [heightCm, setHeightCm] = useState(initial?.heightCm?.toString() ?? '')
  const [weightKg, setWeightKg] = useState(initial?.weightKg?.toString() ?? '')
  const [activity, setActivity] = useState<ActivityLevel>(initial?.activity ?? 'light')
  const [carbs, setCarbs] = useState(initial?.limits?.carbsGPerMeal?.toString() ?? '')
  const [sodium, setSodium] = useState(initial?.limits?.sodiumMgPerMeal?.toString() ?? '')
  const [cholesterol, setCholesterol] = useState(initial?.limits?.cholesterolMgPerMeal?.toString() ?? '')
  const [fat, setFat] = useState(initial?.limits?.fatGPerDish?.toString() ?? '')
  const [avoid, setAvoid] = useState((initial?.avoid ?? []).join('、'))
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const a = Number(age)
    const h = Number(heightCm)
    const w = Number(weightKg)

    if (!Number.isFinite(a) || a <= 0 || a > 120) {
      setError('请填写有效的年龄（1–120）')
      return
    }
    if (!Number.isFinite(h) || h <= 0 || h > 250) {
      setError('请填写有效的身高（cm）')
      return
    }
    if (!Number.isFinite(w) || w <= 0 || w > 400) {
      setError('请填写有效的体重（kg）')
      return
    }

    const limits = {
      carbsGPerMeal: parseOptional(carbs),
      sodiumMgPerMeal: parseOptional(sodium),
      cholesterolMgPerMeal: parseOptional(cholesterol),
      fatGPerDish: parseOptional(fat),
    }
    const hasLimits = Object.values(limits).some((v) => v !== undefined)

    onSave({
      age: a,
      sex,
      heightCm: h,
      weightKg: w,
      activity,
      limits: hasLimits ? limits : undefined,
      avoid: splitAvoid(avoid),
    })
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="age">年龄</label>
          <input id="age" type="number" min={1} max={120} value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="sex">性别</label>
          <select id="sex" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="heightCm">身高（cm）</label>
          <input id="heightCm" type="number" min={1} max={250} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="weightKg">体重（kg）</label>
          <input id="weightKg" type="number" min={1} max={400} value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="activity">活动量</label>
        <select id="activity" value={activity} onChange={(e) => setActivity(e.target.value as ActivityLevel)}>
          <option value="light">{ACTIVITY_LABELS.light}</option>
          <option value="moderate">{ACTIVITY_LABELS.moderate}</option>
          <option value="high">{ACTIVITY_LABELS.high}</option>
        </select>
      </div>

      <div className="field">
        <label>三高指标（可选，留空则用通用指南默认值）</label>
        <div className="field-row">
          <div className="field">
            <label htmlFor="carbs">单餐碳水上限（g）</label>
            <input id="carbs" type="number" min={0} value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="留空用默认" />
          </div>
          <div className="field">
            <label htmlFor="sodium">单餐钠上限（mg）</label>
            <input id="sodium" type="number" min={0} value={sodium} onChange={(e) => setSodium(e.target.value)} placeholder="留空用默认" />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="cholesterol">单餐胆固醇上限（mg）</label>
            <input id="cholesterol" type="number" min={0} value={cholesterol} onChange={(e) => setCholesterol(e.target.value)} placeholder="留空用默认" />
          </div>
          <div className="field">
            <label htmlFor="fat">单菜脂肪上限（g）</label>
            <input id="fat" type="number" min={0} value={fat} onChange={(e) => setFat(e.target.value)} placeholder="留空用默认" />
          </div>
        </div>
        <p className="field-note">对应血糖 / 血压 / 血脂；不确定可全部留空。</p>
      </div>

      <div className="field">
        <label htmlFor="avoid">忌口 / 禁忌（可选，用逗号或顿号分隔）</label>
        <input id="avoid" type="text" value={avoid} onChange={(e) => setAvoid(e.target.value)} placeholder="如：花生、虾、香菜" />
      </div>

      {error && <p className="error">{error}</p>}

      <button type="submit">保存资料</button>
    </form>
  )
}

function parseOptional(s: string): number | undefined {
  if (s.trim() === '') return undefined
  const n = Number(s)
  return Number.isFinite(n) && n >= 0 ? n : undefined
}

function splitAvoid(s: string): string[] {
  return s
    .split(/[,，、\s]+/)
    .map((x) => x.trim())
    .filter(Boolean)
}
