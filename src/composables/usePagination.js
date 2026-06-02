import { ref, computed, watch } from 'vue'

export function usePagination(listRef, perPage = 10) {
  const page = ref(1)

  const total      = computed(() => listRef.value.length)
  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / perPage)))
  const paginated  = computed(() => listRef.value.slice((page.value - 1) * perPage, page.value * perPage))

  watch(total, () => { page.value = 1 })

  function next()  { if (page.value < totalPages.value) page.value++ }
  function prev()  { if (page.value > 1) page.value-- }
  function goTo(n) { page.value = Math.max(1, Math.min(n, totalPages.value)) }

  return { page, totalPages, paginated, next, prev, goTo }
}
