<script setup>
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { eventos } from '../stores/calendario.js'
import calendarIcon from '../assets/icons/calendar.svg?raw'

const MESES_ABREV = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const MESES_EXT   = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function parseData(data) {
  const [ano, mes, dia] = data.split('-').map(Number)
  return { ano, mes, dia }
}

function formatDataExt(data) {
  const { ano, mes, dia } = parseData(data)
  return `${dia} de ${MESES_EXT[mes - 1]} de ${ano}`
}

const hoje = new Date().toISOString().split('T')[0]

const proximos = computed(() =>
  eventos.value.filter(e => e.data >= hoje).sort((a, b) => a.data.localeCompare(b.data))
)
const passados = computed(() =>
  eventos.value.filter(e => e.data < hoje).sort((a, b) => b.data.localeCompare(a.data))
)

const expandidoId   = ref(null)
const mostrarPassados = ref(false)

function toggleExpandir(id) {
  expandidoId.value = expandidoId.value === id ? null : id
}

function baixarIcs(evento) {
  const { ano, mes, dia } = parseData(evento.data)
  const dtstart = `${String(ano).padStart(4, '0')}${String(mes).padStart(2, '0')}${String(dia).padStart(2, '0')}`
  const uid = `evento-${evento.id}@caesi.ufcg`
  const esc = s => String(s ?? '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CAESI UFCG//Calendario//PT-BR',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstart}T000000Z`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `SUMMARY:${esc(evento.nome)}`,
    `DESCRIPTION:${esc(evento.descricao)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${evento.nome.toLowerCase().replace(/\s+/g, '-')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="page">
    <div class="deco-star" style="top:160px;right:2%;font-size:1.3rem;opacity:0.3;">✦</div>
    <div class="deco-star" style="top:500px;left:1.5%;font-size:1rem;opacity:0.22;">✦</div>

    <Navbar />

    <div class="page-content">
      <div class="page-heading">
        <h2>Calendário do <span>CAESI</span></h2>
      </div>

      <!-- Próximos eventos -->
      <div v-if="proximos.length === 0" class="empty-state">
        <p>Nenhum evento agendado no momento.</p>
        <span>Fique de olho — novidades aparecem por aqui.</span>
      </div>

      <div v-else class="evento-lista">
        <div v-for="e in proximos" :key="e.id" class="evento-card" @click="toggleExpandir(e.id)">
          <div class="evento-data-badge">
            <span class="evento-dia">{{ parseData(e.data).dia }}</span>
            <span class="evento-mes">{{ MESES_ABREV[parseData(e.data).mes - 1] }}</span>
          </div>
          <div class="evento-corpo">
            <div class="evento-nome">{{ e.nome }}</div>
            <p v-if="expandidoId === e.id && e.descricao" class="evento-desc">{{ e.descricao }}</p>
            <div v-if="expandidoId === e.id" class="evento-acoes" @click.stop>
              <button class="btn btn-outline btn-sm" @click="baixarIcs(e)">
                <span class="btn-icon" v-html="calendarIcon"></span> Adicionar ao meu calendário
              </button>
              <RouterLink v-if="e.formularioId" :to="`/formularios/${e.formularioId}`" class="btn btn-outline btn-sm">
                Ver formulário →
              </RouterLink>
            </div>
          </div>
          <span class="evento-toggle">{{ expandidoId === e.id ? '−' : '+' }}</span>
        </div>
      </div>

      <!-- Eventos passados -->
      <div v-if="passados.length > 0" class="evento-passados-toggle">
        <button class="btn btn-outline btn-sm" @click="mostrarPassados = !mostrarPassados">
          {{ mostrarPassados ? '— Ocultar eventos passados' : `+ Ver eventos passados (${passados.length})` }}
        </button>
      </div>

      <div v-if="mostrarPassados" class="evento-lista evento-lista--passados">
        <div v-for="e in passados" :key="e.id" class="evento-card evento-card--passado" @click="toggleExpandir(e.id)">
          <div class="evento-data-badge">
            <span class="evento-dia">{{ parseData(e.data).dia }}</span>
            <span class="evento-mes">{{ MESES_ABREV[parseData(e.data).mes - 1] }}</span>
          </div>
          <div class="evento-corpo">
            <div class="evento-nome">{{ e.nome }}</div>
            <p v-if="expandidoId === e.id && e.descricao" class="evento-desc">{{ e.descricao }}</p>
            <p v-if="expandidoId === e.id" class="evento-desc-data">{{ formatDataExt(e.data) }}</p>
          </div>
          <span class="evento-toggle">{{ expandidoId === e.id ? '−' : '+' }}</span>
        </div>
      </div>
    </div>

    <SiteFooter />
  </div>
</template>

<style scoped>
.evento-lista {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1rem;
}

.evento-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: var(--creme);
  border: 1.5px solid var(--creme-escuro);
  border-left: 4px solid var(--roxo);
  border-radius: 2px;
  box-shadow: 3px 3px 0 var(--roxo-escuro);
  padding: 0.9rem 1.1rem;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.evento-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--roxo-escuro);
}

.evento-card--passado {
  border-left-color: var(--cinza);
  opacity: 0.75;
}

.evento-data-badge {
  flex-shrink: 0;
  width: 54px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--roxo-escuro);
  color: var(--creme);
  border-radius: 2px;
  padding: 6px 0;
}
.evento-dia {
  font-family: 'Archivo Black', sans-serif;
  font-size: 1.3rem;
  line-height: 1;
}
.evento-mes {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 2px;
}

.evento-corpo { flex: 1; min-width: 0; }

.evento-nome {
  font-family: 'Archivo Black', sans-serif;
  font-weight: 700;
  font-size: 0.98rem;
  color: var(--preto);
}

.evento-desc {
  font-size: 0.85rem;
  color: var(--preto);
  opacity: 0.75;
  line-height: 1.55;
  margin-top: 0.5rem;
  white-space: pre-wrap;
}

.evento-desc-data {
  font-size: 0.8rem;
  color: var(--cinza);
  margin-top: 0.4rem;
}

.evento-acoes {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 0.8rem;
}

.btn-icon {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 4px;
}
.btn-icon :deep(svg) { width: 14px; height: 14px; stroke: currentColor; }

.evento-toggle {
  flex-shrink: 0;
  font-family: 'Archivo Black', sans-serif;
  font-size: 1.1rem;
  color: var(--roxo-escuro);
  line-height: 1;
}

.evento-passados-toggle {
  margin: 1.2rem 0 0.8rem;
}

.empty-state {
  background: var(--creme);
  border: 2px solid var(--creme-escuro);
  border-radius: 2px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 5px 5px 0 var(--roxo-escuro);
  margin-bottom: 1.4rem;
}
.empty-state p { font-size: 1rem; font-weight: 600; color: var(--preto); margin-bottom: 0.4rem; }
.empty-state span { font-size: 0.85rem; color: var(--cinza); }
</style>
