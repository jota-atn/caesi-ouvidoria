const KEY = 'caesi_usuarios'
const ADMIN = { nome: 'Admin CAESI', email: 'admin', matricula: null, senha: 'admin', role: 'admin' }

function load() {
  const stored = localStorage.getItem(KEY)
  if (!stored) {
    localStorage.setItem(KEY, JSON.stringify([ADMIN]))
    return [ADMIN]
  }
  const users = JSON.parse(stored)
  if (!users.find(u => u.role === 'admin')) {
    users.unshift(ADMIN)
    localStorage.setItem(KEY, JSON.stringify(users))
  }
  return users
}

export function findUser(identificador, senha) {
  return load().find(u =>
    (u.email === identificador || u.matricula === identificador) && u.senha === senha
  ) ?? null
}

export function registerUser({ nome, matricula, email, senha }) {
  const users = load()
  if (users.find(u => u.email === email || (matricula && u.matricula === matricula))) {
    return { error: 'Já existe uma conta com esse e-mail ou matrícula.' }
  }
  const novo = { nome, matricula, email, senha, role: 'user' }
  users.push(novo)
  localStorage.setItem(KEY, JSON.stringify(users))
  return { user: novo }
}
