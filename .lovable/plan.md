## Causa

Confirmei no banco: já existe o álbum rascunho do culto de 18/07 (`3202e98f...`), mas **as tabelas `galeria_albuns` e `galeria_fotos` continuam sem nenhum GRANT** para `anon`, `authenticated` ou `service_role`. A migração anterior de GRANTs não foi aplicada (provavelmente rejeitada/perdida). Sem grant de SELECT, o PostgREST bloqueia a leitura antes mesmo de avaliar a RLS — o admin não enxerga o álbum existente, mostra "Criar álbum" e o INSERT bate na `UNIQUE(evento_id)`.

As policies de RLS estão corretas (admin vê tudo, público vê só publicados). Falta só o grant.

## Correção

Uma única migração, sem tocar em código do app:

```sql
GRANT SELECT ON public.galeria_albuns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_albuns TO authenticated;
GRANT ALL ON public.galeria_albuns TO service_role;

GRANT SELECT ON public.galeria_fotos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_fotos TO authenticated;
GRANT ALL ON public.galeria_fotos TO service_role;
```

Depois disso, a aba Galeria do admin passa a listar o álbum já existente do culto de 18/07 e o botão vira **Gerenciar** em vez de **Criar álbum**, eliminando o erro de chave duplicada.
