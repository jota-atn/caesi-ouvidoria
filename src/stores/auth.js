import { ref, computed } from 'vue'

const _user = ref(JSON.parse(localStorage.getItem('caesi_user') || 'null'))

export const user     = computed(() => _user.value)
export const isLoggedIn = computed(() => !!_user.value)
export const isAdmin  = computed(() => _user.value?.role === 'admin')

export function login(userData) {
  _user.value = userData
  localStorage.setItem('caesi_user', JSON.stringify(userData))
}

export function logout() {
  _user.value = null
  localStorage.removeItem('caesi_user')
}
