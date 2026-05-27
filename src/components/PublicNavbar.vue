<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isLoggedIn, isAdmin, user, logout } from '../stores/auth.js'

const menuOpen = ref(false)
const router = useRouter()

function handleLogout() {
  logout()
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="navbar-brand">
      <div class="logo-circle">
        <img src="/logo_caesi.png" alt="CAESI" style="width:100%;height:100%;object-fit:cover;display:block;">
      </div>
      <span class="navbar-title">CAESI <span>Ouvidoria</span></span>
    </RouterLink>

    <button class="hamburger" @click="menuOpen = !menuOpen" aria-label="Menu">
      <span /><span /><span />
    </button>

    <div class="navbar-actions" :class="{ open: menuOpen }">
      <RouterLink to="/sobre" class="nav-link">Sobre</RouterLink>
      <RouterLink to="/estatuto" class="nav-link">Estatuto</RouterLink>
      <RouterLink to="/contato" class="nav-link">Contato</RouterLink>

      <template v-if="isLoggedIn">
        <RouterLink
          :to="isAdmin ? '/admin/painel' : '/aluno/mensagens'"
          class="navbar-user"
        >
          {{ user.nome }} ▾
        </RouterLink>
        <button @click="handleLogout"
          style="background:none;border:1px solid rgba(255,255,255,0.2);color:var(--creme);font-family:'Syne',sans-serif;font-weight:600;font-size:0.85rem;padding:6px 12px;border-radius:2px;cursor:pointer;">
          Sair
        </button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="btn btn-amarelo btn-sm">Fazer login</RouterLink>
      </template>
    </div>
  </nav>
</template>
