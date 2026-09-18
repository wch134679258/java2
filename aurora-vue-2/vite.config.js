import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 使用相对路径 base，方便直接以 file:// 或任意子路径部署
export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    host: true,
    port: 5173
  }
})
