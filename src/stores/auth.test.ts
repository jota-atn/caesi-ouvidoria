import { describe, it, expect, beforeEach } from 'vitest'

async function storeLimpa() {
  localStorage.clear()
  vi.resetModules()
  return import('./auth.ts')
}

const EMAIL_VALIDO = 'caesi@ccc.ufcg.edu.br'
const SENHA_PADRAO = 'caesi2025'

describe('stores/auth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('começa deslogado quando não há nada no localStorage', async () => {
    const { isAdmin, user, mustChangePassword } = await storeLimpa()
    expect(isAdmin.value).toBe(false)
    expect(user.value).toBeNull()
    expect(mustChangePassword.value).toBe(false)
  })

  it('loginAdmin falha com email errado', async () => {
    const { loginAdmin, isAdmin } = await storeLimpa()
    expect(loginAdmin('outro@email.com', SENHA_PADRAO)).toBe(false)
    expect(isAdmin.value).toBe(false)
  })

  it('loginAdmin falha com senha errada', async () => {
    const { loginAdmin, isAdmin } = await storeLimpa()
    expect(loginAdmin(EMAIL_VALIDO, 'senha-errada')).toBe(false)
    expect(isAdmin.value).toBe(false)
  })

  it('loginAdmin aceita o email em qualquer caixa e com espaços nas pontas', async () => {
    const { loginAdmin, isAdmin } = await storeLimpa()
    expect(loginAdmin('  CAESI@CCC.UFCG.EDU.BR  ', SENHA_PADRAO)).toBe(true)
    expect(isAdmin.value).toBe(true)
  })

  it('loginAdmin com sucesso marca isAdmin e exige trocar a senha padrão de fábrica', async () => {
    const { loginAdmin, isAdmin, mustChangePassword, user } = await storeLimpa()

    const ok = loginAdmin(EMAIL_VALIDO, SENHA_PADRAO)

    expect(ok).toBe(true)
    expect(isAdmin.value).toBe(true)
    expect(mustChangePassword.value).toBe(true)
    expect(user.value).toEqual({ role: 'admin', nome: 'Admin', email: 'admin' })
  })

  it('depois de trocarSenha, um novo login não exige trocar de novo', async () => {
    const { loginAdmin, trocarSenha, mustChangePassword, logout } = await storeLimpa()

    loginAdmin(EMAIL_VALIDO, SENHA_PADRAO)
    trocarSenha('nova-senha-123')
    expect(mustChangePassword.value).toBe(false)
    logout()

    const segundoLogin = loginAdmin(EMAIL_VALIDO, 'nova-senha-123')
    expect(segundoLogin).toBe(true)
    expect(mustChangePassword.value).toBe(false)
  })

  it('trocarSenha invalida a senha padrão de fábrica', async () => {
    const { loginAdmin, trocarSenha, logout } = await storeLimpa()
    loginAdmin(EMAIL_VALIDO, SENHA_PADRAO)
    trocarSenha('nova-senha-123')
    logout()

    expect(loginAdmin(EMAIL_VALIDO, SENHA_PADRAO)).toBe(false)
  })

  it('loginComGoogle loga sem senha e sem exigir troca', async () => {
    const { loginComGoogle, isAdmin, mustChangePassword } = await storeLimpa()
    loginComGoogle()
    expect(isAdmin.value).toBe(true)
    expect(mustChangePassword.value).toBe(false)
  })

  it('logout desloga e remove o estado do localStorage', async () => {
    const { loginAdmin, logout, isAdmin } = await storeLimpa()
    loginAdmin(EMAIL_VALIDO, SENHA_PADRAO)

    logout()

    expect(isAdmin.value).toBe(false)
    expect(localStorage.getItem('caesi_admin')).toBeNull()
  })

  it('mantém o login entre reimports do módulo (sessão persistida)', async () => {
    const { loginAdmin } = await storeLimpa()
    loginAdmin(EMAIL_VALIDO, SENHA_PADRAO)

    vi.resetModules()
    const { isAdmin } = await import('./auth.ts')

    expect(isAdmin.value).toBe(true)
  })
})
