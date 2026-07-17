<script setup>
import { useRoute } from 'vue-router'
import { useEscapeKey } from '../composables/useEscapeKey.js'

defineProps({ aberta: Boolean })
const emit = defineEmits(['close'])

const route = useRoute()

function ariaCurrent(path) {
  return route.path === path || route.path.startsWith(path + '/') ? 'page' : undefined
}

function fechar() { emit('close') }

useEscapeKey(fechar)
</script>

<template>
  <div v-if="aberta" class="sidebar-backdrop" @click="fechar"></div>

  <aside class="admin-sidebar" id="admin-sidebar" :class="{ aberta }">
    <RouterLink to="/admin/painel" class="sidebar-link" :aria-current="ariaCurrent('/admin/painel')" @click="fechar">Painel</RouterLink>

    <div class="sidebar-grupo">
      <p class="sidebar-grupo-label">Atendimento</p>
      <RouterLink to="/admin/ouvidoria"   class="sidebar-link" :aria-current="ariaCurrent('/admin/ouvidoria')"   @click="fechar">Ouvidoria</RouterLink>
      <RouterLink to="/admin/formularios" class="sidebar-link" :aria-current="ariaCurrent('/admin/formularios')" @click="fechar">Formulários</RouterLink>
      <RouterLink to="/admin/tasks"       class="sidebar-link" :aria-current="ariaCurrent('/admin/tasks')"       @click="fechar">Tasks</RouterLink>
    </div>

    <div class="sidebar-grupo">
      <p class="sidebar-grupo-label">Conteúdo do site</p>
      <RouterLink to="/admin/mural"       class="sidebar-link" :aria-current="ariaCurrent('/admin/mural')"       @click="fechar">Mural</RouterLink>
      <RouterLink to="/admin/calendario"  class="sidebar-link" :aria-current="ariaCurrent('/admin/calendario')"  @click="fechar">Calendário</RouterLink>
      <RouterLink to="/admin/mapa"        class="sidebar-link" :aria-current="ariaCurrent('/admin/mapa')"        @click="fechar">Mapa</RouterLink>
      <RouterLink to="/admin/informacoes" class="sidebar-link" :aria-current="ariaCurrent('/admin/informacoes')" @click="fechar">Informações</RouterLink>
    </div>

    <div class="sidebar-grupo">
      <p class="sidebar-grupo-label">Equipe</p>
      <RouterLink to="/admin/equipe" class="sidebar-link" :aria-current="ariaCurrent('/admin/equipe')" @click="fechar">Gestão da equipe</RouterLink>
    </div>
  </aside>
</template>
