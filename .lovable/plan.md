## Plano para corrigir a visualização da galeria

Pelo que foi verificado:
- O álbum **“Culto na Direção da Irmãs”** existe, está publicado e tem **13 fotos** cadastradas.
- As fotos estão salvas como URLs assinadas de um bucket privado.
- A página pública `/galeria` mostra o álbum, mas a navegação/visualização do álbum precisa ficar mais robusta para visitantes.

## O que vou ajustar

1. **Corrigir a página interna do álbum**
   - Revisar `/galeria/$id` para garantir que o visitante consiga abrir o álbum ao clicar no cartão.
   - Tratar corretamente o carregamento das 13 fotos e o estado de erro quando a leitura falhar.
   - Evitar que a página fique sem conteúdo útil caso a consulta retorne álbum sem fotos por alguma regra de acesso.

2. **Melhorar o clique no álbum**
   - Garantir que o cartão da galeria leve de forma confiável para a rota do álbum.
   - Se necessário, trocar o link roteado por navegação explícita compatível com o padrão atual do app.

3. **Melhorar o lightbox das fotos**
   - Manter o clique em cada foto abrindo a visualização ampliada.
   - Preservar os botões de anterior/próxima, fechar e navegação por teclado.
   - Adicionar mensagens claras caso uma imagem não carregue.

4. **Validar no preview**
   - Abrir `/galeria`.
   - Clicar no álbum “Culto na Direção da Irmãs”.
   - Confirmar que a página do álbum mostra as 13 fotos.
   - Clicar em uma foto e confirmar que o lightbox abre corretamente.

## Observação técnica

A correção será focada no frontend da galeria pública e, se necessário, em pequenos ajustes de leitura das tabelas já existentes. Não vou recriar o álbum nem mexer nas fotos que você já enviou.