<script setup lang="ts">
import type { StatusMensagem } from '../stores/mensagens.ts'

defineProps<{
  status: StatusMensagem
}>()
</script>

<template>
  <span class="badge" :class="status === 'atendida' ? 'badge-atendida' : 'badge-pendente'">
    {{ status === 'atendida' ? 'Atendida' : 'Pendente' }}
  </span>
</template>
