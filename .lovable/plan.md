## Causa do erro

As tabelas `galeria_albuns` e `galeria_fotos` foram criadas com RLS e policies corretas, mas **sem `GRANT`s** para os papéis do PostgREST. Sem grant de `SELECT`, o embed que a aba Galeria do admin faz (`eventos → galeria_albuns → galeria_fotos`) volta vazio mesmo quando o álbum existe. Resultado: a lista mostra "—" e o botão "Criar álbum", e ao clicar tenta inserir um segundo álbum para o mesmo evento — violando `galeria_albuns_evento_id_key`.

Confirmado no banco: já existe um álbum (rascunho) para o evento "Culto na Direção da Irmãs" (18/07), mas o admin não o enxerga.

## Correção (uma migração)

Adicionar os GRANTs que faltaram:

```sql
GRANT SELECT ON public.galeria_albuns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_albuns TO authenticated;
GRANT ALL ON public.galeria_albuns TO service_role;

GRANT SELECT ON public.galeria_fotos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.galeria_fotos TO authenticated;
GRANT ALL ON public.galeria_fotos TO service_role;
```

RLS continua controlando quem vê o quê:
- Público (anon/authenticated) só vê álbuns com `publicado = true` e suas fotos.
- Admin vê e gerencia tudo (policies já existentes usando `has_role`).

Nenhuma mudança em código do app é necessária — depois da migração, a aba Galeria do admin passa a listar o álbum já existente e o botão vira "Gerenciar" em vez de "Criar álbum".