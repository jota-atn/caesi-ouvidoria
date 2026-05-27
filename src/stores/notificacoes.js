import { ref, computed } from 'vue'

const KEY = 'caesi_notificacoes'

function load() {
  return JSON.parse(localStorage.getItem(KEY) || '[]')
}

const _list = ref(load())

export const notificacoes = computed(() => _list.value)

function persist(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
  _list.value = [...data]
}

export function addNotificacao({ userEmail, tipo, mensagemId, mensagemProtocolo, mensagemAssunto }) {
  const all = load()
  // Evita duplicata do mesmo tipo para a mesma mensagem
  const existe = all.find(n => n.tipo === tipo && n.mensagemId === mensagemId && n.userEmail === userEmail)
  if (existe) return
  persist([...all, {
    id: Date.now(),
    userEmail,
    tipo,           // 'resposta' | 'atendida'
    mensagemId,
    mensagemProtocolo,
    mensagemAssunto,
    lida: false,
    criadaEm: new Date().toISOString(),
  }])
}

export function marcarLida(id) {
  const all = load()
  const n = all.find(n => n.id === id)
  if (n) { n.lida = true; persist(all) }
}

export function marcarTodasLidas(userEmail) {
  const all = load()
  all.forEach(n => { if (n.userEmail === userEmail) n.lida = true })
  persist(all)
}
