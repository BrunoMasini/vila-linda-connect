# Plano: Site AD Vila Linda

Site institucional completo com área pública e painel administrativo, usando Lovable Cloud (Supabase) para banco, autenticação e storage de imagens.

## Identidade visual (design system)

Tokens em `src/styles.css` (oklch):
- `--background`: azul marinho `#0D233A`
- `--primary` (destaque dourado): `#D4AF37`
- `--foreground`: branco em fundo escuro / cinza `#333` em fundo claro
- Gradiente radial sutil em azul marinho para profundidade
- Fonte: **Montserrat** (700/800 para títulos, 400/500 para corpo) via `@fontsource/montserrat`

## Estrutura de rotas (TanStack Start)

```
src/routes/
  __root.tsx                    -> shell, splash overlay, header fixo
  index.tsx                     -> Home (carrossel + boas-vindas)
  eventos.tsx                   -> Agenda + Aniversariantes (tabs)
  ministerial.tsx               -> Cards de liderança
  biblia.tsx                    -> Leitor bíblico
  obra.tsx                      -> Missões/dízimos/voluntariado
  contatos.tsx                  -> Contatos + mapa
  auth.tsx                      -> Login do admin
  _authenticated/
    route.tsx                   -> gate (gerenciado pela integração)
    admin.tsx                   -> layout do CMS com sub-nav
    admin.eventos.tsx
    admin.midia.tsx
    admin.biografias.tsx
    admin.aniversariantes.tsx
```

Cada rota pública tem `head()` com title/description/OG próprios.

## Splash screen

- Overlay full-screen renderizado em `__root.tsx`, controlado por estado em `sessionStorage` (mostra uma vez por sessão/recarga).
- Versículo sorteado de `src/data/versiculos.ts` (~500 entradas ACF — gerados a partir do conteúdo público de bibliaonline.com.br/acf; lista embutida no bundle).
- Click em qualquer lugar → fade-out 400ms → revela site.
- Texto branco centralizado, referência em dourado, instrução "Clique sobre o versículo para entrar".

## Páginas públicas

**Home**: carrossel (Embla) puxando `banners` do DB ordenado por `ordem`, autoplay 5s. Seção institucional textual abaixo.

**Eventos**: tabs (shadcn Tabs) — sem reload.
- Agenda Geral: lista de `eventos` ordenada por data, com bloco de data destacado (dia grande / mês).
- Aniversariantes: grid de cards do mês corrente (filtra `aniversariantes` por mês de `data_nascimento`).

**Gestão Ministerial**: grid responsivo de cards de `lideres`, foto em moldura azul, cargo dourado, botão "Ver Biografia" abre Dialog com bio completa.

**Bíblia Sagrada**: leitor nativo.
- Sidebar com lista de livros (AT/NT) — metadados estáticos em `src/data/biblia-livros.ts`.
- Ao selecionar livro: grid de capítulos.
- Ao selecionar capítulo: fetch via server function que chama `bible-api.com` (tradução em português, p.ex. `almeida`), cache no client via TanStack Query.

**Faça a Obra**: conteúdo institucional estático (textos sobre missões, dízimos, ofertas, voluntariado, PIX/dados bancários).

**Contatos**: cards de redes sociais, telefone, endereço, iframe do Google Maps.

## Painel admin (`/admin/*`)

- Login em `/auth` (email/senha via Supabase Auth, criado pelo dono via Lovable Cloud).
- Gate protegido pelo `_authenticated/route.tsx` gerenciado.
- Layout com sub-nav: Eventos | Mídia | Biografias | Aniversariantes.

**Eventos**: tabela + dialog de criar/editar (data via shadcn DatePicker, hora, preletor, descrição). Excluir com confirmação.

**Mídia (carrossel)**: upload para Supabase Storage bucket `banners`, lista com thumbnails, campo `ordem` editável, botão excluir.

**Biografias**: CRUD de líderes (nome, cargo, foto via Storage `lideres`, bio em textarea — markdown simples).

**Aniversariantes**: CRUD (nome, data, foto via Storage `aniversariantes`).

Todos os módulos invalidam queries via TanStack Query → reflete em tempo real no site público.

## Banco de dados (Lovable Cloud / Supabase)

Tabelas no schema `public`, todas com RLS:

- `eventos`: `id`, `data` (date), `hora` (time), `titulo`, `preletor`, `descricao`, `created_at`
- `aniversariantes`: `id`, `nome`, `data_nascimento` (date), `foto_url`
- `lideres`: `id`, `nome`, `cargo`, `foto_url`, `biografia`, `ordem`
- `banners`: `id`, `imagem_url`, `ordem`, `ativo` (bool)
- `user_roles` + enum `app_role` ('admin') + função `has_role()` (padrão Lovable)

**Políticas RLS**:
- SELECT público (`TO anon, authenticated`) em todas as 4 tabelas de conteúdo (são informações públicas do site).
- INSERT/UPDATE/DELETE só para `has_role(auth.uid(), 'admin')`.
- `user_roles`: SELECT só pelo próprio usuário; gerenciamento via Cloud.

**Storage buckets** (públicos para leitura): `banners`, `lideres`, `aniversariantes`. Upload restrito a admins.

## Stack técnica

- TanStack Start + React 19 + Tailwind v4 (já no projeto)
- Lovable Cloud (Supabase) — habilitar no início
- shadcn/ui: Tabs, Dialog, Card, Button, Calendar, Carousel, Form, Table
- TanStack Query para fetching/cache/invalidação
- `embla-carousel-react` (já vem com shadcn carousel)
- `@fontsource/montserrat`

## Ordem de implementação (num único build)

1. Habilitar Lovable Cloud + criar schema/tabelas/RLS/buckets + seed de versículos
2. Design tokens (styles.css) + fonte Montserrat
3. `__root.tsx`: header fixo com 6 abas + splash overlay
4. Home com carrossel (dados do DB)
5. Páginas: Eventos, Ministerial, Faça a Obra, Contatos
6. Leitor bíblico (server fn → bible-api)
7. Auth + layout admin + 4 módulos CRUD
8. Polimento responsivo mobile-first

Após habilitar o Cloud, você cria o primeiro usuário admin pelo painel Users do Cloud, e eu insiro o role `admin` para esse usuário via migration ou você atribui pelo SQL editor.
