import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { Mensagem, NovaMensagem } from './mensagens.ts'

async function storeLimpa() {
  localStorage.clear()
  vi.resetModules()
  return import('./mensagens.ts')
}

const msgBase: NovaMensagem = {
  tipo: 'Reclamação',
  periodo: '2026.1',
  corpo: 'Mensagem de teste com conteúdo suficiente.',
  nome: null,
  email: null,
}

describe('stores/mensagens', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })
  afterEach(() => { vi.useRealTimers() })

  it('começa vazia quando não há nada no localStorage', async () => {
    const { mensagens } = await storeLimpa()
    expect(mensagens.value).toEqual([])
  })

  it('addMensagem gera protocolo, status pendente e preview truncado', async () => {
    const { mensagens, addMensagem } = await storeLimpa()

    const corpoLongo = 'x'.repeat(150)
    const nova = addMensagem({ ...msgBase, corpo: corpoLongo })

    expect(nova.status).toBe('pendente')
    expect(nova.nota).toBe('')
    expect(nova.protocolo).toMatch(/^#\d{4}-\d{4}$/)
    expect(nova.preview).toBe('x'.repeat(110) + '…')
    expect(mensagens.value).toHaveLength(1)
  })

  it('addMensagem não trunca o preview quando o corpo é curto', async () => {
    const { addMensagem } = await storeLimpa()
    const nova = addMensagem(msgBase)
    expect(nova.preview).toBe(msgBase.corpo)
  })

  it('updateStatus muda só a mensagem indicada', async () => {
    const { mensagens, addMensagem, updateStatus } = await storeLimpa()
    const a = addMensagem(msgBase)
    vi.advanceTimersByTime(1)
    const b = addMensagem(msgBase)

    updateStatus(a.id, 'atendida')

    expect(mensagens.value.find((m: Mensagem) => m.id === a.id)!.status).toBe('atendida')
    expect(mensagens.value.find((m: Mensagem) => m.id === b.id)!.status).toBe('pendente')
  })

  it('updateNota atualiza a nota administrativa', async () => {
    const { mensagens, addMensagem, updateNota } = await storeLimpa()
    const nova = addMensagem(msgBase)

    updateNota(nova.id, 'Encaminhado à coordenação.')

    expect(mensagens.value.find((m: Mensagem) => m.id === nova.id)!.nota).toBe('Encaminhado à coordenação.')
  })

  it('deleteMensagem remove só a mensagem indicada', async () => {
    const { mensagens, addMensagem, deleteMensagem } = await storeLimpa()
    const a = addMensagem(msgBase)
    vi.advanceTimersByTime(1)
    const b = addMensagem(msgBase)

    deleteMensagem(a.id)

    expect(mensagens.value).toHaveLength(1)
    expect(mensagens.value[0].id).toBe(b.id)
  })

  it('addComplemento acumula complementos em ordem', async () => {
    const { mensagens, addMensagem, addComplemento } = await storeLimpa()
    const nova = addMensagem(msgBase)

    addComplemento(nova.id, 'Primeiro complemento')
    addComplemento(nova.id, 'Segundo complemento')

    const atualizada = mensagens.value.find((m: Mensagem) => m.id === nova.id)!
    expect(atualizada.complementos).toHaveLength(2)
    expect(atualizada.complementos![0].texto).toBe('Primeiro complemento')
    expect(atualizada.complementos![1].texto).toBe('Segundo complemento')
  })
})
