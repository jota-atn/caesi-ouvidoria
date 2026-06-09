import { ref, computed } from 'vue'

const MOCK_PASSWORD = 'caesi2025'

const _admin = ref(!!localStorage.getItem('caesi_admin'))

export const isAdmin    = computed(() => _admin.value)
export const isLoggedIn = computed(() => _admin.value)
export const user       = computed(() => _admin.value ? { role: 'admin', nome: 'Admin', email: 'admin' } : null)

export function loginAdmin(password) {
  if (password !== MOCK_PASSWORD) return false
  _admin.value = true
  localStorage.setItem('caesi_admin', '1')
  return true
}

export function login() {}

export function logout() {
  _admin.value = false
  localStorage.removeItem('caesi_admin')
}
