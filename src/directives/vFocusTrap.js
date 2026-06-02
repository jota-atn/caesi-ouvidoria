const FOCUSABLE = [
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export const vFocusTrap = {
  mounted(el) {
    el.querySelector(FOCUSABLE)?.focus()

    function onKeydown(e) {
      if (e.key !== 'Tab') return
      const items = [...el.querySelectorAll(FOCUSABLE)]
      if (!items.length) return
      const first = items[0]
      const last  = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }

    el._focusTrap = onKeydown
    el.addEventListener('keydown', el._focusTrap)
  },
  unmounted(el) {
    if (el._focusTrap) {
      el.removeEventListener('keydown', el._focusTrap)
      delete el._focusTrap
    }
  },
}
