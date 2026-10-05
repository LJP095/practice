// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import Recommendation from './Recommendation'
import type { UserProfile } from '../domain/types'

afterEach(cleanup)

const profile: UserProfile = {
  age: 60,
  sex: 'male',
  heightCm: 170,
  weightKg: 70,
  activity: 'light',
  avoid: [],
}

function dishCount(container: HTMLElement): number {
  return container.querySelectorAll('.dish-card').length
}

describe('Recommendation 推荐 UI', () => {
  it('挂载即按默认菜数（1荤1素1主食）给出 3 道菜的组合', () => {
    const { container } = render(<Recommendation profile={profile} onEditProfile={() => {}} />)
    expect(dishCount(container)).toBe(3)
    expect(screen.getByText('整餐硬指标（符合上限）')).toBeTruthy()
  })

  it('加一道汤后点「推荐一餐」，得到 4 道菜且含一道汤', () => {
    const { container } = render(<Recommendation profile={profile} onEditProfile={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: '汤增加' }))
    fireEvent.click(screen.getByRole('button', { name: '推荐一餐' }))

    expect(dishCount(container)).toBe(4)
    const cats = Array.from(container.querySelectorAll('.dish-card .cat')).map((el) => el.textContent)
    expect(cats).toContain('汤')
  })

  it('有忌口时，推荐结果不含忌口菜，且提示已过滤', () => {
    const { container } = render(<Recommendation profile={{ ...profile, avoid: ['虾'] }} onEditProfile={() => {}} />)
    expect(dishCount(container)).toBeGreaterThan(0)
    const names = Array.from(container.querySelectorAll('.dish-card h3')).map((el) => el.textContent ?? '')
    expect(names.some((n) => n.includes('虾'))).toBe(false)
    expect(container.textContent).toMatch(/忌口已过滤/)
  })
})
