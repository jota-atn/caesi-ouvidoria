<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { isAdmin, logout } from '../stores/auth.js'

const menuOpen     = ref(false)
const conteudoOpen = ref(false)
const dropdownRef  = ref(null)
const route        = useRoute()
const router       = useRouter()

const CONTEUDO_ROTAS = ['/admin/mural', '/admin/calendario', '/admin/mapa', '/admin/informacoes']
const conteudoAtivo = computed(() => CONTEUDO_ROTAS.some(p => route.path.startsWith(p)))

function handleLogout() {
  fecharTudo()
  logout()
  router.push('/')
}

function ariaCurrent(path) {
  return route.path === path || route.path.startsWith(path + '/') ? 'page' : undefined
}

function fecharTudo() {
  menuOpen.value = false
  conteudoOpen.value = false
}

function onClickFora(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    conteudoOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickFora))
onUnmounted(() => document.removeEventListener('click', onClickFora))
</script>

<template>
  <nav class="navbar" :style="isAdmin ? 'background:#3B2F88' : ''">
    <RouterLink to="/" class="navbar-brand">
      <div class="logo-circle">
        <img src="/logo_caesi.png" alt="CAESI" class="logo-img">
      </div>
      <span class="navbar-title">
        CAESI <span v-if="isAdmin">Admin</span>
      </span>
    </RouterLink>

    <button class="hamburger" @click="menuOpen = !menuOpen"
      aria-label="Menu" :aria-expanded="menuOpen" aria-controls="navbar-menu">
      <span /><span /><span />
    </button>

    <div class="navbar-actions" id="navbar-menu" :class="{ open: menuOpen }">

      <!-- Admin -->
      <template v-if="isAdmin">
        <RouterLink to="/admin/painel"      class="nav-link" :aria-current="ariaCurrent('/admin/painel')"      @click="fecharTudo">Painel</RouterLink>
        <RouterLink to="/admin/mensagens"   class="nav-link" :aria-current="ariaCurrent('/admin/mensagens')"   @click="fecharTudo">Mensagens</RouterLink>
        <RouterLink to="/admin/formularios" class="nav-link" :aria-current="ariaCurrent('/admin/formularios')" @click="fecharTudo">Formulários</RouterLink>
        <RouterLink to="/admin/tasks"       class="nav-link" :aria-current="ariaCurrent('/admin/tasks')"       @click="fecharTudo">Tasks</RouterLink>
        <RouterLink to="/admin/equipe"      class="nav-link" :aria-current="ariaCurrent('/admin/equipe')"      @click="fecharTudo">Equipe</RouterLink>

        <div class="nav-dropdown" :class="{ open: conteudoOpen }" ref="dropdownRef">
          <button type="button" class="nav-link nav-dropdown-trigger" :class="{ 'router-link-active': conteudoAtivo }" @click="conteudoOpen = !conteudoOpen">
            Conteúdo
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
          <div class="nav-dropdown-menu">
            <RouterLink to="/admin/mural"       class="nav-dropdown-item" :aria-current="ariaCurrent('/admin/mural')"       @click="fecharTudo">Mural</RouterLink>
            <RouterLink to="/admin/calendario"  class="nav-dropdown-item" :aria-current="ariaCurrent('/admin/calendario')"  @click="fecharTudo">Calendário</RouterLink>
            <RouterLink to="/admin/mapa"        class="nav-dropdown-item" :aria-current="ariaCurrent('/admin/mapa')"        @click="fecharTudo">Mapa</RouterLink>
            <RouterLink to="/admin/informacoes" class="nav-dropdown-item" :aria-current="ariaCurrent('/admin/informacoes')" @click="fecharTudo">Informações</RouterLink>
          </div>
        </div>

        <RouterLink to="/sobre" class="nav-link" :aria-current="ariaCurrent('/sobre')" @click="fecharTudo">Sobre</RouterLink>
        <span class="nav-separator" />
        <button class="nav-link nav-link-btn" @click="handleLogout">Sair</button>
      </template>

      <!-- Público -->
      <template v-else>
        <RouterLink to="/sobre"       class="nav-link" :aria-current="ariaCurrent('/sobre')"       @click="menuOpen = false">Sobre</RouterLink>
        <RouterLink to="/mural"       class="nav-link" :aria-current="ariaCurrent('/mural')"       @click="menuOpen = false">Mural</RouterLink>
        <RouterLink to="/informacoes" class="nav-link" :aria-current="ariaCurrent('/informacoes')" @click="menuOpen = false">Informações</RouterLink>
        <RouterLink to="/formularios" class="nav-link" :aria-current="ariaCurrent('/formularios')" @click="menuOpen = false">Formulários</RouterLink>
      </template>

    </div>
  </nav>
</template>
