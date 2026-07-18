import { ref } from 'vue'

// Conquistas são 100% localStorage, de propósito — não tem relação com o backend
// e não deve virar uma feature de servidor quando ele existir.
const CHAVE_CONQUISTA_SECRETA = 'caesi_conquista_secreta'

export const conquistaSecretaDesbloqueada = ref(localStorage.getItem(CHAVE_CONQUISTA_SECRETA) === 'true')

// retorna true só quando desbloqueia agora (pra quem chama poder avisar o usuário só uma vez)
export function marcarConquistaSecreta(): boolean {
  if (conquistaSecretaDesbloqueada.value) return false
  conquistaSecretaDesbloqueada.value = true
  localStorage.setItem(CHAVE_CONQUISTA_SECRETA, 'true')
  return true
}
