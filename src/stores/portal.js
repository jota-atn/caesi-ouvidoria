import { ref, computed } from 'vue'

const KEY = 'caesi_portal'

const _artefatos = ref(JSON.parse(localStorage.getItem(KEY) || '[]'))

export const artefatos = computed(() => _artefatos.value)

function persist(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
  _artefatos.value = [...list]
}

function hoje() {
  return new Date().toISOString().split('T')[0]
}

export function getArtefato(id) {
  return _artefatos.value.find(a => a.id === id) ?? null
}

const CAMPOS_LABEL = { tipo: 'Tipo', descricao: 'Descrição', valor: 'Valor', anexo: 'Anexo' }

export function addArtefato({ tipo, descricao, valor = null, anexo = null }) {
  const novo = {
    id: Date.now(),
    tipo,
    descricao,
    valor,
    anexo,
    criadoEm: hoje(),
    editadoEm: null,
    historico: [{ data: hoje(), resumo: 'Artefato criado' }],
  }
  persist([..._artefatos.value, novo])
  return novo
}

export function updateArtefato(id, updates) {
  const atual = _artefatos.value.find(a => a.id === id)
  if (!atual) return

  const alterados = Object.keys(updates).filter(
    k => CAMPOS_LABEL[k] && JSON.stringify(updates[k]) !== JSON.stringify(atual[k])
  )
  const novoHistorico = alterados.length
    ? [...atual.historico, { data: hoje(), resumo: `${alterados.map(k => CAMPOS_LABEL[k]).join(', ')} alterado${alterados.length > 1 ? 's' : ''}` }]
    : atual.historico

  persist(_artefatos.value.map(a => a.id === id
    ? { ...a, ...updates, editadoEm: alterados.length ? hoje() : a.editadoEm, historico: novoHistorico }
    : a
  ))
}

export function deleteArtefato(id) {
  persist(_artefatos.value.filter(a => a.id !== id))
}
