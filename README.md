# CAESI

Site do Centro Acadêmico de Ciência da Computação da UFCG — plataforma centralizada de comunicação entre o CA e os alunos. Projeto da disciplina de Engenharia de Software.

Especificação completa: [Projeto Engenharia de Software](https://docs.google.com/document/d/1GczG7c4P32HvuVDDlvWGSI0YJzxiSTNTUNarAkjAnr0/edit?tab=t.0)

## Stack

- **Vue 3** (`<script setup lang="ts">`, Composition API) + **Vue Router 4**
- **TypeScript** — stores, composables e utils 100% TS; quase todas as views também
- **Vite 6**
- **CSS vanilla** — sistema de design próprio, sem framework externo (nada de Tailwind/gradiente — cores chapadas + sombra dura)
- `leaflet` (mapa do campus), `marked` (markdown no Mural), `chart.js`/`vue-chartjs` (gráficos)
- Persistência em `localStorage` — **sem backend ainda**, tudo mockado no frontend

## Qualidade e CI

- **ESLint** (Vue 3 + TypeScript) — `npm run lint`
- **vue-tsc** — checagem de tipos — `npm run type-check`
- **Vitest** — 117 testes (stores) — `npm run test:run`
- GitHub Actions roda lint + type-check + testes + build a cada push/PR em `main`

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Acesso admin

Login em `/admin` com senha `caesi2025` (sem usuário/matrícula — é a única forma de autenticação hoje). Não existe cadastro/login de aluno; visitantes acessam tudo publicamente sem conta.

Membros do workspace de tasks acessam via link único (`/workspace/:token`), sem login.

> Dados ficam no `localStorage` do navegador. Pra limpar, DevTools → Application → Local Storage → remover chaves `caesi_*`.

## Módulos

| Módulo | Rotas públicas | Rota admin |
|---|---|---|
| Ouvidoria (tickets) | `/`, `/ouvidoria/consulta` | `/admin/mensagens` |
| Mural | `/mural`, `/mural/:id` | `/admin/mural` |
| Formulários e eventos | `/formularios`, `/formularios/:id` | `/admin/formularios` |
| Calendário | seção da Home (`/#calendario`) | `/admin/calendario` |
| Mapa do campus | seção da Home (`/#mapa`) | `/admin/mapa` |
| Portal (artefatos) | `/portal`, `/portal/:id` | `/admin/portal` |
| Informações (editais, Tamburetei, professores, laboratórios) | `/informacoes/*` | `/admin/informacoes/*` |
| Tasks + workspace de membros | `/workspace/:token` | `/admin/tasks` |
| Equipe / Quem Somos | `/admin/equipe` |
| Estatuto | `/estatuto` | — (conteúdo estático) |

Calendário e Mapa vivem como seções interativas da Home (não são páginas próprias) — admin logado pode criar/editar/excluir eventos e estruturas direto por lá, além das telas de gestão dedicadas.

## Estrutura

```
src/
├── assets/              # CSS global (base, layout, buttons, forms + por view/componente)
├── components/          # Navbar, SiteFooter, CalendarioSecao, MapaSecao, Modal, EmptyState...
├── composables/         # usePagination, usePersistedFilter, useEscapeKey...
├── utils/               # imagem, markdown, validation (TS)
├── router/index.js      # rotas + guard de admin
├── stores/               # um arquivo .ts por domínio (auth, mensagens, mural, formularios,
│                         # calendario, mapa, portal, informacoes, equipe, tasks, conquistas,
│                         # toast) — cada um encapsula seu próprio localStorage + testes (*.test.ts)
└── views/
    ├── admin/           # telas de gestão (uma por módulo)
    └── *.vue            # telas públicas
```

## Estado do projeto

Todos os módulos de frontend da especificação estão implementados (mockados, sem backend). A base já está em ritmo de produção: TypeScript, ESLint e 117 testes automatizados rodando no CI a cada push. Falta integrar com a API real (FastAPI + MySQL + S3, conforme especificação), evoluir a autenticação (JWT + Google OAuth) e fechar os últimos pontos de UX (loading/erro/retry nas chamadas futuras à API).
