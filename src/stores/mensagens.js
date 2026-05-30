import { ref, computed } from 'vue'
import { addNotificacao } from './notificacoes.js'

const KEY = 'caesi_mensagens'

const _list = ref(JSON.parse(localStorage.getItem(KEY) || '[]'))

export const mensagens = computed(() => _list.value)

function persist(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
  _list.value = [...data]
}

export function addMensagem(msg) {
  const id = Date.now()
  const ano = new Date().getFullYear()
  const nova = {
    ...msg,
    id,
    protocolo: `#${ano}-${String(id).slice(-4)}`,
    status: 'pendente',
    nota: '',
    data: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
    preview: msg.corpo.slice(0, 110) + (msg.corpo.length > 110 ? '…' : ''),
  }
  persist([..._list.value, nova])
  return nova
}

export function updateStatus(id, status) {
  const m = _list.value.find(m => m.id === id)
  if (!m) return
  persist(_list.value.map(msg => msg.id === id ? { ...msg, status } : msg))
  if (status === 'atendida' && m.email) {
    addNotificacao({
      userEmail: m.email,
      tipo: 'atendida',
      mensagemId: m.id,
      mensagemProtocolo: m.protocolo,
      mensagemAssunto: m.assunto,
    })
  }
}

export function updateNota(id, nota) {
  persist(_list.value.map(m => m.id === id ? { ...m, nota } : m))
}

export function updateResposta(id, resposta) {
  const m = _list.value.find(m => m.id === id)
  if (!m) return
  persist(_list.value.map(msg => msg.id === id ? { ...msg, resposta } : msg))
  if (resposta.trim() && m.email) {
    addNotificacao({
      userEmail: m.email,
      tipo: 'resposta',
      mensagemId: m.id,
      mensagemProtocolo: m.protocolo,
      mensagemAssunto: m.assunto,
    })
  }
}

export function deleteMensagem(id) {
  persist(_list.value.filter(m => m.id !== id))
}

export function marcarRespostaVista(id) {
  persist(_list.value.map(m => m.id === id ? { ...m, respostaVista: true } : m))
}
