import { ref, computed } from 'vue'

const KEY_ADMINS = 'caesi_admins'
const KEY_DESC   = 'caesi_gestao_descricao'
const KEY_INFO   = 'caesi_gestao_info'

const _admins    = ref(JSON.parse(localStorage.getItem(KEY_ADMINS) || '[]'))
const _descricao = ref(localStorage.getItem(KEY_DESC) || '')
const INFO_DEFAULT = { nomeChapa: '', mesInicio: '', anoInicio: '', mesFim: '', anoFim: '' }
const _info = ref({ ...INFO_DEFAULT, ...JSON.parse(localStorage.getItem(KEY_INFO) || '{}') })

const MESES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export const admins          = computed(() => _admins.value)
export const descricaoGestao = computed(() => _descricao.value)
export const gestaoInfo      = computed(() => _info.value)
export const periodoFormatado = computed(() => {
  const { mesInicio, anoInicio, mesFim, anoFim } = _info.value
  if (!mesInicio || !anoInicio) return ''
  const fim = mesFim && anoFim ? ` – ${mesFim} ${anoFim}` : ''
  return `${mesInicio} ${anoInicio}${fim}`
})
export { MESES }

function persistAdmins(list) {
  localStorage.setItem(KEY_ADMINS, JSON.stringify(list))
  _admins.value = [...list]
}

export function addAdmin(admin) {
  const novo = { ...admin, id: Date.now() }
  persistAdmins([..._admins.value, novo])
  return novo
}

export function removeAdmin(id) {
  persistAdmins(_admins.value.filter(a => a.id !== id))
}

export function updateAdmin(id, data) {
  persistAdmins(_admins.value.map(a => a.id === id ? { ...a, ...data } : a))
}

export function saveDescricao(texto) {
  localStorage.setItem(KEY_DESC, texto)
  _descricao.value = texto
}

export function saveInfo(info) {
  localStorage.setItem(KEY_INFO, JSON.stringify(info))
  _info.value = { ...info }
}
