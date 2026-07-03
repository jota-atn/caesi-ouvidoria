<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import Navbar from '../../components/Navbar.vue'
import { estruturas, addEstrutura, updateEstrutura, removeEstrutura, CENTRO_PADRAO } from '../../stores/mapa.js'
import { showToast } from '../../stores/toast.js'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const mapEl = ref(null)
let map = null
const markers = new Map()

const selecionadoId = ref(null)
const pendingPoint   = ref(null) // { lat, lng } de um clique em área vazia

const formNovo = ref({ nome: '', descricao: '' })
const formEdit = ref({ nome: '', descricao: '' })

const selecionado = computed(() => estruturas.value.find(e => e.id === selecionadoId.value) ?? null)

function arredonda(n) { return Math.round(n * 1e6) / 1e6 }

function selecionarMarcador(e) {
  pendingPoint.value = null
  selecionadoId.value = e.id
  formEdit.value = { nome: e.nome, descricao: e.descricao ?? '' }
}

function selecionarNaLista(id) {
  const e = estruturas.value.find(x => x.id === id)
  if (e) {
    selecionarMarcador(e)
    map?.flyTo([e.lat, e.lng], 18, { duration: 0.6 })
    markers.get(id)?.openPopup()
  }
}

function cancelarSelecao() {
  selecionadoId.value = null
  pendingPoint.value = null
}

function salvarNova() {
  if (!formNovo.value.nome.trim() || !pendingPoint.value) return
  addEstrutura({
    nome: formNovo.value.nome.trim(),
    descricao: formNovo.value.descricao.trim(),
    lat: pendingPoint.value.lat,
    lng: pendingPoint.value.lng,
  })
  formNovo.value = { nome: '', descricao: '' }
  pendingPoint.value = null
  showToast('Estrutura adicionada ao mapa.', 'success')
}

function salvarEdicao() {
  if (!selecionado.value || !formEdit.value.nome.trim()) return
  updateEstrutura(selecionado.value.id, {
    nome: formEdit.value.nome.trim(),
    descricao: formEdit.value.descricao.trim(),
  })
  showToast('Estrutura atualizada.', 'success')
}

function excluir() {
  if (!selecionado.value) return
  if (confirm(`Remover "${selecionado.value.nome}" do mapa?`)) {
    removeEstrutura(selecionado.value.id)
    cancelarSelecao()
    showToast('Estrutura removida.', 'info')
  }
}

function renderMarkers() {
  if (!map) return
  markers.forEach(m => m.remove())
  markers.clear()
  for (const e of estruturas.value) {
    const marker = L.marker([e.lat, e.lng], { draggable: true }).addTo(map)
    marker.bindPopup(`<strong>${e.nome}</strong>`)
    marker.on('click', () => selecionarMarcador(e))
    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng()
      updateEstrutura(e.id, { lat: arredonda(lat), lng: arredonda(lng) })
      showToast('Posição atualizada.', 'success')
    })
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

  map.on('click', (ev) => {
    selecionadoId.value = null
    pendingPoint.value = { lat: arredonda(ev.latlng.lat), lng: arredonda(ev.latlng.lng) }
    formNovo.value = { nome: '', descricao: '' }
  })
})

watch(estruturas, () => renderMarkers())

onBeforeUnmount(() => { map?.remove() })
</script>

<template>
  <div class="page">
    <div class="deco-star" style="top:110px;right:2%;font-size:1.2rem;opacity:0.4;">✦</div>

    <Navbar />

    <div class="page-content">
      <div class="page-heading">
        <h2>Gestão do <span>Mapa</span></h2>
      </div>

      <p style="font-size:0.85rem;color:var(--cinza);margin-bottom:1rem;line-height:1.6;">
        Clique num ponto vazio do mapa pra adicionar uma estrutura. Arraste um pin existente pra reposicionar.
      </p>

      <div class="mapa-layout">
        <div class="paper mapa-map-paper">
          <div ref="mapEl" class="mapa-leaflet"></div>
        </div>

        <div class="paper mapa-painel">
          <!-- Nova estrutura -->
          <div v-if="pendingPoint" class="mapa-form">
            <p class="label-sm" style="margin-bottom:0.8rem;">Nova estrutura</p>
            <div class="field">
              <label>Nome *</label>
              <input v-model="formNovo.nome" type="text" maxlength="80" placeholder="Ex.: Bloco CP">
            </div>
            <div class="field">
              <label>Descrição <span class="field-hint">(opcional)</span></label>
              <textarea v-model="formNovo.descricao" rows="3" placeholder="O que tem aqui…"></textarea>
            </div>
            <div class="btn-row">
              <button class="btn btn-primary btn-sm" @click="salvarNova">Salvar →</button>
              <button class="btn btn-outline btn-sm" @click="cancelarSelecao">Cancelar</button>
            </div>
          </div>

          <!-- Editar estrutura selecionada -->
          <div v-else-if="selecionado" class="mapa-form">
            <p class="label-sm" style="margin-bottom:0.8rem;">Editar estrutura</p>
            <div class="field">
              <label>Nome *</label>
              <input v-model="formEdit.nome" type="text" maxlength="80">
            </div>
            <div class="field">
              <label>Descrição</label>
              <textarea v-model="formEdit.descricao" rows="3"></textarea>
            </div>
            <div class="btn-row">
              <button class="btn btn-primary btn-sm" @click="salvarEdicao">Salvar →</button>
              <button class="btn btn-outline btn-sm" @click="cancelarSelecao">Fechar</button>
              <button class="btn btn-danger btn-sm" @click="excluir">Excluir</button>
            </div>
          </div>

          <div v-else class="empty-state" style="padding:1.6rem 1rem;">
            <p>Nenhuma estrutura selecionada.</p>
            <span>Clique no mapa pra adicionar, ou num pin pra editar.</span>
          </div>

          <hr class="divider" style="margin:1.2rem 0;">

          <p class="label-sm" style="margin-bottom:0.6rem;">Estruturas ({{ estruturas.length }})</p>
          <div class="mapa-lista">
            <button
              v-for="e in estruturas" :key="e.id"
              class="mapa-item"
              :class="{ 'mapa-item--ativo': e.id === selecionadoId }"
              @click="selecionarNaLista(e.id)"
            >{{ e.nome }}</button>
          </div>
          <div v-if="estruturas.length === 0" style="font-size:0.82rem;color:var(--cinza);">
            Nenhuma estrutura cadastrada ainda.
          </div>
        </div>
      </div>
    </div>
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
.mapa-leaflet { width: 100%; height: 560px; cursor: crosshair; }

.mapa-form .field:last-of-type { margin-bottom: 0.8rem; }

.mapa-lista {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 260px;
  overflow-y: auto;
}

.mapa-item {
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mapa-item:hover { background: var(--creme); }
.mapa-item--ativo { background: rgba(80,64,160,0.1); border-color: var(--roxo); }

.empty-state {
  background: var(--creme);
  border: 2px solid var(--creme-escuro);
  border-radius: 2px;
  text-align: center;
}
.empty-state p { font-size: 0.9rem; font-weight: 600; color: var(--preto); margin-bottom: 0.3rem; }
.empty-state span { font-size: 0.8rem; color: var(--cinza); }
</style>
