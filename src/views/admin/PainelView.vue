<script setup>
import { ref, computed } from 'vue'
import Navbar from '../../components/Navbar.vue'
import MsgCard from '../../components/MsgCard.vue'
import { mensagens } from '../../stores/mensagens.js'

const filtro = ref('todas')
const busca = ref('')

const mensagensFiltradas = computed(() => {
  return mensagens.value.filter(m => {
    const matchFiltro = filtro.value === 'todas' || m.status === filtro.value
    const termo = busca.value.toLowerCase()
    const matchBusca = !termo ||
      m.assunto.toLowerCase().includes(termo) ||
      m.autor.toLowerCase().includes(termo) ||
      m.categoria.toLowerCase().includes(termo)
    return matchFiltro && matchBusca
  })
})

const totalPendente = computed(() => mensagens.value.filter(m => m.status === 'pendente').length)
const totalAtendida = computed(() => mensagens.value.filter(m => m.status === 'atendida').length)
</script>

<template>
  <div class="page">
    <div class="deco-star" style="top:110px;right:2%;font-size:1.2rem;opacity:0.38;">✦</div>
    <div class="deco-star" style="bottom:25%;left:1%;font-size:1.4rem;opacity:0.28;">✦</div>

    <Navbar :admin="true" />

    <div class="page-content" style="padding-top:2rem;">
      <div class="page-heading">
        <h2>Painel de <span>Mensagens</span></h2>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-number">{{ mensagens.length }}</div>
          <div class="stat-label">Total recebidas</div>
        </div>
        <div class="stat-card" style="border-top:3px solid var(--amarelo);">
          <div class="stat-number" style="color:var(--roxo);">{{ totalPendente }}</div>
          <div class="stat-label">Pendentes</div>
        </div>
        <div class="stat-card" style="border-top:3px solid var(--verde);">
          <div class="stat-number" style="color:var(--verde);">{{ totalAtendida }}</div>
          <div class="stat-label">Atendidas</div>
        </div>
      </div>

      <div class="filter-bar">
        <input v-model="busca" type="search" placeholder="🔍  Buscar por assunto, autor ou categoria…">
        <button class="filter-btn" :class="{ active: filtro === 'todas' }"    @click="filtro = 'todas'">Todas</button>
        <button class="filter-btn" :class="{ active: filtro === 'pendente' }" @click="filtro = 'pendente'">Pendentes</button>
        <button class="filter-btn" :class="{ active: filtro === 'atendida' }" @click="filtro = 'atendida'">Atendidas</button>
      </div>

      <MsgCard
        v-for="m in mensagensFiltradas"
        :key="m.id"
        :mensagem="m"
        :to="`/admin/mensagem/${m.id}`"
      />

      <div v-if="mensagensFiltradas.length === 0" class="empty-state">
        <p>{{ mensagens.length === 0 ? 'Nenhuma mensagem recebida ainda.' : 'Nenhuma mensagem encontrada.' }}</p>
        <span v-if="mensagens.length > 0" style="font-size:0.85rem;">Tente outro filtro ou termo de busca.</span>
      </div>
    </div>
  </div>
</template>
