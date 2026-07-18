import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,ts,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/node_modules/**'],
  },
  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),
  {
    rules: {
      // Projeto pequeno, sem convenção de nomeação forçada pros componentes.
      'vue/multi-word-component-names': 'off',
      // <div v-html="..."> é usado deliberadamente pra ícones SVG confiáveis e markdown
      // já sanitizado por markdownParaHtmlSeguro() — não faz sentido o lint reclamar disso aqui.
      'vue/no-v-html': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Regras puramente de formatação HTML que o "recommended" do eslint-plugin-vue liga
      // por padrão, mas que conflitam com o estilo já consistente do projeto (atributos
      // agrupados numa linha, alinhamento com espaços múltiplos, elementos void sem
      // self-closing, etc.). Desligadas de propósito — reformatar ~40 arquivos inteiros
      // só por cosmética não é o objetivo do lint aqui, é pegar erro real.
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/attributes-order': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/no-multi-spaces': 'off',
    },
  },
]
