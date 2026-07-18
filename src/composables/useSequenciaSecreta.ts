import { onMounted, onUnmounted } from 'vue'

const SEQUENCIA = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export function useSequenciaSecreta(onSucesso: () => void) {
  let buffer: string[] = []

  function onKeydown(e: KeyboardEvent) {
    const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key
    buffer.push(tecla)
    buffer = buffer.slice(-SEQUENCIA.length)
    if (buffer.length === SEQUENCIA.length && buffer.every((k, i) => k === SEQUENCIA[i])) {
      buffer = []
      onSucesso()
    }
  }

  onMounted(() => document.addEventListener('keydown', onKeydown))
  onUnmounted(() => document.removeEventListener('keydown', onKeydown))
}
