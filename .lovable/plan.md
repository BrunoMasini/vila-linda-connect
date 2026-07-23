## O que será feito

### 1. Nova aba "Galeria" no menu público
- Link **Galeria** no header (entre Cultos e Gestão Ministerial).
- Página `/galeria` lista os álbuns publicados, em grid de cards com foto de capa, título do evento, data e contagem de fotos.
- Clicar num álbum abre `/galeria/$id` com grid de todas as fotos e lightbox (clique = ampliar, setas para navegar, ESC/clique fora fecha).
- Só aparecem álbuns marcados como **publicados** pelo admin.

### 2. CRUD de álbuns no painel admin
- Nova aba **Galeria** em `/admin`.
- Lista todos os eventos (passados e futuros) com um botão por evento:
  - "Criar álbum" (quando ainda não existe) ou
  - "Gerenciar álbum" (quando já existe).
- Dentro do álbum do evento: toggle **Publicado / Rascunho**, upload de múltiplas fotos de uma vez, reordenar, definir foto de capa e excluir fotos individualmente.
- Ao excluir o álbum, as fotos do storage também são removidas.

### 3. Comportamento
- Todo evento cadastrado pode receber um álbum — não há restrição de data. Você decide quando ativar (publicar) para aparecer na Galeria pública.
- Se não houver capa definida manualmente, usa a primeira foto do álbum. Se o evento tiver `foto_url`, ele é oferecido como sugestão inicial de capa.

## Detalhes técnicos

**Banco (1 migração):**
- `public.galeria_albuns`: `evento_id` (FK → eventos, ON DELETE CASCADE, UNIQUE), `publicado` (bool default false), `capa_url` (nullable), timestamps.
- `public.galeria_fotos`: `album_id` (FK → galeria_albuns, ON DELETE CASCADE), `url`, `ordem` (int), timestamps.
- GRANTs: `SELECT` para `anon`+`authenticated`, `ALL` para admin via `has_role()` e `service_role`. RLS habilitado.
- Policies públicas de leitura filtram `publicado = true` no álbum (e join nas fotos).
- Bucket privado **`galeria`** criado via tool (URLs assinadas de 10 anos, mesmo padrão dos outros buckets).

**Arquivos novos:**
- `src/routes/galeria.tsx` — lista de álbuns publicados
- `src/routes/galeria.$id.tsx` — álbum com lightbox
- `src/routes/_authenticated/admin.galeria.tsx` — CRUD (lista de eventos + dialog de gerenciamento)

**Arquivos editados:**
- `src/components/Header.tsx` — adiciona link "Galeria"
- `src/routes/_authenticated/admin.tsx` — adiciona aba "Galeria"
- `src/lib/storage.ts` — inclui `"galeria"` nos tipos de bucket aceitos
- `src/integrations/supabase/types.ts` — regenerado após a migração

Upload múltiplo com `Promise.all` reusando `uploadEAssinar`. Lightbox implementado com componente próprio simples (sem nova dependência). Visual consistente com o resto do site (cards escuros, dourado nos acentos).
