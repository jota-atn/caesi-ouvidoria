import { ref, computed } from 'vue'

export type StatusMensagem = 'pendente' | 'atendida'

export interface Complemento {
  texto: string
  data: string
}

export interface NovaMensagem {
  tipo: string
  periodo: string
  corpo: string
  nome: string | null
  email: string | null
}

export interface Mensagem extends NovaMensagem {
  id: number
  protocolo: string
  status: StatusMensagem
  nota: string
  data: string
  preview: string
  complementos?: Complemento[]
}

const KEY = 'caesi_mensagens'

const _list = ref<Mensagem[]>(JSON.parse(localStorage.getItem(KEY) || '[]'))

export const mensagens = computed(() => _list.value)

function persist(data: Mensagem[]) {
  localStorage.setItem(KEY, JSON.stringify(data))
  _list.value = [...data]
}

export function addMensagem(msg: NovaMensagem): Mensagem {
  const id = Date.now()
  const ano = new Date().getFullYear()
  const nova: Mensagem = {
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

export function updateStatus(id: number, status: StatusMensagem) {
  persist(_list.value.map(m => m.id === id ? { ...m, status } : m))
}

export function updateNota(id: number, nota: string) {
  persist(_list.value.map(m => m.id === id ? { ...m, nota } : m))
}

export function deleteMensagem(id: number) {
  persist(_list.value.filter(m => m.id !== id))
}

export function addComplemento(id: number, texto: string) {
  const item: Complemento = {
    texto,
    data: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
  }
  persist(_list.value.map(m => m.id === id ? { ...m, complementos: [...(m.complementos ?? []), item] } : m))
}
