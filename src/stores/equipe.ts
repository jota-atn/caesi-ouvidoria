import { ref, computed } from 'vue'

export interface Membro {
  id: number
  nome: string
  email: string
  diretoria?: string
  periodo?: string
  foto?: string
  descricao?: string
  linkedin?: string
  git?: string
  lattes?: string
}

export type NovoMembro = Omit<Membro, 'id'>

export interface GestaoInfo {
  nomeChapa: string
  mesInicio: string
  anoInicio: string
  mesFim: string
  anoFim: string
}

export interface MembroHistorico {
  nome: string
  diretoria: string
  periodo: string
  foto: string
}

export interface GestaoHistorico {
  id: number
  nomeChapa: string
  periodo: string
  descricao: string
  membros: MembroHistorico[]
}

export interface NovaGestaoManual {
  nomeChapa: string
  periodo: string
  descricao: string
  membros?: MembroHistorico[]
}

export interface ContatoInfo {
  endereco: string
  email: string
  instagram: string
}

export interface SecaoCustom {
  id: number
  titulo: string
  conteudo: string
  imagem: string
}

export interface NovaSecaoCustom {
  titulo: string
  conteudo: string
  imagem?: string
}

const KEY_MEMBROS  = 'caesi_membros'
const KEY_DESC     = 'caesi_gestao_descricao'
const KEY_INFO     = 'caesi_gestao_info'
const KEY_HIST     = 'caesi_gestoes_anteriores'
const KEY_HIST_VIS = 'caesi_gestoes_visiveis'
const KEY_MISSAO     = 'caesi_sobre_missao'
const KEY_MISSAO_IMG = 'caesi_sobre_missao_img'
const KEY_CONTATO    = 'caesi_sobre_contato'
const KEY_SECOES     = 'caesi_sobre_secoes'

const MISSAO_DEFAULT = `O CAESI, Centro Acadêmico de Ciência da Computação, é a entidade estudantil
que representa os alunos do curso de Ciência da Computação da UFCG. Nossa missão é defender
os direitos e interesses dos estudantes, promover a integração acadêmica e facilitar a comunicação
entre o corpo discente e a instituição.

A ouvidoria é um dos nossos canais mais importantes: um espaço para que qualquer aluno possa
relatar problemas, sugerir melhorias ou entrar em contato com o CAESI de forma segura, inclusive anônima.`

const CONTATO_DEFAULT: ContatoInfo = {
  endereco:  'Sala do CAESI — Bloco CP, UFCG, Campina Grande – PB',
  email:     'caesi@ccc.ufcg.edu.br',
  instagram: 'caesiufcg',
}

const _membros   = ref<Membro[]>(JSON.parse(localStorage.getItem(KEY_MEMBROS) || '[]'))
const _descricao = ref(localStorage.getItem(KEY_DESC) || '')
const INFO_DEFAULT: GestaoInfo = { nomeChapa: '', mesInicio: '', anoInicio: '', mesFim: '', anoFim: '' }
const _info      = ref<GestaoInfo>({ ...INFO_DEFAULT, ...JSON.parse(localStorage.getItem(KEY_INFO) || '{}') })
const _historico = ref<GestaoHistorico[]>(JSON.parse(localStorage.getItem(KEY_HIST) || '[]'))
const _histVis   = ref(localStorage.getItem(KEY_HIST_VIS) !== 'false')
const _missao    = ref(localStorage.getItem(KEY_MISSAO) || MISSAO_DEFAULT)
const _missaoImg = ref(localStorage.getItem(KEY_MISSAO_IMG) || '')
const _contato   = ref<ContatoInfo>({ ...CONTATO_DEFAULT, ...JSON.parse(localStorage.getItem(KEY_CONTATO) || '{}') })
const _secoes    = ref<SecaoCustom[]>(JSON.parse(localStorage.getItem(KEY_SECOES) || '[]'))

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export const membros            = computed(() => _membros.value)
export const descricaoGestao    = computed(() => _descricao.value)
export const gestaoInfo         = computed(() => _info.value)
export const historicoGestoes   = computed(() => _historico.value)
export const historicoVisivel   = computed(() => _histVis.value)
export const missaoTexto        = computed(() => _missao.value)
export const missaoImagem       = computed(() => _missaoImg.value)
export const contatoInfo        = computed(() => _contato.value)
export const secoesCustom       = computed(() => _secoes.value)
export const periodoFormatado  = computed(() => {
  const { mesInicio, anoInicio, mesFim, anoFim } = _info.value
  if (!mesInicio || !anoInicio) return ''
  const fim = mesFim && anoFim ? ` – ${mesFim} ${anoFim}` : ''
  return `${mesInicio} ${anoInicio}${fim}`
})
export { MESES }

function persistMembros(list: Membro[]) {
  localStorage.setItem(KEY_MEMBROS, JSON.stringify(list))
  _membros.value = [...list]
}

export function addMembro(membro: NovoMembro): Membro {
  const novo: Membro = { ...membro, id: Date.now() }
  persistMembros([..._membros.value, novo])
  return novo
}

export function removeMembro(id: number) {
  persistMembros(_membros.value.filter(a => a.id !== id))
}

export function updateMembro(id: number, data: Partial<Membro>) {
  persistMembros(_membros.value.map(a => a.id === id ? { ...a, ...data } : a))
}

export function saveMissao(texto: string) {
  localStorage.setItem(KEY_MISSAO, texto)
  _missao.value = texto
}

export function saveMissaoImagem(dataUrl: string | null) {
  localStorage.setItem(KEY_MISSAO_IMG, dataUrl || '')
  _missaoImg.value = dataUrl || ''
}

export function saveContato(dados: Partial<ContatoInfo>) {
  const novo = { ..._contato.value, ...dados }
  localStorage.setItem(KEY_CONTATO, JSON.stringify(novo))
  _contato.value = novo
}

export function saveDescricao(texto: string) {
  localStorage.setItem(KEY_DESC, texto)
  _descricao.value = texto
}

export function saveInfo(info: GestaoInfo) {
  localStorage.setItem(KEY_INFO, JSON.stringify(info))
  _info.value = { ...info }
}

export function setHistoricoVisivel(val: boolean) {
  _histVis.value = val
  localStorage.setItem(KEY_HIST_VIS, String(val))
}

export function adicionarGestaoManual({ nomeChapa, periodo, descricao, membros }: NovaGestaoManual) {
  const entrada: GestaoHistorico = { id: Date.now(), nomeChapa, periodo, descricao, membros: membros ?? [] }
  const nova = [entrada, ..._historico.value]
  localStorage.setItem(KEY_HIST, JSON.stringify(nova))
  _historico.value = nova
}

export function arquivarGestaoAtual() {
  const entrada: GestaoHistorico = {
    id:       Date.now(),
    nomeChapa: _info.value.nomeChapa,
    periodo:  periodoFormatado.value,
    descricao: _descricao.value,
    membros:  _membros.value.map(({ nome, diretoria, periodo, foto }) => ({ nome, diretoria: diretoria ?? '', periodo: periodo ?? '', foto: foto ?? '' })),
  }
  const nova = [entrada, ..._historico.value]
  localStorage.setItem(KEY_HIST, JSON.stringify(nova))
  _historico.value = nova
}

export function removerGestaoHistorico(id: number) {
  const nova = _historico.value.filter(g => g.id !== id)
  localStorage.setItem(KEY_HIST, JSON.stringify(nova))
  _historico.value = nova
}

function persistSecoes(list: SecaoCustom[]) {
  localStorage.setItem(KEY_SECOES, JSON.stringify(list))
  _secoes.value = [...list]
}

export function addSecao({ titulo, conteudo, imagem = '' }: NovaSecaoCustom): SecaoCustom {
  const nova: SecaoCustom = { id: Date.now(), titulo, conteudo, imagem }
  persistSecoes([..._secoes.value, nova])
  return nova
}

export function updateSecao(id: number, data: Partial<SecaoCustom>) {
  persistSecoes(_secoes.value.map(s => s.id === id ? { ...s, ...data } : s))
}

export function removeSecao(id: number) {
  persistSecoes(_secoes.value.filter(s => s.id !== id))
}

export function moverSecao(id: number, direcao: number) {
  const list = [..._secoes.value]
  const idx = list.findIndex(s => s.id === id)
  const alvo = idx + direcao
  if (idx < 0 || alvo < 0 || alvo >= list.length) return
  ;[list[idx], list[alvo]] = [list[alvo], list[idx]]
  persistSecoes(list)
}
