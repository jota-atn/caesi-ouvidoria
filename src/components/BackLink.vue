<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = withDefaults(defineProps<{
  to?: string
  label?: string
}>(), {
  to: '/',
  label: 'Voltar',
})

const router = useRouter()
function voltar() {
  window.history.state?.back ? router.back() : router.push(props.to)
}
</script>

<template>
  <button class="back-link" @click="voltar">← {{ label }}</button>
</template>
