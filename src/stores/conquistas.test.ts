import { describe, it, expect, beforeEach } from 'vitest'

async function storeLimpa() {
  localStorage.clear()
  vi.resetModules()
  return import('./conquistas.ts')
}

describe('stores/conquistas', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('começa como não desbloqueada quando não há nada no localStorage', async () => {
    const { conquistaSecretaDesbloqueada } = await storeLimpa()
    expect(conquistaSecretaDesbloqueada.value).toBe(false)
  })

  it('marcarConquistaSecreta marca como desbloqueada e retorna true na primeira vez', async () => {
    const { conquistaSecretaDesbloqueada, marcarConquistaSecreta } = await storeLimpa()

    const desbloqueouAgora = marcarConquistaSecreta()

    expect(desbloqueouAgora).toBe(true)
    expect(conquistaSecretaDesbloqueada.value).toBe(true)
    expect(localStorage.getItem('caesi_conquista_secreta')).toBe('true')
  })

  it('marcarConquistaSecreta retorna false quando já estava desbloqueada', async () => {
    const { marcarConquistaSecreta } = await storeLimpa()

    marcarConquistaSecreta()
    const segundaChamada = marcarConquistaSecreta()

    expect(segundaChamada).toBe(false)
  })

  it('lê o estado já desbloqueado do localStorage ao recarregar a store', async () => {
    const { marcarConquistaSecreta } = await storeLimpa()
    marcarConquistaSecreta()

    vi.resetModules()
    const { conquistaSecretaDesbloqueada } = await import('./conquistas.ts')

    expect(conquistaSecretaDesbloqueada.value).toBe(true)
  })
})
