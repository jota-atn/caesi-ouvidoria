import { ref, computed } from 'vue'

const KEY = 'caesi_notificacoes'

const _list = ref(JSON.parse(localStorage.getItem(KEY) || '[]'))

export const notificacoes = computed(() => _list.value)

function persist(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
  _list.value = [...data]
}

export function addNotificacao({ userEmail, tipo, mensagemId, mensagemProtocolo, mensagemAssunto }) {
  const existe = _list.value.find(n => n.tipo === tipo && n.mensagemId === mensagemId && n.userEmail === userEmail)
  if (existe) return
  persist([..._list.value, {
    id: Date.now(),
    userEmail,
    tipo,
    mensagemId,
    mensagemProtocolo,
    mensagemAssunto,
    lida: false,
    criadaEm: new Date().toISOString(),
  }])
}

export function marcarLida(id) {
  persist(_list.value.map(n => n.id === id ? { ...n, lida: true } : n))
}

export function marcarTodasLidas(userEmail) {
  persist(_list.value.map(n => n.userEmail === userEmail ? { ...n, lida: true } : n))
}
