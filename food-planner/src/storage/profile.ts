// 个人资料的 localStorage 存取（存储层）
// 纯前端站点，无后端；资料只存在本机浏览器。

import type { UserProfile } from '../domain/types'
import { validateProfile } from '../domain/profile'

const STORAGE_KEY = 'wenwenchi.profile.v1'

export function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return validateProfile(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEY)
}
