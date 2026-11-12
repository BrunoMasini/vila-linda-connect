# Site ADMVL

Prompt para o Lovable

Copie e cole o texto abaixo no chat do Lovable para iniciar o projeto.

Quero construir um site institucional completo para a Igreja Assembleia de Deus – Ministério Vila Linda, com uma área pública (frontend) e um painel administrativo protegido (backend/CMS). Abaixo está a especificação completa do projeto.

Identidade Visual

Cor principal (fundo): Azul Marinho #0D233A

Cor de destaque (botões, links, ícones ativos): Dourado Ouro #D4AF37

Texto sobre fundo azul: Branco

Texto sobre fundo claro: Cinza Escuro #333333

Tipografia: fonte moderna e geométrica em negrito para títulos (estilo Montserrat), com bom contraste e legibilidade

Use gradientes radiais sutis em azul marinho para dar profundidade aos fundos sólidos.

1. Splash Screen (Tela de Entrada)

Primeira tela ao abrir ou recarregar o site:

Fundo azul marinho sólido em tela cheia, com leve gradiente radial.

Um versículo bíblico curto é sorteado aleatoriamente (de uma lista de ~500 versículos) a cada carregamento.

O texto do versículo aparece centralizado, em branco, com a referência (Livro, Capítulo, Versículo) abaixo em dourado.

Toda a tela é clicável, com a indicação "Clique sobre o versículo para entrar".

Ao clicar, transição em fade-out revela o site principal.

2. Cabeçalho Fixo

Barra de navegação fixa no topo, com o nome/logo da igreja à esquerda e 6 abas:

Página Inicial

Eventos

Gestão Ministerial

Bíblia Sagrada

Faça a Obra

Contatos

3. Página Inicial (Home)

Carrossel dinâmico no topo, exibindo banners/cartazes de eventos e avisos da semana (rotação automática).

Seção de boas-vindas com texto pastoral institucional sobre a história e os cultos da igreja.

4. Aba "Eventos"

Com duas sub-abas alternáveis por filtro (sem recarregar a página):

Agenda Geral: lista cronológica de cultos e atividades (Culto de Ensino, Culto da Família, Círculo de Oração, Reuniões de Departamentos). Cada item exibe um bloco de data destacado (dia/mês) em alto contraste.

Eventos Aniversários: galeria de cards dos aniversariantes do mês, cada card com foto, nome completo e data.

5. Aba "Gestão Ministerial"

Grade responsiva de cards de liderança (Pastor Presidente, Pastores Auxiliares, Dirigentes).

Cada card: foto em moldura azul escura, cargo em dourado, resumo breve, e botão "Ver Biografia" que expande o histórico completo.

6. Aba "Bíblia Sagrada"

Leitor bíblico nativo, sem redirecionar para sites externos:

Painel lateral com lista rolável separando Antigo e Novo Testamento.

Ao selecionar um livro, exibe grade numérica de capítulos.

Área de leitura à direita com números de versículo em dourado, fonte confortável e bom espaçamento.

Pode usar uma API pública de Bíblia em português (ex: bible-api ou similar) para popular os textos.

7. Aba "Faça a Obra"

Espaço para missões, dízimos, ofertas e voluntariado (informações institucionais e formas de contribuição).

8. Aba "Contatos"

Redes sociais, telefones e mapa de localização incorporado.

9. Painel Administrativo (/admin)

Área protegida por login (usuário e senha), com autenticação segura via Supabase Auth. Tela de login minimalista em azul marinho.

Após autenticado, o administrador acessa um CMS com 4 módulos:

9.1 Módulo de Eventos (Agenda Geral)

CRUD completo: criar, editar e excluir eventos.

Campos: data (calendário), horário (relógio), preletor/cantor convidado, descrição/avisos.

Alterações refletem em tempo real no site público.

9.2 Módulo de Mídia (Carrossel da Home)

Upload de imagens para o carrossel.

Definir ordem de exibição.

Remover banners de eventos já realizados.

9.3 Módulo de Biografias (Gestão Ministerial)

Listagem de pastores/líderes cadastrados.

Editor de texto formatável para biografia, cargo e nome.

Upload/substituição de foto de perfil.

9.4 Módulo de Aniversariantes

Upload de foto, nome e data de aniversário.

Pensado para cadastro antecipado (antes do início do mês).

Requisitos Técnicos

Usar Supabase como backend (banco de dados, autenticação e storage de imagens).

Design mobile-first e totalmente responsivo.

Tabelas sugeridas no banco: eventos, aniversariantes, lideres (biografias), banners (carrossel), e tabela de usuários administradores via Supabase Auth.

Todas as operações do CMS devem refletir em tempo real na área pública (sem necessidade de redeploy).

Comece implementando a estrutura geral (splash screen, cabeçalho fixo e página inicial com carrossel), depois seguimos para as demais abas e por fim o painel administrativo.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://vila-linda-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dafe8f68-aeb0-4b8c-b34d-47f7ca74d389).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
