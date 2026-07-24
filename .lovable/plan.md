## Diagnóstico confirmado

O álbum do evento **“Culto na Direção da Irmãs” (18/07/2026)** já existe no banco, em rascunho. Também confirmei que os GRANTs atuais já estão aplicados e não são mais a causa provável.

O problema restante está no fluxo do admin: a tela ainda depende do relacionamento embutido `eventos -> galeria_albuns`. Quando essa leitura não retorna o álbum por qualquer motivo de cache/relacionamento/RLS, a interface mostra **Criar álbum**, mas o banco bloqueia porque já existe `UNIQUE(evento_id)`.

## Plano de correção

1. **Trocar a leitura da aba Galeria para ser à prova de falha**
   - Buscar `eventos` e `galeria_albuns` em consultas separadas.
   - Montar no frontend um mapa por `evento_id`.
   - Assim, se o álbum já existe, o botão sempre vira **Gerenciar**.

2. **Blindar o botão “Criar álbum” contra duplicidade**
   - Antes de inserir, consultar se já existe álbum para o evento.
   - Se existir, não tentar inserir de novo; atualizar a tela e abrir/mostrar como existente.
   - Se ainda assim houver conflito, tratar o erro de duplicidade como “álbum já existe”, e não como falha para o usuário.

3. **Melhorar a experiência do admin**
   - Trocar o texto/estado automaticamente após criar ou detectar álbum existente.
   - Manter publicação, upload, capa e exclusão como estão.

4. **Verificação real**
   - Acessar a aba Galeria no preview autenticado quando possível.
   - Confirmar que o evento de 18/07 aparece como **Gerenciar**, não **Criar álbum**.
   - Confirmar que clicar em criar para eventos sem álbum não gera erro de chave duplicada.

## Arquivos a alterar

- `src/routes/_authenticated/admin.galeria.tsx`

Não vou fazer nova migração agora, porque a checagem no banco já confirmou que as permissões existem; a correção deve ser no fluxo da tela e na proteção contra duplicidade.