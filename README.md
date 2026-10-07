# Fábrica de Matrículas · próximos passos

Apresentação para o **Recanto da Criança** (Centro Educacional Recanto da Criança
Interativo, Manaus) depois do
fechamento: as seis etapas, em quatro semanas, para a Fábrica de Matrículas entrar no ar
na escola, e as três decisões que ficam do lado do Recanto.

No ar: https://cauelimsia.github.io/fabrica-proximos-passos-apresentacao/

A rolagem da página dirige um filme contínuo de 104 s: partículas e trilho em three.js,
estações em HTML posicionadas em CSS 3D na mesma câmera, linha do tempo em GSAP.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3079/fabrica-proximos-passos-apresentacao/
```

`?t=42` na URL abre a página parada no segundo 42 do filme (conferência de cena).

## Navegação

| Tecla / gesto        | Ação                              |
| -------------------- | --------------------------------- |
| rolagem, toque       | avança e volta o filme            |
| `espaço`             | assistir / pausar                 |
| `→` `←`              | próximo capítulo / anterior       |
| trilho à direita     | pula para o capítulo              |

## Estrutura

```
src/features/show/
  show.tsx          casca: palco, textos, botões, rolagem e teclado
  show.css          palco (.sc-), estações de papel (.st-) e decisões (.dc-)
  timeline.ts       o filme: duração de cada capítulo e tudo que se move
  copy.ts           frases que aparecem sobre a cena
  data.ts           conteúdo das estações (exemplos de tela, nada é dado do Recanto)
  ui/panels.tsx     as seis estações e os cartões de decisão
  engine/world.ts   mapa do mundo: posição de cada estação, trilho e fecho
  engine/engine.ts  three.js: partículas, o "feito" 3D, trilho, piso e câmera
```

## Publicar

`main` guarda a fonte e `gh-pages` guarda o site gerado. A pasta `site/` (fora do git do
`main`) é um clone do `gh-pages`.

```bash
node tools/publicar.mjs "mensagem do commit"
```

## Conteúdo

- Prazo e etapas vêm do que foi combinado: quatro semanas, seis etapas.
- Turmas, nomes, conversa e números das telas são exemplos e estão marcados como tal.
- A base do atendente não recebe ficha de aluno, dado de saúde nem contrato assinado.
