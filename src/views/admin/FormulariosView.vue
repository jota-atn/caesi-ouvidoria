<script setup>
import { ref, computed } from 'vue'
import Navbar from '../../components/Navbar.vue'
import { formularios, inscricoes } from '../../stores/formularios.js'

const filtro = ref('todos')

const TIPO_LABEL = {
  'evento-com-certificado': 'Evento c/ Certificado',
  'evento-sem-certificado': 'Evento s/ Certificado',
  venda: 'Venda',
  arrecadacao: 'Arrecadação',
}

const formulariosFiltrados = computed(() => {
  if (filtro.value === 'todos') return formularios.value
  return formularios.value.filter(f => f.status === filtro.value)
})

const totalAbertos = computed(() => formularios.value.filter(f => f.status === 'aberto').length)

const totalPendentes = computed(() =>
  inscricoes.value.filter(i => i.comprovante?.status === 'pendente').length
)

function inscricoesCount(formularioId) {
  return inscricoes.value.filter(i => i.formularioId === formularioId).length
}

function pendenteCount(formularioId) {
  return inscricoes.value.filter(
    i => i.formularioId === formularioId && i.comprovante?.status === 'pendente'
  ).length
}

function formatValor(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function formatPrazo(prazo) {
  return new Date(prazo + 'T00:00:00').toLocaleDateString('pt-BR')
}
</script>

<template>
  <div class="page">
    <div class="deco-star" style="top:110px;right:2%;font-size:1.2rem;opacity:0.38;">✦</div>
    <div class="deco-star" style="bottom:25%;left:1%;font-size:1.4rem;opacity:0.28;">✦</div>

    <Navbar :admin="true" />

    <div class="page-content">
      <div class="page-heading">
        <h2>Formulários <span>e Eventos</span></h2>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-number">{{ formularios.length }}</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat-card stat-card--verde">
          <div class="stat-number stat-number--verde">{{ totalAbertos }}</div>
          <div class="stat-label">Abertos</div>
        </div>
        <div class="stat-card stat-card--amarelo">
          <div class="stat-number stat-number--roxo">{{ totalPendentes }}</div>
          <div class="stat-label">Comp. Pendentes</div>
        </div>
      </div>

      <div class="filter-bar" role="group" aria-label="Filtrar formulários">
        <button
          class="filter-btn"
          :class="{ active: filtro === 'todos' }"
          :aria-pressed="filtro === 'todos'"
          @click="filtro = 'todos'"
        >Todos</button>
        <button
          class="filter-btn"
          :class="{ active: filtro === 'aberto' }"
          :aria-pressed="filtro === 'aberto'"
          @click="filtro = 'aberto'"
        >Abertos</button>
        <button
          class="filter-btn"
          :class="{ active: filtro === 'encerrado' }"
          :aria-pressed="filtro === 'encerrado'"
          @click="filtro = 'encerrado'"
        >Encerrados</button>
      </div>

      <RouterLink
        v-for="f in formulariosFiltrados"
        :key="f.id"
        :to="`/admin/formularios/${f.id}`"
        class="form-card"
        :class="f.status"
      >
        <div class="form-card-info">
          <div class="form-card-tags">
            <span class="tipo-tag" :class="`tipo-${f.tipo}`">{{ TIPO_LABEL[f.tipo] }}</span>
            <span class="form-status-badge" :class="`form-status-${f.status}`">{{ f.status }}</span>
            <span v-if="pendenteCount(f.id) > 0" class="comp-badge comp-pendente">
              {{ pendenteCount(f.id) }} pendente{{ pendenteCount(f.id) > 1 ? 's' : '' }}
            </span>
          </div>
          <div class="form-card-title">{{ f.titulo }}</div>
          <div class="form-card-desc">{{ f.descricao }}</div>
          <div class="form-card-meta">
            <span>{{ inscricoesCount(f.id) }} inscrição{{ inscricoesCount(f.id) !== 1 ? 'ões' : '' }}</span>
            <template v-if="f.pago">
              <span>·</span>
              <span>{{ formatValor(f.valor) }} / pessoa</span>
            </template>
            <template v-if="f.prazoInscricao">
              <span>·</span>
              <span>Prazo: {{ formatPrazo(f.prazoInscricao) }}</span>
            </template>
          </div>
        </div>
        <div class="form-card-right">
          <span class="msg-card-arrow">→</span>
        </div>
      </RouterLink>

      <div v-if="formulariosFiltrados.length === 0" class="empty-state">
        <p>{{ formularios.length === 0 ? 'Nenhum formulário criado ainda.' : 'Nenhum formulário encontrado.' }}</p>
      </div>
    </div>
  </div>
</template>
