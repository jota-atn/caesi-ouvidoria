import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    // Node 20.12+ tem um localStorage experimental próprio que, se ficar
    // ativo, sobrepõe o do jsdom e quebra qualquer store que use
    // localStorage (todas usam). Desligado aqui pra rodar em qualquer
    // máquina sem precisar setar NODE_OPTIONS manualmente.
    execArgv: ['--no-experimental-webstorage'],
  },
})
