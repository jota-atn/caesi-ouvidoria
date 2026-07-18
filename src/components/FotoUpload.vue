<script setup lang="ts">
import { ref } from 'vue'
import { isValidImageFile } from '../utils/validation.ts'
import { comprimirImagem } from '../utils/imagem.ts'
import { showToast } from '../stores/toast.ts'

const modelValue = defineModel<string>({ required: true })

withDefaults(defineProps<{
  avatar?: boolean
  labelAdd?: string
  labelTrocar?: string
}>(), {
  avatar: false,
  labelAdd: '+ Adicionar foto',
  labelTrocar: 'Trocar foto',
})

const fileRef = ref<HTMLInputElement | null>(null)

async function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  if (!isValidImageFile(file)) {
    showToast('Selecione uma imagem de até 8MB.', 'error')
    target.value = ''
    return
  }
  modelValue.value = await comprimirImagem(file)
  target.value = ''
}

function remover() { modelValue.value = '' }
</script>

<template>
  <div>
    <div v-if="modelValue" class="imagens-preview">
      <div class="img-thumb-wrap">
        <img :src="modelValue" class="img-thumb" :class="{ 'img-thumb--avatar': avatar }" alt="">
        <button type="button" class="img-thumb-remove" @click="remover">×</button>
      </div>
    </div>
    <button type="button" class="btn-foto" style="margin-top:8px;" @click="fileRef?.click()">
      {{ modelValue ? labelTrocar : labelAdd }}
    </button>
    <input ref="fileRef" type="file" accept="image/*" style="display:none" @change="onChange">
  </div>
</template>
