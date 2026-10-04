import { useState } from 'react'
import { loadProfile, saveProfile } from './storage/profile'
import ProfileForm from './ui/ProfileForm'
import type { UserProfile } from './domain/types'

const ACTIVITY_NAMES: Record<UserProfile['activity'], string> = {
  light: '轻体力',
  moderate: '中体力',
  high: '重体力',
}

function App() {
  const [profile, setProfile] = useState<UserProfile | null>(() => loadProfile())
  const [editing, setEditing] = useState(false)

  function handleSave(p: UserProfile) {
    saveProfile(p)
    setProfile(p)
    setEditing(false)
  }

  if (!profile || editing) {
    return (
      <main className="app">
        <h1>稳稳吃</h1>
        <p className="subtitle">先填一次个人情况，之后每天告诉你「这一顿吃什么」。</p>
        <ProfileForm initial={profile} onSave={handleSave} />
      </main>
    )
  }

  return (
    <main className="app">
      <h1>稳稳吃</h1>
      <section className="profile-summary">
        <p>
          已保存个人资料 <span className="ok">✓</span>
        </p>
        <ul>
          <li>
            {profile.age} 岁 · {profile.sex === 'male' ? '男' : '女'} · 身高 {profile.heightCm}cm · 体重 {profile.weightKg}kg
          </li>
          <li>活动量：{ACTIVITY_NAMES[profile.activity]}</li>
          {profile.avoid.length > 0 && <li>忌口：{profile.avoid.join('、')}</li>}
        </ul>
        <button type="button" onClick={() => setEditing(true)}>
          重新填写
        </button>
      </section>
      <p className="hint">（一餐推荐功能将在后续阶段加入）</p>
    </main>
  )
}

export default App
