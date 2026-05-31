import { ref, computed } from 'vue'

const KEY = 'caesi_notificacoes'

let _idCounter = Date.now()

const _list = ref(JSON.parse(localStorage.getItem(KEY) || '[]'))

export const notificacoes = computed(() => _list.value)

function persist(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
  _list.value = [...data]
}

export function addNotificacao(payload) {
  const {
    userEmail, tipo,
    titulo, subtitulo, link, dedupeKey,
    mensagemId, mensagemProtocolo, mensagemAssunto,
  } = payload

  const chave = dedupeKey ?? mensagemId
  if (chave) {
    const existe = _list.value.find(n =>
      n.tipo === tipo &&
      n.userEmail === userEmail &&
      (n.dedupeKey === chave || n.mensagemId === chave)
    )
    if (existe) return
  }

  persist([..._list.value, {
    id: ++_idCounter,
    userEmail,
    tipo,
    titulo:            titulo            ?? null,
    subtitulo:         subtitulo         ?? null,
    link:              link              ?? null,
    dedupeKey:         chave             ?? null,
    mensagemId:        mensagemId        ?? null,
    mensagemProtocolo: mensagemProtocolo ?? null,
    mensagemAssunto:   mensagemAssunto   ?? null,
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
