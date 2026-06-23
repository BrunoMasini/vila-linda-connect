## Diagnóstico

Cada aba do site tem partes editáveis e partes "fixas no código". Vou listar o estado atual e o que falta:

| Aba | Já editável no admin | O que ainda é texto fixo |
|---|---|---|
| **Página Inicial** | Banners do carrossel (aba Mídia) | Bloco "A PAZ DE CRISTO JESUS!" — título, parágrafos de boas-vindas e versículo |
| **Eventos** | Eventos da agenda + Aniversariantes | (nada) |
| **Gestão Ministerial** | Líderes (aba Biografias) | Subtítulo da página |
| **Faça a Obra** | (nada) | Versículo de cabeçalho + os 3 cards (Dízimos, Missões, Voluntariado) com título/texto/PIX/detalhes |
| **Contatos** | (nada) | Endereço, telefone, e-mail, redes sociais, mapa |

Eventos já está 100% editável. As outras quatro precisam ganhar edição no painel.

## O que será feito

### 1. Banco de dados — 3 novas tabelas

**a) `contatos_igreja`** (registro único, "configurações")
- endereço, telefone, whatsapp, e-mail
- Instagram, Facebook, YouTube (URLs, opcionais)
- URL do mapa (Google Maps embed)

**b) `pagina_textos`** (chave/valor para textos editáveis)
Guarda os textos das páginas que hoje são fixos:
- `home_titulo`, `home_paragrafo1`, `home_paragrafo2`, `home_versiculo`
- `ministerial_subtitulo`
- `obra_versiculo_topo`

Tabela simples com `chave` e `valor` — admin edita por formulário organizado por página.

**c) `obra_cards`** (CRUD completo, igual ao de Eventos/Líderes)
- ícone (Coração / Mão / Avião — seleção), título, texto, detalhe (ex.: chave PIX)
- ordem

Regras de acesso para as três:
- Visitantes podem **ler**.
- Apenas **admin** pode **criar/editar/excluir**.

Pré-preenchidas com os valores atuais que estão no site (você só ajusta).

### 2. Painel admin — 3 novas abas

Adicionar à barra do `/admin`, ao lado das existentes:
- **Página Inicial** — formulário com os textos de boas-vindas (título, parágrafos, versículo). Lembrete visual: "os banners do topo são editados na aba Mídia".
- **Faça a Obra** — campo de versículo do topo + lista CRUD dos cards (criar, editar, reordenar, excluir), com seletor de ícone.
- **Contatos** — formulário único com endereço, telefone, WhatsApp, e‑mail, links das redes sociais e URL do mapa. Validações de e‑mail/URL.

A aba **Gestão Ministerial** ganha um campo de subtítulo dentro da aba "Página Inicial" (ou aba própria pequena) — me diga qual prefere; vou seguir com **incluir junto na aba Página Inicial** por simplicidade.

### 3. Páginas públicas

- `/` (Home): bloco de boas-vindas passa a ler `pagina_textos`.
- `/ministerial`: subtítulo passa a ler `pagina_textos`.
- `/obra`: versículo do topo lê `pagina_textos`; cards listam `obra_cards`.
- `/contatos`: todos os campos leem `contatos_igreja`; cada rede social só aparece se preenchida; mapa usa a URL configurada.

Layout/visual permanecem iguais — só a origem dos textos muda.

### 4. Rodapé (Footer)
Sem alterações de conteúdo agora (hoje só mostra nome da igreja e ano). Se quiser que ele também mostre telefone/redes vindo do admin, me avise.

## Detalhes técnicos

- Migrations criam as 3 tabelas em `public` com GRANTs, RLS habilitado e policies: `SELECT` público + `ALL` para admin via `has_role(auth.uid(),'admin')`. Seed com os valores atuais.
- Novos arquivos:
  - `src/routes/_authenticated/admin.pagina-inicial.tsx`
  - `src/routes/_authenticated/admin.obra.tsx`
  - `src/routes/_authenticated/admin.contatos.tsx`
- Atualiza `src/routes/_authenticated/admin.tsx` (nav de abas) e `src/routes/_authenticated/admin.index.tsx` se houver redirect.
- Refatora `src/routes/index.tsx`, `ministerial.tsx`, `obra.tsx`, `contatos.tsx` para `useQuery` lendo das novas tabelas, mantendo fallback enquanto carrega.
- Formulários com `react-hook-form` + `zod`; toasts via `sonner`; estilo idêntico aos formulários já existentes.
