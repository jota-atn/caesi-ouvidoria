export function notBlank(value) {
  return !!(value ?? '').toString().trim()
}

export function minLength(value, n) {
  return (value ?? '').toString().trim().length >= n
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value ?? '').toString().trim())
}

export function isUrl(value) {
  try {
    new URL((value ?? '').toString().trim())
    return true
  } catch {
    return false
  }
}

export function isPositiveNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0
}
