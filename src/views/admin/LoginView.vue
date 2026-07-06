<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginComGoogle } from '../../stores/auth.js'
import googleIcon from '../../assets/icons/google.svg?raw'

const router = useRouter()
const loading = ref(false)

function entrarComGoogle() {
  loading.value = true
  setTimeout(() => {
    loginComGoogle()
    router.push('/admin/painel')
  }, 700)
}
</script>

<template>
  <div class="admin-login-page">
    <RouterLink to="/" class="admin-login-voltar">← Voltar ao site</RouterLink>
    <div class="admin-login-box">
      <div class="admin-login-logo">
        <img src="/logo_caesi.png" alt="CAESI" />
      </div>
      <h2 class="admin-login-title">Acesso restrito</h2>
      <p class="admin-login-sub">Entre com a conta Google cadastrada como administrador do CAESI.</p>

      <button type="button" class="btn-google" :disabled="loading" @click="entrarComGoogle">
        <span class="btn-google-icon" v-html="googleIcon"></span>
        {{ loading ? 'Entrando...' : 'Entrar com Google' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.admin-login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.admin-login-box {
  background: var(--creme);
  border-radius: 2px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 360px;
  box-shadow: 6px 6px 0 var(--roxo-escuro);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.admin-login-logo {
  display: flex;
  justify-content: center;
}
.admin-login-logo img {
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.admin-login-title {
  font-family: 'Archivo Black', sans-serif;
  font-weight: 400;
  font-size: 1.3rem;
  color: var(--roxo-escuro);
  text-align: center;
  margin: 0;
}

.admin-login-sub {
  font-size: 0.85rem;
  color: var(--cinza);
  text-align: center;
  margin: -0.6rem 0 0;
  line-height: 1.6;
}

.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px;
  background: var(--branco);
  border: 2px solid var(--creme-escuro);
  border-radius: 2px;
  font-family: 'Archivo Black', sans-serif;
  font-size: 0.95rem;
  color: var(--preto);
  cursor: pointer;
  transition: border-color 0.15s, opacity 0.15s;
}
.btn-google:hover:not(:disabled) { border-color: var(--roxo); }
.btn-google:disabled { opacity: 0.7; cursor: default; }
.btn-google-icon { display: flex; }
.btn-google-icon :deep(svg) { width: 18px; height: 18px; }

.admin-login-voltar {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  font-family: 'Archivo Black', sans-serif;
  font-size: 0.88rem;
  color: var(--creme);
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.15s;
}
.admin-login-voltar:hover { opacity: 1; }
</style>
