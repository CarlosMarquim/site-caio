# Site Dr. Caio Rodrigo: guia rápido

A pasta **`site/`** é o site completo, pronto para publicar. É HTML, CSS e JavaScript puros, sem etapa de build.

## Estrutura do projeto

```
Site Caio/
├── site/                     ← o site (é esta pasta que vai para o Netlify)
│   ├── index.html            landing page (conteúdo, SEO e dados estruturados)
│   ├── assets/css/styles.css visual, cores da marca, animações
│   ├── assets/js/main.js     menu do celular, vídeos, animações ao rolar
│   ├── assets/img/           fotos otimizadas (WebP + JPG/PNG)
│   ├── assets/video/         vídeos comprimidos para a web
│   ├── assets/logo/          logos da marca em SVG (azul e creme)
│   ├── assets/fonts/         fontes Marcellus e Montserrat
│   ├── netlify.toml          cache, segurança e redirecionamentos
│   ├── robots.txt, sitemap.xml, site.webmanifest, favicon.ico
└── MIDIAS/                   ← arquivos originais (não vão para o site)
    ├── *.mp4 e imagem_*.jpg  vídeos e imagens de procedimentos originais
    ├── fotos-ensaio/         as 30 fotos do ensaio em alta resolução
    ├── recortes-sem-fundo/   Dr. Caio recortado, PNG transparente em alta resolução
    └── guia-de-marca/        PDF do guia de marca (SATE)
```

## Ver no computador
Abra um terminal nesta pasta e rode:

```bash
python -m http.server 4173 --directory site
```

Depois acesse http://localhost:4173

## Publicar no Netlify
- **Mais simples:** em app.netlify.com, abra o site atual e vá em *Deploys*. Arraste a pasta `site` para a área de upload.
- O arquivo `netlify.toml` já configura cache, segurança e redirecionamentos das páginas antigas (`/manguito-rotador` etc.).

## O que o site tem hoje
- **Topo:** foto do Dr. Caio de terno cinza (foto 4866), sem fundo e cortada da cintura para cima, à direita no computador e antes do texto no celular. Ao lado do nome fica o logo CR azul, sem círculo.
- **Seções:** credenciais, sobre (com vídeo de apresentação), condições tratadas, tratamentos (artroscopia com vídeo, infiltração, ondas de choque, próteses), como é a consulta, depoimentos em vídeo, dúvidas frequentes, endereços e chamada final.
- **Botão fixo do WhatsApp** no canto inferior direito, verde #4FCE5D com o logo oficial, que abre a conversa com a mensagem pronta.
- **Animações:** os blocos deslizam e os textos aparecem com fade ao rolar, repetindo ao subir e descer. As imagens deslizam dentro das molduras. Tudo é desligado para quem ativa "reduzir movimento".
- **Acessibilidade para 70+:** texto de 18 a 19 px, contraste alto, botões grandes e vídeos com legendas.
- **SEO:** título e descrição com "ortopedista ombro cotovelo Brasília", dados estruturados (médico, clínicas, perguntas frequentes e vídeos), sitemap e imagem de compartilhamento.

## Antes de publicar, confira
1. **Domínio:** o site usa `https://drcaiorodrigo.netlify.app/` no canonical, no Open Graph, no sitemap e no schema. Se houver domínio próprio (ex.: `drcaiorodrigo.com.br`), faça localizar e substituir em `index.html`, `robots.txt` e `sitemap.xml`.
2. **"20+ anos":** o site antigo diz "20+ anos exclusivos em ombro e cotovelo". O guia de marca diz "mais de 15 anos de experiência". Confirme com o Dr. Caio qual número usar.
3. **Fonte dos títulos:** o guia de marca usa a fonte *Athena*, que é paga e não está disponível para web. O site usa a *Marcellus*, a alternativa gratuita mais próxima. Se houver licença web da Athena, basta trocar o arquivo em `assets/fonts/` e o `@font-face` em `styles.css`.
4. **Textos médicos:** as dúvidas frequentes e as descrições de condições foram escritas de forma prudente, sem promessas de resultado. Vale o Dr. Caio revisar. Os convênios aceitos não estão no site.
5. **Imagem de compartilhamento** (`assets/img/og-dr-caio-rodrigo.jpg`): ainda usa a foto de blazer bege. Dá para trocar pela foto do topo, se quiser.

## Páginas de procedimentos (próximo passo)
- Crie cada página como uma pasta: `site/manguito-rotador/index.html`, `site/capsulite-adesiva/index.html` etc. Assim os endereços ficam iguais aos do site antigo, o que é bom para o Google.
- Reaproveite o cabeçalho, o rodapé e o `styles.css` da landing.
- Ao publicar cada página, apague o redirecionamento correspondente no `netlify.toml` e transforme o card da condição na landing em link (há um comentário no HTML indicando onde).
- Adicione cada nova página ao `sitemap.xml`.

## Histórico de versões
O projeto usa Git. Para ver as versões salvas:

```bash
git log --oneline
```

Os vídeos originais e as fotos em alta resolução da pasta `MIDIAS/` ficam fora do Git por serem muito grandes, mas continuam guardados no disco.
