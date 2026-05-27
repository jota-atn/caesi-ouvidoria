# CAESI Ouvidoria

Frontend da ouvidoria do CAESI — Centro Acadêmico de Ciência da Computação da UFCG.

Protótipo desenvolvido para a disciplina de Engenharia de Software.

## Stack

- **Vue 3** com `<script setup>` (Composition API)
- **Vue Router 4** — SPA com guards de navegação
- **Vite 6**
- **CSS vanilla** — sistema de design próprio, sem framework externo

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Credenciais de teste

| Perfil | Identificador | Senha   |
|--------|---------------|---------|
| Admin  | `admin`       | `admin` |
| Aluno  | cadastre-se   | —       |

> Os dados são persistidos no `localStorage` do navegador. Para limpar, abra o DevTools → Application → Local Storage → limpar chaves `caesi_*`.

## Estrutura do projeto

```
src/
├── assets/
│   └── styles.css          # CSS global e sistema de design
├── components/
│   ├── Badge.vue            # Badge de status (pendente/atendida)
│   ├── MsgCard.vue          # Card de mensagem reutilizável
│   ├── Navbar.vue           # Navbar interna (aluno/admin)
│   ├── PublicNavbar.vue     # Navbar pública (home, sobre, contato)
│   ├── SiteFooter.vue       # Rodapé do site
│   └── Tag.vue              # Tag de categoria
├── router/
│   └── index.js             # Rotas + guards de navegação
├── stores/
│   ├── auth.js              # Estado de autenticação + localStorage
│   ├── mensagens.js         # CRUD de mensagens + localStorage
│   └── usuarios.js          # Cadastro e validação de usuários
└── views/
    ├── admin/
    │   ├── DetalheView.vue  # Detalhe da mensagem (ações admin)
    │   └── PainelView.vue   # Painel de gestão
    ├── aluno/
    │   ├── DetalheView.vue      # Detalhe read-only
    │   ├── MensagemEnviadaView.vue
    │   ├── MensagensView.vue
    │   └── NovaMensagemView.vue
    ├── CadastroView.vue
    ├── ContatoView.vue
    ├── EstatutoView.vue
    ├── HomeView.vue         # Landing page + envio direto
    ├── LoginView.vue
    └── SobreView.vue
```

## Rotas

| Rota                    | Acesso | Descrição                           |
|-------------------------|--------|-------------------------------------|
| `/`                     | Todos  | Landing page + envio direto/anônimo |
| `/sobre`                | Todos  | Sobre o CAESI                       |
| `/estatuto`             | Todos  | Estatuto (WIP)                      |
| `/contato`              | Todos  | Formulário de contato               |
| `/login`                | Todos  | Login                               |
| `/cadastro`             | Todos  | Cadastro de aluno                   |
| `/aluno/mensagens`      | Aluno  | Lista de mensagens do aluno         |
| `/aluno/nova-mensagem`  | Aluno  | Enviar nova mensagem                |
| `/aluno/mensagem/:id`   | Aluno  | Detalhe e status da mensagem        |
| `/admin/painel`         | Admin  | Painel de todas as mensagens        |
| `/admin/mensagem/:id`   | Admin  | Detalhe + ações (status, nota)      |

## Docs

A pasta `docs/` contém o documento de especificação do projeto para a disciplina.

A pasta `prototype/` contém os protótipos HTML estáticos produzidos antes da implementação em Vue.
