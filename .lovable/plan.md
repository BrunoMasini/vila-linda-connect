Plano: trocar o logo do site pela imagem enviada

1. Verificar/validar a imagem enviada (`WhatsApp_Image_2026-06-22_at_11.28.39.jpeg`) e identificar se precisa de recorte ou fundo transparente.

2. Fazer upload da imagem para a CDN do Lovable Assets (para não pesar o repositório):
   - Criar o ponteiro em `src/assets/logo-admvl.png.asset.json` com URL CDN.

3. Atualizar `src/components/Header.tsx`:
   - Substituir o badge circular com as letras "AD" pela imagem do logo.
   - Manter o redirecionamento para a home (`to="/"`) e o comportamento de fechar o menu mobile.
   - Ajustar tamanho para caber no cabeçalho (ex.: `h-10 w-10` ou `h-12 w-12`, redondo, `object-contain`) sem quebrar a altura do header.
   - Garantir `alt` descritivo para acessibilidade.

4. Manter o texto ao lado do logo ("Assembleia de Deus / Ministério Vila Linda") como está, já que a imagem é o emblema circular e o layout atual separa o ícone do nome.

5. Verificar se algum outro componente reutiliza o logo (SplashScreen, Footer, favicon) e, se houver, atualizar consistentemente.

6. Validar visualmente no preview: logo carregando, proporção preservada, layout do header inalterado.