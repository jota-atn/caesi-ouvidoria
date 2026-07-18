<script setup lang="ts">
import { ref } from 'vue'
import { isValidImageFile } from '../utils/validation.ts'
import { comprimirImagem } from '../utils/imagem.ts'
import { showToast } from '../stores/toast.ts'

const modelValue = defineModel<string[]>({ required: true })

withDefaults(defineProps<{
  label?: string
  altPrefix?: string
  mostrarCapa?: boolean
  previewFirst?: boolean
}>(), {
  label: '+ Adicionar imagens',
  altPrefix: 'Imagem',
  mostrarCapa: false,
  previewFirst: false,
})

const fileRef = ref<HTMLInputElement | null>(null)

async function onChange(e: Event) {
  const target = e.target as HTMLInputElement
  let invalido = false
  const novas: string[] = []
  for (const file of target.files ?? []) {
    if (!isValidImageFile(file)) { invalido = true; continue }
    novas.push(await comprimirImagem(file))
  }
  if (novas.length) modelValue.value = [...modelValue.value, ...novas]
  if (invalido) showToast('Alguns arquivos foram ignorados (precisam ser imagens de até 8MB).', 'error')
  target.value = ''
}

function remover(i: number) {
  modelValue.value = modelValue.value.filter((_, idx) => idx !== i)
}
</script>

<template>
  <div>
    <template v-if="!previewFirst">
      <button type="button" class="btn-foto" @click="fileRef?.click()">{{ label }}</button>
      <input ref="fileRef" type="file" accept="image/*" multiple style="display:none" @change="onChange">
    </template>

    <div v-if="modelValue.length > 0" class="imagens-preview">
      <div v-for="(img, i) in modelValue" :key="i" class="img-thumb-wrap">
        <img :src="img" class="img-thumb" :alt="`${altPrefix} ${i + 1}`">
        <button type="button" class="img-thumb-remove" @click="remover(i)">×</button>
        <span v-if="mostrarCapa && i === 0" class="img-thumb-capa">capa</span>
      </div>
    </div>

    <template v-if="previewFirst">
      <button type="button" class="btn-foto" style="margin-top:8px;" @click="fileRef?.click()">{{ label }}</button>
      <input ref="fileRef" type="file" accept="image/*" multiple style="display:none" @change="onChange">
    </template>
  </div>
</template>
