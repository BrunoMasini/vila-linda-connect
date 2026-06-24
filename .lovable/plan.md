## O que será feito

### 1. Nova aba "Cultos" no site

- Novo link **Cultos** no menu do header (entre Eventos e Gestão Ministerial).
- Página `/cultos` com duas sub-abas: **Igreja Sede** e **Igreja Filial**.
- Cada culto aparece como cartão com título, dia da semana/frequência e horário, no mesmo estilo visual de Eventos.

### 2. Edição via painel admin (CRUD completo)

- Nova aba **Cultos** em `/admin`.
- Para cada culto: título, descrição (ex.: "todo primeiro sábado do mês"), horário de início e fim, igreja (Sede / Filial), ordem de exibição.
- Pré-cadastra os 8 cultos que você listou (6 Sede + 3 Filial — Cura e Libertação aparece nas duas).

### 3. Foto de capa nos Eventos

- Adiciona campo **foto** (opcional) na tabela de eventos.
- Aba admin Eventos ganha upload de imagem (igual ao de Aniversariantes).
- Página pública `/eventos` exibe a foto no card quando houver.

### 4. Aniversariantes
- Já tem upload de foto funcionando hoje no admin. Sem alteração — confirmado.

## Detalhes técnicos

**Banco de dados (1 migração):**
- Cria `public.cultos` com `titulo`, `descricao`, `igreja` (enum: `sede`/`filial`), `hora_inicio`, `hora_fim`, `ordem`. Grants padrão, RLS: `SELECT` público + `ALL` para admin via `has_role()`. Seed com os 8 cultos.
- Cria bucket privado `eventos` (storage) e adiciona coluna `foto_url TEXT` em `public.eventos`. Policies admin-only para upload/delete.

**Arquivos novos:**
- `src/routes/cultos.tsx` (pública, com Tabs Sede/Filial)
- `src/routes/_authenticated/admin.cultos.tsx` (CRUD)

**Arquivos editados:**
- `src/components/Header.tsx` — adiciona link "Cultos"
- `src/routes/_authenticated/admin.tsx` — adiciona aba "Cultos"
- `src/routes/_authenticated/admin.eventos.tsx` — adiciona upload de foto
- `src/routes/eventos.tsx` — exibe foto no card da agenda
- `src/integrations/supabase/types.ts` — regenerado após migração

Formulários com `react-hook-form` + `zod`, toasts via `sonner`, upload reusando `uploadEAssinar` em `src/lib/storage.ts` (com novo bucket `eventos`). Visual idêntico ao restante do CMS.
