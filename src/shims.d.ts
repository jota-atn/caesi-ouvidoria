/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any -- shim padrão do Vue+Vite, {}/any aqui são os defaults genéricos de props/emits/setup
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.svg?raw' {
  const content: string
  export default content
}
