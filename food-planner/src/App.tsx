import { useState } from 'react'
import { loadProfile, saveProfile } from './storage/profile'
import ProfileForm from './ui/ProfileForm'
import Recommendation from './ui/Recommendation'
import type { UserProfile } from './domain/types'

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
      <Recommendation profile={profile} onEditProfile={() => setEditing(true)} />
    </main>
  )
}

export default App
