import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { Evento } from './calendario.ts'

async function storeLimpa() {
  localStorage.clear()
  vi.resetModules()
  return import('./calendario.ts')
}

describe('stores/calendario', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-15T12:00:00'))
  })
  afterEach(() => { vi.useRealTimers() })

  it('começa vazia quando não há nada no localStorage', async () => {
    const { eventos } = await storeLimpa()
    expect(eventos.value).toEqual([])
  })

  it('addEvento aplica defaults de descricao e formularioId', async () => {
    const { eventos, addEvento } = await storeLimpa()
    const novo = addEvento({ nome: 'Prova', data: '2026-07-01' })

    expect(novo.descricao).toBe('')
    expect(novo.formularioId).toBeNull()
    expect(eventos.value).toHaveLength(1)
  })

  it('getEvento encontra pelo id, ou retorna null se não existir', async () => {
    const { addEvento, getEvento } = await storeLimpa()
    const novo = addEvento({ nome: 'Prova', data: '2026-07-01' })
    expect(getEvento(novo.id)?.nome).toBe('Prova')
    expect(getEvento(999999)).toBeNull()
  })

  it('proximosEventos inclui hoje e o futuro, exclui o passado, ordenado por data', async () => {
    const { proximosEventos, addEvento } = await storeLimpa()

    addEvento({ nome: 'Passado', data: '2026-06-01' })
    vi.advanceTimersByTime(1)
    addEvento({ nome: 'Hoje', data: '2026-06-15' })
    vi.advanceTimersByTime(1)
    addEvento({ nome: 'Futuro distante', data: '2026-08-01' })
    vi.advanceTimersByTime(1)
    addEvento({ nome: 'Futuro próximo', data: '2026-07-01' })

    expect(proximosEventos.value.map((e: Evento) => e.nome)).toEqual([
      'Hoje', 'Futuro próximo', 'Futuro distante',
    ])
  })

  it('updateEvento e removeEvento afetam só o evento indicado', async () => {
    const { eventos, addEvento, updateEvento, removeEvento } = await storeLimpa()
    const a = addEvento({ nome: 'A', data: '2026-07-01' })
    vi.advanceTimersByTime(1)
    const b = addEvento({ nome: 'B', data: '2026-07-02' })

    updateEvento(a.id, { nome: 'A editado' })
    expect(eventos.value.find((e: Evento) => e.id === a.id)!.nome).toBe('A editado')
    expect(eventos.value.find((e: Evento) => e.id === b.id)!.nome).toBe('B')

    removeEvento(a.id)
    expect(eventos.value).toHaveLength(1)
    expect(eventos.value[0].id).toBe(b.id)
  })

  describe('upsertEventoFormulario', () => {
    it('cria um evento novo vinculado ao formulário quando não existe um ainda', async () => {
      const { eventos, upsertEventoFormulario } = await storeLimpa()

      upsertEventoFormulario(42, { nome: 'Evento do Form', data: '2026-07-10', descricao: 'Desc' })

      expect(eventos.value).toHaveLength(1)
      expect(eventos.value[0].formularioId).toBe(42)
    })

    it('atualiza o evento existente do formulário em vez de duplicar', async () => {
      const { eventos, upsertEventoFormulario } = await storeLimpa()

      upsertEventoFormulario(42, { nome: 'Nome 1', data: '2026-07-10', descricao: 'Desc 1' })
      upsertEventoFormulario(42, { nome: 'Nome 2', data: '2026-07-11', descricao: 'Desc 2' })

      expect(eventos.value).toHaveLength(1)
      expect(eventos.value[0].nome).toBe('Nome 2')
      expect(eventos.value[0].data).toBe('2026-07-11')
    })

    it('remove o evento vinculado quando a data é limpa (formulário deixou de ter data de evento)', async () => {
      const { eventos, upsertEventoFormulario } = await storeLimpa()

      upsertEventoFormulario(42, { nome: 'Nome', data: '2026-07-10', descricao: '' })
      expect(eventos.value).toHaveLength(1)

      upsertEventoFormulario(42, { nome: 'Nome', data: null, descricao: '' })
      expect(eventos.value).toHaveLength(0)
    })

    it('não afeta eventos de outros formulários', async () => {
      const { eventos, upsertEventoFormulario } = await storeLimpa()

      upsertEventoFormulario(1, { nome: 'Form 1', data: '2026-07-10', descricao: '' })
      upsertEventoFormulario(2, { nome: 'Form 2', data: '2026-07-11', descricao: '' })

      expect(eventos.value).toHaveLength(2)
    })
  })

  it('removeEventoByFormulario remove só o evento vinculado àquele formulário', async () => {
    const { eventos, addEvento, removeEventoByFormulario } = await storeLimpa()
    addEvento({ nome: 'Vinculado', data: '2026-07-10', formularioId: 42 })
    vi.advanceTimersByTime(1)
    addEvento({ nome: 'Solto', data: '2026-07-11' })

    removeEventoByFormulario(42)

    expect(eventos.value).toHaveLength(1)
    expect(eventos.value[0].nome).toBe('Solto')
  })

  it('removeEventoByFormulario não faz nada se não houver evento vinculado', async () => {
    const { eventos, addEvento, removeEventoByFormulario } = await storeLimpa()
    addEvento({ nome: 'Solto', data: '2026-07-11' })

    expect(() => removeEventoByFormulario(999)).not.toThrow()
    expect(eventos.value).toHaveLength(1)
  })
})
