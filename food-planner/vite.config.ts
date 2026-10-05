import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 用相对路径，产物可部署到任意子路径（如 GitHub Pages 项目站 /practice/）
export default defineConfig({
  plugins: [react()],
  base: './',
})
