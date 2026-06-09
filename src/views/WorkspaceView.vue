<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { tasks, membros, atualizarStatus } from '../stores/tasks.js'

const route  = useRoute()
const membro = computed(() => membros.value.find(m => m.token === route.params.token) || null)

const minhasTasks = computed(() => {
  if (!membro.value) return []
  return tasks.value.filter(t => t.alocados.includes(membro.value.id))
})

const contagem = computed(() => ({
  pendente:       minhasTasks.value.filter(t => t.status === 'pendente').length,
  'em-andamento': minhasTasks.value.filter(t => t.status === 'em-andamento').length,
  concluida:      minhasTasks.value.filter(t => t.status === 'concluida').length,
}))

const labelPrioridade = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }
const labelCategoria  = { gestao: 'Gestão', formularios: 'Formulários', ouvidoria: 'Ouvidoria' }
const labelStatus     = { pendente: 'Pendente', 'em-andamento': 'Em andamento', concluida: 'Concluída' }

function prazoFormatado(prazo) {
  const [ano, mes, dia] = prazo.split('-')
  return `${dia}/${mes}/${ano}`
}

function prazoAlerta(prazo) {
  if (!prazo) return null
  const hoje = new Date(); hoje.setHours(0,0,0,0)
  const d    = new Date(prazo + 'T00:00:00')
  const diff = (d - hoje) / 86400000
  return diff < 0 ? 'vencida' : diff <= 3 ? 'proxima' : null
}
</script>

<template>
  <!-- Link inválido -->
  <div v-if="!membro" class="ws-page ws-invalido">
    <div class="ws-brand">
      <img src="/logo_caesi.png" alt="CAESI" class="ws-logo" />
      <span class="ws-brand-nome">CAESI</span>
    </div>
    <div class="ws-invalido-box">
      <p class="ws-invalido-icon">🔒</p>
      <h2>Link inválido ou expirado</h2>
      <p>Este link de workspace não é válido. Solicite um novo link ao administrador.</p>
      <RouterLink to="/" class="btn btn-outline" style="margin-top:1rem;">Voltar ao site</RouterLink>
    </div>
  </div>

  <!-- Workspace válido -->
  <div v-else class="ws-page">
    <header class="ws-header">
      <RouterLink to="/" class="ws-brand">
        <img src="/logo_caesi.png" alt="CAESI" class="ws-logo" />
        <span class="ws-brand-nome">CAESI</span>
      </RouterLink>
      <div class="ws-usuario">
        <span class="ws-avatar">{{ membro.nome.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2) }}</span>
        <span class="ws-nome">{{ membro.nome }}</span>
      </div>
    </header>

    <main class="ws-content">
      <div class="ws-titulo-wrap">
        <h1 class="ws-titulo">Workspace de <span>{{ membro.nome.split(' ')[0] }}</span></h1>
        <p class="ws-subtitulo">Suas tasks alocadas pelo administrador.</p>
      </div>

      <!-- Stats mini -->
      <div v-if="minhasTasks.length" class="ws-stats">
        <div class="ws-stat">
          <span class="ws-stat-num">{{ minhasTasks.length }}</span>
          <span class="ws-stat-label">Total</span>
        </div>
        <div class="ws-stat pendente">
          <span class="ws-stat-num">{{ contagem.pendente }}</span>
          <span class="ws-stat-label">Pendentes</span>
        </div>
        <div class="ws-stat em-andamento">
          <span class="ws-stat-num">{{ contagem['em-andamento'] }}</span>
          <span class="ws-stat-label">Em andamento</span>
        </div>
        <div class="ws-stat concluida">
          <span class="ws-stat-num">{{ contagem.concluida }}</span>
          <span class="ws-stat-label">Concluídas</span>
        </div>
      </div>

      <!-- Tasks -->
      <div v-if="minhasTasks.length" class="ws-grid">
        <div
          v-for="t in minhasTasks"
          :key="t.id"
          class="ws-card"
          :class="'status-' + t.status"
        >
          <div class="ws-card-top">
            <span class="badge-prio" :class="t.prioridade">{{ labelPrioridade[t.prioridade] }}</span>
            <span class="badge-cat"  :class="t.categoria">{{ labelCategoria[t.categoria] }}</span>
          </div>

          <div class="ws-card-body">
            <h3 class="ws-task-titulo">{{ t.titulo }}</h3>
            <p v-if="t.descricao" class="ws-task-descricao">{{ t.descricao }}</p>
          </div>

          <div class="ws-card-meta">
            <span class="ws-prazo" :class="prazoAlerta(t.prazo) ?? ''">
              {{ prazoAlerta(t.prazo) === 'vencida' ? '⚠ Vencida' : prazoAlerta(t.prazo) === 'proxima' ? '⚡ ' : '' }}
              Prazo: {{ prazoFormatado(t.prazo) }}
            </span>
            <span class="badge-status" :class="t.status">{{ labelStatus[t.status] }}</span>
          </div>

          <div class="ws-card-acoes">
            <select
              class="ws-status-select"
              :value="t.status"
              @change="atualizarStatus(t.id, $event.target.value)"
            >
              <option value="pendente">Pendente</option>
              <option value="em-andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="ws-empty">
        <p class="ws-empty-icon">📋</p>
        <p>Nenhuma task alocada ainda.</p>
        <p class="ws-empty-hint">O administrador irá alocar tasks para você em breve.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Layout ──────────────────────────────────────────────── */
.ws-page {
  min-height: 100vh;
  background: var(--fundo, #F5F0E8);
  display: flex;
  flex-direction: column;
}

/* ── Header ──────────────────────────────────────────────── */
.ws-header {
  background: #3B2F88;
  padding: 0.85rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.ws-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.ws-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.ws-brand-nome {
  font-family: 'Archivo Black', sans-serif;
  font-size: 1.1rem;
  color: #F5F0E8;
  letter-spacing: 0.05em;
}

.ws-usuario {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.ws-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  color: #F5F0E8;
  font-size: 0.65rem;
  font-weight: 700;
  font-family: 'Archivo Black', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ws-nome {
  font-size: 0.88rem;
  font-weight: 600;
  color: rgba(245,240,232,0.9);
}

/* ── Content ─────────────────────────────────────────────── */
.ws-content {
  flex: 1;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 2rem 4rem;
}

.ws-titulo-wrap { margin-bottom: 2rem; }

.ws-titulo {
  font-family: 'Archivo Black', sans-serif;
  font-size: 1.8rem;
  color: var(--preto, #1a1a1a);
  margin: 0 0 0.4rem;
}

.ws-titulo span { color: #3B2F88; }

.ws-subtitulo {
  font-size: 0.9rem;
  color: var(--cinza, #888);
  margin: 0;
}

/* ── Stats ───────────────────────────────────────────────── */
.ws-stats {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.ws-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 20px;
  background: var(--creme, #EDE8DC);
  border: 2px solid #D8D2C4;
  border-radius: 4px;
  min-width: 80px;
}

.ws-stat-num {
  font-family: 'Archivo Black', sans-serif;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--preto, #1a1a1a);
}

.ws-stat.pendente      .ws-stat-num { color: var(--cinza, #888); }
.ws-stat.em-andamento  .ws-stat-num { color: #3B2F88; }
.ws-stat.concluida     .ws-stat-num { color: var(--verde, #4EAA77); }

.ws-stat-label {
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--cinza, #888);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Grid ────────────────────────────────────────────────── */
.ws-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

/* ── Card ────────────────────────────────────────────────── */
.ws-card {
  background: var(--creme, #EDE8DC);
  border-radius: 2px;
  padding: 1.2rem;
  border: 2px solid #D8D2C4;
  border-left-width: 4px;
  box-shadow: 3px 3px 0 #3B2F88;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: box-shadow 0.15s;
}

.ws-card:hover { box-shadow: 4px 4px 0 #3B2F88; }
.ws-card.status-concluida { opacity: 0.75; }
.ws-card.status-pendente     { border-left-color: var(--cinza, #888); }
.ws-card.status-em-andamento { border-left-color: #3B2F88; }
.ws-card.status-concluida    { border-left-color: var(--verde, #4EAA77); }

/* ── Badges ──────────────────────────────────────────────── */
.ws-card-top { display: flex; gap: 0.4rem; flex-wrap: wrap; }

.badge-prio, .badge-cat, .badge-status {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 2px;
  font-family: 'Archivo Black', sans-serif;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.badge-prio.alta   { background: rgba(217,85,85,0.15);   color: #D95555; }
.badge-prio.media  { background: rgba(245,197,66,0.2);   color: #8a6a00; }
.badge-prio.baixa  { background: rgba(78,170,119,0.15);  color: #1a6640; }

.badge-cat.gestao      { background: rgba(80,64,160,0.12);   color: #3B2F88; }
.badge-cat.formularios { background: rgba(128,112,192,0.12); color: #3B2F88; }
.badge-cat.ouvidoria   { background: rgba(200,176,120,0.25); color: #6b5200; }

.badge-status.pendente      { background: rgba(136,136,170,0.15); color: #888; }
.badge-status.em-andamento  { background: rgba(59,47,136,0.12);   color: #3B2F88; }
.badge-status.concluida     { background: rgba(78,170,119,0.15);  color: #1a6640; }

/* ── Card body ───────────────────────────────────────────── */
.ws-card-body { flex: 1; }

.ws-task-titulo {
  font-family: 'Archivo Black', sans-serif;
  font-size: 0.95rem;
  color: var(--preto, #1a1a1a);
  margin-bottom: 0.35rem;
  line-height: 1.3;
}

.ws-task-descricao {
  font-size: 0.84rem;
  color: var(--cinza, #888);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ws-card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.ws-prazo { font-size: 0.78rem; color: var(--cinza, #888); font-weight: 500; }
.ws-prazo.vencida { color: #D95555; font-weight: 700; }
.ws-prazo.proxima { color: #8a6a00; font-weight: 700; }

/* ── Ações ───────────────────────────────────────────────── */
.ws-card-acoes {
  padding-top: 0.5rem;
  border-top: 1px solid #D8D2C4;
}

.ws-status-select {
  width: 100%;
  padding: 6px 32px 6px 10px;
  font-size: 0.85rem;
  font-family: 'Archivo', sans-serif;
  color: var(--preto, #1a1a1a);
  background: #fff;
  border: 2px solid #D8D2C4;
  border-radius: 2px;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%233B2F88' stroke-width='2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.ws-status-select:focus { border-color: #3B2F88; box-shadow: 0 0 0 3px rgba(59,47,136,0.15); }

/* ── Empty ───────────────────────────────────────────────── */
.ws-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--cinza, #888);
}

.ws-empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.ws-empty p { font-size: 1rem; margin: 0 0 0.4rem; }
.ws-empty-hint { font-size: 0.85rem; opacity: 0.75; }

/* ── Inválido ────────────────────────────────────────────── */
.ws-invalido {
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 2rem;
  flex-direction: column;
}

.ws-invalido .ws-brand {
  margin-bottom: 1rem;
}

.ws-invalido-box {
  background: var(--creme, #EDE8DC);
  border: 2px solid #D8D2C4;
  border-radius: 2px;
  box-shadow: 4px 4px 0 #3B2F88;
  padding: 2.5rem 2rem;
  max-width: 420px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.ws-invalido-icon { font-size: 2.5rem; }

.ws-invalido-box h2 {
  font-family: 'Archivo Black', sans-serif;
  font-size: 1.2rem;
  color: var(--preto, #1a1a1a);
  margin: 0;
}

.ws-invalido-box p {
  font-size: 0.9rem;
  color: var(--cinza, #888);
  margin: 0;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 600px) {
  .ws-content { padding: 1.5rem 1rem 3rem; }
  .ws-titulo  { font-size: 1.4rem; }
  .ws-grid    { grid-template-columns: 1fr; }
  .ws-header  { padding: 0.75rem 1rem; }
  .ws-stats   { gap: 0.4rem; }
  .ws-stat    { min-width: 60px; padding: 8px 12px; }
  .ws-stat-num { font-size: 1.2rem; }
}
</style>
