import { ref } from 'vue'

export type TipoToast = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  mensagem: string
  tipo: TipoToast
}

let _id = 0
const _list = ref<Toast[]>([])
export const toasts = _list

export function showToast(mensagem: string, tipo: TipoToast = 'success') {
  const id = ++_id
  _list.value.push({ id, mensagem, tipo })
  setTimeout(() => {
    _list.value = _list.value.filter(t => t.id !== id)
  }, 3500)
}
