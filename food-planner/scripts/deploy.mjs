// 一键部署：把构建产物 dist/ 推送到 GitHub Pages 的 gh-pages 分支。
// 用法：npm run deploy（会先执行 npm run build）。
// 说明：采用「浅克隆 gh-pages + 清空重建 + 追加提交」的方式，全程不用 git push --force
//（符合 AGENTS.md 禁令）。gh-pages 分支历史会随部署追加，但工作树始终等于最新 dist。
// 前提：本机 git 已通过 SSH 认证；gh-pages 分支已存在（首次已手动创建）。
import { execSync } from 'node:child_process'
import { cpSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repoRoot = resolve(projectRoot, '..')
const distDir = join(projectRoot, 'dist')

function run(cmd, cwd) {
  execSync(cmd, { cwd, stdio: 'inherit' })
}
function capture(cmd, cwd) {
  return execSync(cmd, { cwd, encoding: 'utf8' }).trim()
}

const remote = capture('git remote get-url origin', repoRoot)
const name = capture('git config user.name', repoRoot)
const email = capture('git config user.email', repoRoot)

if (!name || !email) {
  console.error('未配置 git 身份（user.name / user.email），请先配置后再部署。')
  process.exit(1)
}

const tmp = mkdtempSync(join(tmpdir(), 'wenwenchi-deploy-'))
try {
  run(`git clone --depth 1 --branch gh-pages "${remote}" "${tmp}"`, repoRoot)
  run('git rm -rf --ignore-unmatch .', tmp)

  // 把 dist 内容（index.html + assets/）铺到 gh-pages 根目录
  for (const entry of readdirSync(distDir)) {
    cpSync(join(distDir, entry), join(tmp, entry), { recursive: true })
  }
  writeFileSync(join(tmp, '.nojekyll'), '') // 禁用 Jekyll，静态资源原样下发

  run('git add -A', tmp)
  const dirty = capture('git status --porcelain', tmp)
  if (!dirty) {
    console.log('ℹ️  dist 无变化，跳过部署。')
  } else {
    run(
      `git -c user.name="${name}" -c user.email="${email}" commit -m "deploy ${new Date().toISOString()}"`,
      tmp,
    )
    run('git push', tmp)
    console.log('✅ 已部署到 gh-pages 分支（GitHub Pages 会自动更新）。')
  }
} catch (err) {
  console.error('❌ 部署失败：', err.message)
  process.exitCode = 1
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
