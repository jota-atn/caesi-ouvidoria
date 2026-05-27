<script setup>
defineProps({
  categoria: { type: String, required: true },
})

const classMap = {
  matricula: 'tag-matricula',
  infra:     'tag-infra',
  docente:   'tag-docente',
  estagio:   'tag-estagio',
  eventos:   'tag-eventos',
  sugestao:  'tag-sugestao',
  outro:     'tag-outro',
}

const labelMap = {
  matricula: 'Matrícula',
  infra:     'Infraestrutura',
  docente:   'Corpo Docente',
  estagio:   'Estágios',
  eventos:   'Eventos',
  sugestao:  'Sugestão',
  outro:     'Outro',
}
</script>

<template>
  <span class="tag" :class="classMap[categoria] ?? 'tag-outro'">
    {{ labelMap[categoria] ?? categoria }}
  </span>
</template>
