<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import Navbar from '../components/Navbar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import mapPinIcon from '../assets/icons/map-pin.svg?raw'
import { estruturas, CENTRO_PADRAO } from '../stores/mapa.js'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const mapEl = ref(null)
let map = null
const markers = new Map()

const busca = ref('')
const selecionadoId = ref(null)

const listaFiltrada = computed(() => {
  const t = busca.value.toLowerCase().trim()
  if (!t) return estruturas.value
  return estruturas.value.filter(e => e.nome.toLowerCase().includes(t))
})

const selecionado = computed(() => estruturas.value.find(e => e.id === selecionadoId.value) ?? null)

function rotaUrl(e) {
  return `https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}`
}

function selecionar(id) {
  selecionadoId.value = id
  const e = estruturas.value.find(x => x.id === id)
  if (e && map) {
    map.flyTo([e.lat, e.lng], 18, { duration: 0.6 })
    markers.get(id)?.openPopup()
  }
}

function renderMarkers() {
  if (!map) return
  markers.forEach(m => m.remove())
  markers.clear()
  for (const e of estruturas.value) {
    const marker = L.marker([e.lat, e.lng]).addTo(map)
    marker.bindPopup(`<strong>${e.nome}</strong>`)
    marker.on('click', () => { selecionadoId.value = e.id })
    markers.set(e.id, marker)
  }
}

onMounted(() => {
  map = L.map(mapEl.value).setView([CENTRO_PADRAO.lat, CENTRO_PADRAO.lng], 17)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)
  renderMarkers()
})

watch(estruturas, () => renderMarkers())

onBeforeUnmount(() => { map?.remove() })
</script>

<template>
  <div class="page">
    <div class="deco-star" style="top:160px;right:2%;font-size:1.3rem;opacity:0.3;">✦</div>

    <Navbar />

    <div class="page-content">
      <div class="page-heading">
        <h2>Mapa do <span>CAESI</span></h2>
      </div>

      <div class="mapa-layout">
        <div class="paper mapa-map-paper">
          <div ref="mapEl" class="mapa-leaflet"></div>
        </div>

        <div class="paper mapa-painel">
          <input v-model="busca" type="search" class="mural-search" placeholder="Buscar estrutura…">

          <div v-if="listaFiltrada.length === 0" class="empty-state" style="padding:2rem 1rem;margin-top:1rem;">
            <p>{{ estruturas.length === 0 ? 'Nenhuma estrutura cadastrada ainda.' : 'Nenhuma estrutura encontrada.' }}</p>
          </div>

          <div class="mapa-lista">
            <button
              v-for="e in listaFiltrada" :key="e.id"
              class="mapa-item"
              :class="{ 'mapa-item--ativo': e.id === selecionadoId }"
              @click="selecionar(e.id)"
            >
              <span v-html="mapPinIcon" class="mapa-item-icon"></span>
              <span class="mapa-item-nome">{{ e.nome }}</span>
            </button>
          </div>

          <div v-if="selecionado" class="mapa-detalhe">
            <div class="mapa-detalhe-nome">{{ selecionado.nome }}</div>
            <p v-if="selecionado.descricao" class="mapa-detalhe-desc">{{ selecionado.descricao }}</p>
            <a :href="rotaUrl(selecionado)" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              Ver rota →
            </a>
          </div>
        </div>
      </div>
    </div>

    <SiteFooter />
  </div>
</template>

<style scoped>
.mapa-layout {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 1.2rem;
  align-items: start;
}
@media (max-width: 860px) {
  .mapa-layout { grid-template-columns: 1fr; }
}

.mapa-map-paper { padding: 0; overflow: hidden; }
.mapa-leaflet { width: 100%; height: 560px; }

.mural-search {
  width: 100%;
  padding: 9px 14px;
  background: var(--branco);
  border: 2px solid var(--creme-escuro);
  border-radius: 2px;
  font-family: 'Archivo', sans-serif;
  font-size: 0.92rem;
  color: var(--preto);
  outline: none;
  transition: border-color 0.2s;
}
.mural-search:focus { border-color: var(--roxo); }

.mapa-lista {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 1rem;
  max-height: 340px;
  overflow-y: auto;
}

.mapa-item {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  padding: 8px 10px;
  border: 1.5px solid transparent;
  border-radius: 2px;
  background: none;
  cursor: pointer;
  font-family: 'Archivo', sans-serif;
  font-size: 0.88rem;
  color: var(--preto);
  transition: background 0.15s, border-color 0.15s;
}
.mapa-item:hover { background: var(--creme); }
.mapa-item--ativo { background: rgba(80,64,160,0.1); border-color: var(--roxo); }

.mapa-item-icon { display: flex; align-items: center; flex-shrink: 0; color: var(--roxo-escuro); }
.mapa-item-icon :deep(svg) { width: 15px; height: 15px; }

.mapa-item-nome { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.mapa-detalhe {
  border-top: 1.5px solid var(--creme-escuro);
  margin-top: 1rem;
  padding-top: 1rem;
}
.mapa-detalhe-nome {
  font-family: 'Archivo Black', sans-serif;
  font-weight: 700;
  font-size: 0.98rem;
  color: var(--roxo-escuro);
  margin-bottom: 6px;
}
.mapa-detalhe-desc {
  font-size: 0.85rem;
  color: var(--preto);
  opacity: 0.75;
  line-height: 1.55;
  margin-bottom: 0.8rem;
}

.empty-state {
  background: var(--creme);
  border: 2px solid var(--creme-escuro);
  border-radius: 2px;
  text-align: center;
}
.empty-state p { font-size: 0.9rem; color: var(--cinza); }
</style>
