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
  if (window.history.state?.back) router.back()
  else router.push(props.to)
}
</script>

<template>
  <button class="back-link" @click="voltar">← {{ label }}</button>
</template>
