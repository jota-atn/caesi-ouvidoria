import { ref, computed } from 'vue'

const KEY = 'caesi_equipe'

const DEFAULT = [
  { diretoria: 'Administrativa',        presidente: '', foto: '' },
  { diretoria: 'Cultura e Lazer',        presidente: '', foto: '' },
  { diretoria: 'Assistência Estudantil', presidente: '', foto: '' },
  { diretoria: 'Financeira',             presidente: '', foto: '' },
]

function load() {
  const stored = localStorage.getItem(KEY)
  if (!stored) return DEFAULT.map(d => ({ ...d }))
  return JSON.parse(stored).map(d => ({ foto: '', ...d }))
}

const _equipe = ref(load())

export const equipe = computed(() => _equipe.value)

export function saveEquipe(novaEquipe) {
  localStorage.setItem(KEY, JSON.stringify(novaEquipe))
  _equipe.value = [...novaEquipe]
}
