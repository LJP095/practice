// 冒烟校验：UserProfile 校验规则 + localStorage 存取往返（Node 中模拟 localStorage）。
// 真实浏览器「刷新后资料仍在」需手动验证；本脚本验证存取与校验逻辑本身。
// 注意：Phase 3 引入 vitest 后，本脚本可并入单元测试。

import { validateProfile } from '../src/domain/profile'
import { loadProfile, saveProfile } from '../src/storage/profile'
import type { UserProfile } from '../src/domain/types'

function mockLocalStorage() {
  const store = new Map<string, string>()
  globalThis.localStorage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, v)
    },
    removeItem: (k: string) => {
      store.delete(k)
    },
    clear: () => {
      store.clear()
    },
  } as Storage
}

let failures = 0
function check(name: string, ok: boolean) {
  console.log(`${ok ? '✓' : '✗'} ${name}`)
  if (!ok) failures++
}

const valid: UserProfile = {
  age: 62,
  sex: 'male',
  heightCm: 170,
  weightKg: 68,
  activity: 'light',
  limits: { sodiumMgPerMeal: 1500, carbsGPerMeal: 60 },
  avoid: ['花生', '虾'],
}

// —— 校验 ——
check('合法资料通过', validateProfile(valid))
check('缺 age 拒绝', !validateProfile({ ...valid, age: undefined }))
check('age 越界拒绝', !validateProfile({ ...valid, age: 150 }))
check('sex 非法拒绝', !validateProfile({ ...valid, sex: 'other' }))
check('activity 非法拒绝', !validateProfile({ ...valid, activity: 'heavy' }))
check('limits 负数拒绝', !validateProfile({ ...valid, limits: { sodiumMgPerMeal: -1 } }))
check('非对象拒绝', !validateProfile(null))
check('空 limits 允许', validateProfile({ ...valid, limits: {} }))

// —— 存取往返 ——
mockLocalStorage()
check('初始读取为 null', loadProfile() === null)
saveProfile(valid)
const loaded = loadProfile()
check('保存后可读回且字段一致', loaded !== null && loaded.age === 62 && loaded.avoid.length === 2 && loaded.limits?.sodiumMgPerMeal === 1500)

localStorage.setItem('wenwenchi.profile.v1', '{bad json')
check('坏 JSON 安全返回 null', loadProfile() === null)

if (failures > 0) {
  console.error(`\n${failures} 项失败`)
  process.exit(1)
}
console.log('\n全部通过')
