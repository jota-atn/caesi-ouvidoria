import { marked, type MarkedOptions } from 'marked'
import DOMPurify from 'dompurify'

// Converte Markdown pra HTML seguro pra usar com v-html. marked() sozinho não
// remove HTML perigoso do texto de entrada (<script>, onerror, etc.) — quem
// escreve o post (hoje só admin) poderia injetar isso, então sempre passa
// pelo DOMPurify antes de qualquer v-html.
export function markdownParaHtmlSeguro(texto: string, opcoesMarked?: MarkedOptions): string {
  const html = marked.parse(texto || '', opcoesMarked) as string
  return DOMPurify.sanitize(html)
}
