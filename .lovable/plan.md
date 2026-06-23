Adicionar um botão de acesso ao portal administrativo no site.

## O que será feito

- Inserir um link/botão discreto "Acesso Admin" no `Header.tsx`.
- Posicionar o botão na versão desktop, ao lado dos links de navegação existentes.
- Incluir o mesmo botão no menu mobile (hambúrguer) para manter a consistência.
- O botão deve apontar para a rota `/auth`, já existente no projeto.
- Usar `<Link>` do TanStack Router para preservar navegação tipada, preload e acessibilidade.
- Aplicar estilo coerente com a identidade visual atual: fundo transparente com borda dourada (`border-gold`) e texto dourado, ou botão sólido dourado (`bg-gold`) conforme decidir o usuário na aprovação.
- Garantir que o botão não quebre o layout responsivo nem conflite com o menu mobile.

## Arquivos envolvidos

- `src/components/Header.tsx`

## Validação

- Verificar visualmente no preview se o botão aparece corretamente no desktop e no mobile.
- Confirmar que o clique redireciona para `/auth`.

## Notas técnicas

- Não serão alteradas regras de autenticação, rotas protegidas ou lógica de login.
- A mudança é puramente de interface/navegação.