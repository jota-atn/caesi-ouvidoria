<script setup lang="ts">
defineOptions({ inheritAttrs: false })

defineProps<{
  large?: boolean
  titleId?: string
}>()

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="emit('close')">
      <div
        class="modal-box"
        :class="{ 'modal-box--lg': large }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        v-focus-trap
        v-bind="$attrs"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-box--lg { max-width: 620px; padding-bottom: 2.5rem; }
</style>
