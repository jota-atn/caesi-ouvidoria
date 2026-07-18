import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { Membro, SecaoCustom } from './equipe.ts'

async function storeLimpa() {
  localStorage.clear()
  vi.resetModules()
  return import('./equipe.ts')
}

describe('stores/equipe', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })
  afterEach(() => { vi.useRealTimers() })

  describe('missão, contato e descrição — valores padrão', () => {
    it('começa com o texto e a imagem padrão da missão quando não há nada salvo', async () => {
      const { missaoTexto, missaoImagem } = await storeLimpa()
      expect(missaoTexto.value).toContain('Centro Acadêmico de Ciência da Computação')
      expect(missaoImagem.value).toBe('')
    })

    it('saveMissao e saveMissaoImagem persistem e refletem no computed', async () => {
      const { missaoTexto, missaoImagem, saveMissao, saveMissaoImagem } = await storeLimpa()
      saveMissao('Nova missão')
      saveMissaoImagem('data:image/jpeg;base64,xyz')

      expect(missaoTexto.value).toBe('Nova missão')
      expect(missaoImagem.value).toBe('data:image/jpeg;base64,xyz')
    })

    it('saveMissaoImagem(null) limpa a imagem', async () => {
      const { missaoImagem, saveMissaoImagem } = await storeLimpa()
      saveMissaoImagem('data:image/jpeg;base64,xyz')
      saveMissaoImagem(null)
      expect(missaoImagem.value).toBe('')
    })

    it('começa com o contato padrão (endereço/email/instagram do CAESI)', async () => {
      const { contatoInfo } = await storeLimpa()
      expect(contatoInfo.value.email).toBe('caesi@ccc.ufcg.edu.br')
      expect(contatoInfo.value.instagram).toBe('caesiufcg')
    })

    it('saveContato faz merge parcial, sem apagar os outros campos', async () => {
      const { contatoInfo, saveContato } = await storeLimpa()
      saveContato({ instagram: 'novo_instagram' })

      expect(contatoInfo.value.instagram).toBe('novo_instagram')
      expect(contatoInfo.value.email).toBe('caesi@ccc.ufcg.edu.br')
    })

    it('saveDescricao persiste a descrição da gestão atual', async () => {
      const { descricaoGestao, saveDescricao } = await storeLimpa()
      saveDescricao('Somos a chapa X')
      expect(descricaoGestao.value).toBe('Somos a chapa X')
    })
  })

  describe('gestaoInfo e periodoFormatado', () => {
    it('periodoFormatado é vazio sem mês/ano de início', async () => {
      const { periodoFormatado } = await storeLimpa()
      expect(periodoFormatado.value).toBe('')
    })

    it('periodoFormatado mostra só o início quando não há fim', async () => {
      const { saveInfo, periodoFormatado } = await storeLimpa()
      saveInfo({ nomeChapa: 'Chapa X', mesInicio: 'Jan', anoInicio: '2026', mesFim: '', anoFim: '' })
      expect(periodoFormatado.value).toBe('Jan 2026')
    })

    it('periodoFormatado mostra início e fim quando ambos existem', async () => {
      const { saveInfo, periodoFormatado } = await storeLimpa()
      saveInfo({ nomeChapa: 'Chapa X', mesInicio: 'Jan', anoInicio: '2026', mesFim: 'Dez', anoFim: '2026' })
      expect(periodoFormatado.value).toBe('Jan 2026 – Dez 2026')
    })
  })

  describe('membros', () => {
    it('addMembro gera id e updateMembro/removeMembro afetam só o membro certo', async () => {
      const { membros, addMembro, updateMembro, removeMembro } = await storeLimpa()
      const a = addMembro({ nome: 'Ana', email: 'ana@x.com' })
      vi.advanceTimersByTime(1)
      const b = addMembro({ nome: 'Bruno', email: 'bruno@x.com' })

      updateMembro(a.id, { diretoria: 'Presidência' })
      expect(membros.value.find((m: Membro) => m.id === a.id)!.diretoria).toBe('Presidência')
      expect(membros.value.find((m: Membro) => m.id === b.id)!.diretoria).toBeUndefined()

      removeMembro(a.id)
      expect(membros.value).toHaveLength(1)
      expect(membros.value[0].id).toBe(b.id)
    })
  })

  describe('histórico de gestões', () => {
    it('setHistoricoVisivel controla a visibilidade pública, default true', async () => {
      const { historicoVisivel, setHistoricoVisivel } = await storeLimpa()
      expect(historicoVisivel.value).toBe(true)
      setHistoricoVisivel(false)
      expect(historicoVisivel.value).toBe(false)
    })

    it('adicionarGestaoManual insere no início da lista (mais recente primeiro)', async () => {
      const { historicoGestoes, adicionarGestaoManual } = await storeLimpa()
      adicionarGestaoManual({ nomeChapa: 'Chapa Antiga', periodo: '2024', descricao: 'Desc' })
      adicionarGestaoManual({ nomeChapa: 'Chapa Mais Recente', periodo: '2025', descricao: 'Desc' })

      expect(historicoGestoes.value.map(g => g.nomeChapa)).toEqual(['Chapa Mais Recente', 'Chapa Antiga'])
      expect(historicoGestoes.value[0].membros).toEqual([])
    })

    it('arquivarGestaoAtual tira um snapshot da gestão e dos membros atuais', async () => {
      const { historicoGestoes, saveInfo, saveDescricao, addMembro, arquivarGestaoAtual } = await storeLimpa()
      saveInfo({ nomeChapa: 'Chapa Atual', mesInicio: 'Jan', anoInicio: '2026', mesFim: '', anoFim: '' })
      saveDescricao('Descrição da gestão')
      addMembro({ nome: 'Ana', email: 'ana@x.com', diretoria: 'Presidência', periodo: '2026.1' })

      arquivarGestaoAtual()

      expect(historicoGestoes.value).toHaveLength(1)
      const snapshot = historicoGestoes.value[0]
      expect(snapshot.nomeChapa).toBe('Chapa Atual')
      expect(snapshot.periodo).toBe('Jan 2026')
      expect(snapshot.membros).toEqual([{ nome: 'Ana', diretoria: 'Presidência', periodo: '2026.1', foto: '' }])
    })

    it('removerGestaoHistorico remove só a gestão indicada', async () => {
      const { historicoGestoes, adicionarGestaoManual, removerGestaoHistorico } = await storeLimpa()
      adicionarGestaoManual({ nomeChapa: 'A', periodo: '2024', descricao: '' })
      const idParaManter = historicoGestoes.value[0].id
      vi.advanceTimersByTime(1)
      adicionarGestaoManual({ nomeChapa: 'B', periodo: '2025', descricao: '' })
      const idParaRemover = historicoGestoes.value[0].id

      removerGestaoHistorico(idParaRemover)

      expect(historicoGestoes.value).toHaveLength(1)
      expect(historicoGestoes.value[0].id).toBe(idParaManter)
    })
  })

  describe('seções customizadas', () => {
    it('addSecao aplica imagem padrão vazia e updateSecao/removeSecao afetam só a seção certa', async () => {
      const { secoesCustom, addSecao, updateSecao, removeSecao } = await storeLimpa()
      const a = addSecao({ titulo: 'A', conteudo: 'Conteúdo A' })
      vi.advanceTimersByTime(1)
      const b = addSecao({ titulo: 'B', conteudo: 'Conteúdo B' })

      expect(a.imagem).toBe('')

      updateSecao(a.id, { titulo: 'A editado' })
      expect(secoesCustom.value.find((s: SecaoCustom) => s.id === a.id)!.titulo).toBe('A editado')
      expect(secoesCustom.value.find((s: SecaoCustom) => s.id === b.id)!.titulo).toBe('B')

      removeSecao(a.id)
      expect(secoesCustom.value).toHaveLength(1)
      expect(secoesCustom.value[0].id).toBe(b.id)
    })

    it('moverSecao troca a posição com a seção vizinha', async () => {
      const { secoesCustom, addSecao, moverSecao } = await storeLimpa()
      const a = addSecao({ titulo: 'A', conteudo: '' })
      vi.advanceTimersByTime(1)
      const b = addSecao({ titulo: 'B', conteudo: '' })
      vi.advanceTimersByTime(1)
      const c = addSecao({ titulo: 'C', conteudo: '' })

      moverSecao(b.id, -1) // sobe B: A, B, C -> B, A, C

      expect(secoesCustom.value.map((s: SecaoCustom) => s.id)).toEqual([b.id, a.id, c.id])
    })

    it('moverSecao não faz nada no primeiro item movendo pra cima, nem no último movendo pra baixo', async () => {
      const { secoesCustom, addSecao, moverSecao } = await storeLimpa()
      const a = addSecao({ titulo: 'A', conteudo: '' })
      vi.advanceTimersByTime(1)
      const b = addSecao({ titulo: 'B', conteudo: '' })

      moverSecao(a.id, -1)
      moverSecao(b.id, 1)

      expect(secoesCustom.value.map((s: SecaoCustom) => s.id)).toEqual([a.id, b.id])
    })
  })
})
