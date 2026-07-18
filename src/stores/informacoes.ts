import { ref, computed } from 'vue'

export interface Anexo {
  nome: string
}

export interface Edital {
  id: number
  titulo: string
  descricao: string
  data: string | null
  anexo: Anexo | null
  criadoEm: string
}

export interface NovoEdital {
  titulo: string
  descricao?: string
  data?: string | null
  anexo?: Anexo | null
}

export interface Professor {
  id: number
  nome: string
  sala: string
  estruturaId: number | null
  descricao: string
  foto: string
  email: string
  lattes: string
  googleAcademico: string
  linkedin: string
}

export interface NovoProfessor {
  nome: string
  sala?: string
  estruturaId?: number | null
  descricao?: string
  foto?: string
  email?: string
  lattes?: string
  googleAcademico?: string
  linkedin?: string
}

export interface Laboratorio {
  id: number
  nome: string
  sigla: string
  descricao: string
  imagem: string | null
  imagens: string[]
  email: string
  linkExterno: string
  estruturaId: number | null
}

export interface NovoLaboratorio {
  nome: string
  sigla?: string
  descricao?: string
  imagem?: string | null
  imagens?: string[]
  email?: string
  linkExterno?: string
  estruturaId?: number | null
}

export interface Tamburetei {
  titulo: string
  descricao: string
  linkExterno: string
}

const KEY_EDITAIS      = 'caesi_editais'
const KEY_PROFESSORES  = 'caesi_professores'
const KEY_LABORATORIOS = 'caesi_laboratorios'
const KEY_TAMBURETEI   = 'caesi_tamburetei'

function hoje(): string { return new Date().toISOString().split('T')[0] }

// ── Editais ─────────────────────────────────────────────
const _editais = ref<Edital[]>(JSON.parse(localStorage.getItem(KEY_EDITAIS) || '[]'))
export const editais = computed(() => _editais.value)

function persistEditais(list: Edital[]) {
  localStorage.setItem(KEY_EDITAIS, JSON.stringify(list))
  _editais.value = [...list]
}

export function addEdital({ titulo, descricao = '', data = null, anexo = null }: NovoEdital): Edital {
  const novo: Edital = { id: Date.now(), titulo, descricao, data, anexo, criadoEm: hoje() }
  persistEditais([..._editais.value, novo])
  return novo
}
export function updateEdital(id: number, updates: Partial<Edital>) {
  persistEditais(_editais.value.map(e => e.id === id ? { ...e, ...updates } : e))
}
export function deleteEdital(id: number) {
  persistEditais(_editais.value.filter(e => e.id !== id))
}

// ── Professores ─────────────────────────────────────────
const _professores = ref<Professor[]>(JSON.parse(localStorage.getItem(KEY_PROFESSORES) || '[]'))
export const professores = computed(() => _professores.value)

function persistProfessores(list: Professor[]) {
  localStorage.setItem(KEY_PROFESSORES, JSON.stringify(list))
  _professores.value = [...list]
}

export function addProfessor({ nome, sala = '', estruturaId = null, descricao = '', foto = '', email = '', lattes = '', googleAcademico = '', linkedin = '' }: NovoProfessor): Professor {
  const novo: Professor = { id: Date.now(), nome, sala, estruturaId, descricao, foto, email, lattes, googleAcademico, linkedin }
  persistProfessores([..._professores.value, novo])
  return novo
}
export function updateProfessor(id: number, updates: Partial<Professor>) {
  persistProfessores(_professores.value.map(p => p.id === id ? { ...p, ...updates } : p))
}
export function deleteProfessor(id: number) {
  persistProfessores(_professores.value.filter(p => p.id !== id))
}

// ── Laboratórios ────────────────────────────────────────
const _laboratorios = ref<Laboratorio[]>(JSON.parse(localStorage.getItem(KEY_LABORATORIOS) || '[]'))
export const laboratorios = computed(() => _laboratorios.value)

function persistLaboratorios(list: Laboratorio[]) {
  localStorage.setItem(KEY_LABORATORIOS, JSON.stringify(list))
  _laboratorios.value = [...list]
}

export function addLaboratorio({ nome, sigla = '', descricao = '', imagem = null, imagens = [], email = '', linkExterno = '', estruturaId = null }: NovoLaboratorio): Laboratorio {
  const novo: Laboratorio = { id: Date.now(), nome, sigla, descricao, imagem, imagens, email, linkExterno, estruturaId }
  persistLaboratorios([..._laboratorios.value, novo])
  return novo
}
export function updateLaboratorio(id: number, updates: Partial<Laboratorio>) {
  persistLaboratorios(_laboratorios.value.map(l => l.id === id ? { ...l, ...updates } : l))
}
export function deleteLaboratorio(id: number) {
  persistLaboratorios(_laboratorios.value.filter(l => l.id !== id))
}

// ── Tamburetei (bloco único, sem lista) ──────────────────
const TAMBURETEI_DEFAULT: Tamburetei = {
  titulo: 'Tamburetei',
  descricao: 'O Tamburetei é uma plataforma colaborativa mantida pela OpenDev UFCG pra ajudar quem tá cursando Ciência da Computação — a ideia é "fazer de tamburete aquela cadeira de CC". Lá você encontra resumos de disciplinas, provas antigas, dicas e materiais compartilhados por outros alunos.\n\nA plataforma está parada há um tempo, mas o repositório continua de pé — e quanto mais gente contribuir, mais viva ela fica. Se você tem provas antigas, resumos ou dicas de alguma disciplina, contribuir é só um pull request de distância.',
  linkExterno: 'https://tamburetei.opendevufcg.org/',
}

const _tamburetei = ref<Tamburetei>({ ...TAMBURETEI_DEFAULT, ...JSON.parse(localStorage.getItem(KEY_TAMBURETEI) || '{}') })
export const tamburetei = computed(() => _tamburetei.value)

export function saveTamburetei(dados: Tamburetei) {
  localStorage.setItem(KEY_TAMBURETEI, JSON.stringify(dados))
  _tamburetei.value = { ...dados }
}
