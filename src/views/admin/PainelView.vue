<script setup>
import { ref, computed } from 'vue'
import Navbar from '../../components/Navbar.vue'
import MsgCard from '../../components/MsgCard.vue'
import { mensagens } from '../../stores/mensagens.js'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

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

const CATEGORIA_LABEL = {
  matricula: 'Matrícula',
  infra:     'Infraestrutura',
  docente:   'Corpo Docente',
  estagio:   'Estágios',
  eventos:   'Eventos',
  sugestao:  'Sugestão',
  outro:     'Outro',
}

const CATEGORIA_COR = {
  matricula: '#6B4FBB',
  infra:     '#4E9ED8',
  docente:   '#E8874A',
  estagio:   '#4EAA77',
  eventos:   '#D95595',
  sugestao:  '#F0C040',
  outro:     '#A0A0A0',
}

const donutData = computed(() => {
  const contagem = {}
  for (const m of mensagens.value) {
    contagem[m.categoria] = (contagem[m.categoria] ?? 0) + 1
  }
  const cats = Object.keys(contagem)
  return {
    labels: cats.map(c => CATEGORIA_LABEL[c] ?? c),
    datasets: [{
      data: cats.map(c => contagem[c]),
      backgroundColor: cats.map(c => CATEGORIA_COR[c] ?? '#A0A0A0'),
      borderWidth: 2,
      borderColor: '#FEFAF4',
    }],
  }
})

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right', labels: { font: { family: 'Inter', size: 12 }, padding: 16 } },
  },
}

const barData = computed(() => {
  const meses = {}
  const agora = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1)
    const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    meses[chave] = 0
  }
  for (const m of mensagens.value) {
    const d = new Date(m.id)
    const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (chave in meses) meses[chave]++
  }
  const labels = Object.keys(meses).map(k => {
    const [ano, mes] = k.split('-')
    return new Date(Number(ano), Number(mes) - 1).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
  })
  return {
    labels,
    datasets: [{
      label: 'Mensagens',
      data: Object.values(meses),
      backgroundColor: 'rgba(107,79,187,0.75)',
      borderRadius: 4,
    }],
  }
})

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1, font: { family: 'Inter' } }, grid: { color: 'rgba(0,0,0,0.06)' } },
    x: { ticks: { font: { family: 'Inter' } }, grid: { display: false } },
  },
}
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

      <div v-if="mensagens.length > 0" style="display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;margin-bottom:1.5rem;">
        <div class="paper" style="padding:1.2rem;">
          <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:0.75rem;color:var(--roxo-escuro);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:1rem;">
            Por categoria
          </div>
          <div style="height:200px;">
            <Doughnut :data="donutData" :options="donutOptions" />
          </div>
        </div>
        <div class="paper" style="padding:1.2rem;">
          <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:0.75rem;color:var(--roxo-escuro);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:1rem;">
            Mensagens por mês
          </div>
          <div style="height:200px;">
            <Bar :data="barData" :options="barOptions" />
          </div>
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
