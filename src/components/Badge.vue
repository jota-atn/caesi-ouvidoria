<script setup>
defineProps({
  status: { type: String, required: true }, // 'pendente' | 'atendida'
})
</script>

<template>
  <span class="badge" :class="status === 'atendida' ? 'badge-atendida' : 'badge-pendente'">
    {{ status === 'atendida' ? 'Atendida' : 'Pendente' }}
  </span>
</template>
