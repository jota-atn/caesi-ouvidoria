import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type { Edital, Professor, Laboratorio } from './informacoes.ts'

async function storeLimpa() {
  localStorage.clear()
  vi.resetModules()
  return import('./informacoes.ts')
}

describe('stores/informacoes', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })
  afterEach(() => { vi.useRealTimers() })

  describe('editais', () => {
    it('começa vazia e addEdital aplica defaults', async () => {
      const { editais, addEdital } = await storeLimpa()
      const novo = addEdital({ titulo: 'Edital 1' })

      expect(editais.value).toHaveLength(1)
      expect(novo.descricao).toBe('')
      expect(novo.data).toBeNull()
      expect(novo.anexo).toBeNull()
      expect(novo.criadoEm).toBeTypeOf('string')
    })

    it('updateEdital e deleteEdital afetam só o edital indicado', async () => {
      const { editais, addEdital, updateEdital, deleteEdital } = await storeLimpa()
      const a = addEdital({ titulo: 'A' })
      vi.advanceTimersByTime(1)
      const b = addEdital({ titulo: 'B' })

      updateEdital(a.id, { titulo: 'A editado' })
      expect(editais.value.find((e: Edital) => e.id === a.id)!.titulo).toBe('A editado')
      expect(editais.value.find((e: Edital) => e.id === b.id)!.titulo).toBe('B')

      deleteEdital(a.id)
      expect(editais.value).toHaveLength(1)
      expect(editais.value[0].id).toBe(b.id)
    })
  })

  describe('professores', () => {
    it('começa vazia e addProfessor aplica defaults', async () => {
      const { professores, addProfessor } = await storeLimpa()
      const novo = addProfessor({ nome: 'Ana' })

      expect(professores.value).toHaveLength(1)
      expect(novo.sala).toBe('')
      expect(novo.estruturaId).toBeNull()
      expect(novo.email).toBe('')
    })

    it('updateProfessor e deleteProfessor afetam só o professor indicado', async () => {
      const { professores, addProfessor, updateProfessor, deleteProfessor } = await storeLimpa()
      const a = addProfessor({ nome: 'A' })
      vi.advanceTimersByTime(1)
      const b = addProfessor({ nome: 'B' })

      updateProfessor(a.id, { sala: 'Sala 101' })
      expect(professores.value.find((p: Professor) => p.id === a.id)!.sala).toBe('Sala 101')
      expect(professores.value.find((p: Professor) => p.id === b.id)!.sala).toBe('')

      deleteProfessor(a.id)
      expect(professores.value).toHaveLength(1)
      expect(professores.value[0].id).toBe(b.id)
    })
  })

  describe('laboratorios', () => {
    it('começa vazia e addLaboratorio aplica defaults', async () => {
      const { laboratorios, addLaboratorio } = await storeLimpa()
      const novo = addLaboratorio({ nome: 'LSD' })

      expect(laboratorios.value).toHaveLength(1)
      expect(novo.sigla).toBe('')
      expect(novo.imagem).toBeNull()
      expect(novo.imagens).toEqual([])
    })

    it('updateLaboratorio e deleteLaboratorio afetam só o laboratório indicado', async () => {
      const { laboratorios, addLaboratorio, updateLaboratorio, deleteLaboratorio } = await storeLimpa()
      const a = addLaboratorio({ nome: 'A' })
      vi.advanceTimersByTime(1)
      const b = addLaboratorio({ nome: 'B' })

      updateLaboratorio(a.id, { sigla: 'AAA' })
      expect(laboratorios.value.find((l: Laboratorio) => l.id === a.id)!.sigla).toBe('AAA')
      expect(laboratorios.value.find((l: Laboratorio) => l.id === b.id)!.sigla).toBe('')

      deleteLaboratorio(a.id)
      expect(laboratorios.value).toHaveLength(1)
      expect(laboratorios.value[0].id).toBe(b.id)
    })
  })

  describe('tamburetei', () => {
    it('começa com os valores padrão quando não há nada no localStorage', async () => {
      const { tamburetei } = await storeLimpa()
      expect(tamburetei.value.titulo).toBe('Tamburetei')
      expect(tamburetei.value.linkExterno).toBe('https://tamburetei.opendevufcg.org/')
    })

    it('saveTamburetei substitui o bloco e persiste entre reimports', async () => {
      const { saveTamburetei } = await storeLimpa()
      saveTamburetei({ titulo: 'Novo título', descricao: 'Nova descrição', linkExterno: 'https://x.com' })

      vi.resetModules()
      const { tamburetei } = await import('./informacoes.ts')

      expect(tamburetei.value).toEqual({ titulo: 'Novo título', descricao: 'Nova descrição', linkExterno: 'https://x.com' })
    })
  })
})
