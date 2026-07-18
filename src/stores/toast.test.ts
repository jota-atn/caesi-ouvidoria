import { describe, it, expect, beforeEach, afterEach } from 'vitest'

// Sem localStorage aqui, mas o módulo ainda guarda estado próprio (_list e o
// contador _id) que sobrevive entre testes se não recarregarmos o módulo —
// resetModules() garante um _id e uma lista zerados a cada teste.
async function storeLimpa() {
  vi.resetModules()
  return import('./toast.ts')
}

describe('stores/toast', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('começa sem toasts', async () => {
    const { toasts } = await storeLimpa()
    expect(toasts.value).toEqual([])
  })

  it('showToast adiciona um toast com o tipo informado', async () => {
    const { toasts, showToast } = await storeLimpa()
    showToast('Deu certo', 'success')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0]).toMatchObject({ mensagem: 'Deu certo', tipo: 'success' })
  })

  it('usa "success" como tipo padrão', async () => {
    const { toasts, showToast } = await storeLimpa()
    showToast('Sem tipo especificado')
    expect(toasts.value[0].tipo).toBe('success')
  })

  it('ids são únicos e crescentes entre toasts', async () => {
    const { toasts, showToast } = await storeLimpa()
    showToast('Primeiro')
    showToast('Segundo')
    expect(toasts.value[1].id).toBeGreaterThan(toasts.value[0].id)
  })

  it('remove o toast sozinho depois de 3500ms', async () => {
    const { toasts, showToast } = await storeLimpa()
    showToast('Vai sumir')
    expect(toasts.value).toHaveLength(1)

    vi.advanceTimersByTime(3499)
    expect(toasts.value).toHaveLength(1)

    vi.advanceTimersByTime(1)
    expect(toasts.value).toHaveLength(0)
  })

  it('remove só o toast que expirou, não os outros', async () => {
    const { toasts, showToast } = await storeLimpa()
    showToast('Primeiro')
    vi.advanceTimersByTime(2000)
    showToast('Segundo')

    // Aos 3500ms desde o início, só o primeiro (criado em t=0) expirou.
    vi.advanceTimersByTime(1500)
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].mensagem).toBe('Segundo')
  })
})
