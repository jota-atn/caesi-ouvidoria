<script setup lang="ts">
import { watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BackToTop from './components/BackToTop.vue'
import ToastContainer from './components/ToastContainer.vue'
import { isAdmin } from './stores/auth.ts'
import { useSequenciaSecreta } from './composables/useSequenciaSecreta.ts'

watchEffect(() => {
  document.documentElement.classList.toggle('is-admin', isAdmin.value)
})

const router = useRouter()
useSequenciaSecreta(() => router.push('/painel-legado'))
</script>

<template>
  <RouterView />
  <BackToTop />
  <ToastContainer />
</template>
