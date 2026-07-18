<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  imagens: string[]
  index: number | null
}>()

const emit = defineEmits<{
  'update:index': [value: number | null]
}>()

const atual = computed(() => props.index !== null ? props.imagens[props.index] : null)

function fechar() { emit('update:index', null) }
function prev() {
  if (props.index === null || !props.imagens.length) return
  emit('update:index', (props.index - 1 + props.imagens.length) % props.imagens.length)
}
function next() {
  if (props.index === null || !props.imagens.length) return
  emit('update:index', (props.index + 1) % props.imagens.length)
}

// Listener no document (não em @keydown de algum elemento da página) de propósito:
// o conteúdo é teleportado pra <body>, então uma vez que o foco entra nos botões
// da lightbox, um @keydown ligado a um elemento fora do <body> nunca mais dispara.
function onKeydown(e: KeyboardEvent) {
  if (props.index === null) return
  if (e.key === 'Escape')     fechar()
  else if (e.key === 'ArrowLeft')  prev()
  else if (e.key === 'ArrowRight') next()
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="index !== null && atual" class="lightbox" @click.self="fechar">
      <button class="lightbox-close" @click="fechar">×</button>
      <button v-if="imagens.length > 1" class="lightbox-nav lightbox-nav--prev" @click="prev">‹</button>
      <img :src="atual" :alt="`Foto ${index + 1}`" class="lightbox-img">
      <button v-if="imagens.length > 1" class="lightbox-nav lightbox-nav--next" @click="next">›</button>
      <div v-if="imagens.length > 1" class="lightbox-counter">
        {{ index + 1 }} / {{ imagens.length }}
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img {
  max-width: 92vw;
  max-height: 88vh;
  object-fit: contain;
  border-radius: 2px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}

.lightbox-close {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  font-size: 2.4rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s;
}
.lightbox-close:hover { opacity: 1; }

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  font-size: 2.8rem;
  line-height: 1;
  padding: 0.3rem 1rem;
  cursor: pointer;
  border-radius: 2px;
  transition: background 0.15s;
}
.lightbox-nav:hover    { background: rgba(255,255,255,0.2); }
.lightbox-nav--prev    { left: 12px; }
.lightbox-nav--next    { right: 12px; }

.lightbox-counter {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.6);
  font-size: 0.82rem;
  font-family: 'Archivo', sans-serif;
}
</style>
