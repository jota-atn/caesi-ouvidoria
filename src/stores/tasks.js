import { ref, computed } from 'vue'
import { addNotificacao } from './notificacoes.js'

const KEY = 'caesi_tasks'

function load() {
  return JSON.parse(localStorage.getItem(KEY) || '[]')
}

const _tasks = ref(load())

function persist(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
  _tasks.value = [...data]
}

export const tasks = computed(() => _tasks.value)

export function criarTask(dados) {
  const task = {
    id: Date.now().toString(),
    titulo:    dados.titulo,
    descricao: dados.descricao || '',
    prioridade: dados.prioridade,
    prazo:     dados.prazo,
    categoria: dados.categoria,
    status:    'pendente',
    alocados:  dados.alocados || [],
    solicitacoes: [],
    criadoEm: new Date().toISOString(),
  }
  persist([..._tasks.value, task])

  task.alocados.forEach(email => {
    addNotificacao({
      userEmail: email,
      tipo: 'task-alocada',
      titulo: 'Você foi alocado em uma task',
      subtitulo: task.titulo,
      link: '/admin/tasks',
      dedupeKey: `task-alocada-${task.id}-${email}`,
    })
  })

  return task
}

export function editarTask(id, dados) {
  let novosAlocados = []
  const updated = _tasks.value.map(t => {
    if (t.id !== id) return t
    novosAlocados = (dados.alocados || []).filter(e => !t.alocados.includes(e))
    return { ...t, ...dados }
  })
  persist(updated)

  const task = updated.find(t => t.id === id)
  novosAlocados.forEach(email => {
    addNotificacao({
      userEmail: email,
      tipo: 'task-alocada',
      titulo: 'Você foi alocado em uma task',
      subtitulo: task.titulo,
      link: '/admin/tasks',
      dedupeKey: `task-alocada-${id}-${email}`,
    })
  })
}

export function excluirTask(id) {
  persist(_tasks.value.filter(t => t.id !== id))
}

export function atualizarStatus(id, status) {
  persist(_tasks.value.map(t => t.id === id ? { ...t, status } : t))
}

export function solicitarParticipacao(id, adminEmail, adminNome) {
  const task = _tasks.value.find(t => t.id === id)
  if (!task) return
  if (task.solicitacoes.includes(adminEmail) || task.alocados.includes(adminEmail)) return

  persist(_tasks.value.map(t =>
    t.id === id ? { ...t, solicitacoes: [...t.solicitacoes, adminEmail] } : t
  ))

  addNotificacao({
    userEmail: 'admin',
    tipo: 'task-solicitacao',
    titulo: `${adminNome} quer participar de uma task`,
    subtitulo: task.titulo,
    link: '/admin/tasks',
    dedupeKey: `task-solicitacao-${id}-${adminEmail}`,
  })
}

export function aprovarParticipacao(id, adminEmail) {
  const task = _tasks.value.find(t => t.id === id)
  if (!task) return
  persist(_tasks.value.map(t =>
    t.id === id ? {
      ...t,
      alocados:     [...t.alocados, adminEmail],
      solicitacoes: t.solicitacoes.filter(e => e !== adminEmail),
    } : t
  ))
  addNotificacao({
    userEmail: adminEmail,
    tipo: 'task-aprovada',
    titulo: 'Participação em task aprovada',
    subtitulo: task.titulo,
    link: '/admin/tasks',
    dedupeKey: `task-aprovada-${id}-${adminEmail}`,
  })
}

export function rejeitarParticipacao(id, adminEmail) {
  const task = _tasks.value.find(t => t.id === id)
  if (!task) return
  persist(_tasks.value.map(t =>
    t.id === id ? { ...t, solicitacoes: t.solicitacoes.filter(e => e !== adminEmail) } : t
  ))
  addNotificacao({
    userEmail: adminEmail,
    tipo: 'task-rejeitada',
    titulo: 'Participação em task não aprovada',
    subtitulo: task.titulo,
    link: '/admin/tasks',
    dedupeKey: `task-rejeitada-${id}-${adminEmail}`,
  })
}
