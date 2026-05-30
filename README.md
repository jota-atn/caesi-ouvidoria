# CAESI Ouvidoria

Frontend da ouvidoria do CAESI — Centro Acadêmico de Ciência da Computação da UFCG.
Desenvolvido para a disciplina de Engenharia de Software.

## Especificação do projeto

Documento completo: [Projeto Engenharia de Software](https://docs.google.com/document/d/1GczG7c4P32HvuVDDlvWGSI0YJzxiSTNTUNarAkjAnr0/edit?tab=t.0)

O projeto é composto por duas frentes:

**Sistema novo** — esta ouvidoria. Cobre as etapas de planejamento (tempo, custo, riscos), levantamento de requisitos funcionais e não-funcionais, prototipação, arquitetura, especificação formal (Alloy), implementação e testes.

**Sistema real** — análise do [JBake](https://github.com/jbake-org/jbake), gerador de sites estáticos em Java (>10 KLOC). Cobre coleta de métricas, identificação de bad smells (SpotBugs, PMD, Checkstyle), geração de testes automatizados (EvoSuite/Randoop) e refatoração com comparação antes/depois.

## Stack

- **Vue 3** com `<script setup>` (Composition API)
- **Vue Router 4** com lazy loading e guards de navegação
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

> Os dados são persistidos no `localStorage`. Para limpar, abra DevTools → Application → Local Storage → remover chaves `caesi_*`.

## Estrutura

```
src/
├── assets/
│   ├── styles.css          # ponto de entrada (imports)
│   ├── base.css            # variáveis, reset, tipografia
│   ├── layout.css          # wrappers, paper, headings
│   ├── buttons.css
│   ├── forms.css
│   ├── components/         # navbar, badges, cards, footer...
│   └── views/              # estilos por view (home, login, perfil...)
├── components/             # Badge, MsgCard, Navbar, NotifBell, SiteFooter, Tag...
├── router/index.js         # rotas + guards
├── stores/                 # auth, mensagens, notificacoes, usuarios, equipe
└── views/
    ├── admin/              # GeralView, PainelView, DetalheView, UsuariosView, EquipeView
    ├── aluno/              # MensagensView, NovaMensagemView, DetalheView, MensagemEnviadaView
    └── *.vue               # Home, Sobre, Estatuto, Contato, Login, Cadastro, Perfil
```

## Rotas

| Rota                     | Acesso | Descrição                      |
|--------------------------|--------|-------------------------------|
| `/`                      | Todos  | Landing page + envio anônimo  |
| `/sobre`                 | Todos  | Sobre o CAESI                 |
| `/estatuto`              | Todos  | Estatuto                      |
| `/contato`               | Todos  | Formulário de contato         |
| `/login`                 | Todos  | Login                         |
| `/cadastro`              | Todos  | Cadastro de aluno             |
| `/esqueci-senha`         | Todos  | Recuperação de senha          |
| `/perfil`                | Aluno  | Dados e senha do perfil       |
| `/aluno/mensagens`       | Aluno  | Lista de mensagens            |
| `/aluno/nova-mensagem`   | Aluno  | Enviar nova mensagem          |
| `/aluno/mensagem/:id`    | Aluno  | Detalhe e status              |
| `/admin/painel`          | Admin  | Visão geral (dashboard)       |
| `/admin/mensagens`       | Admin  | Gestão de mensagens           |
| `/admin/mensagens/:id`   | Admin  | Detalhe + ações               |
| `/admin/usuarios`        | Admin  | Gestão de usuários            |
| `/admin/equipe`          | Admin  | Edição da equipe CAESI        |
