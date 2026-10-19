# Como escrever um andar

Cada arquivo `levels/andar-NN.js` registra um andar com `addFloor`. A última sala da lista é o chefe do andar. O `index.html` carrega os arquivos na ordem e o validador confere tudo:

```bash
node tools/check.mjs levels/andar-05.js
```

O validador roda a **solução de referência** e o **código montado do modo guiado** contra todos os testes, usando o mesmo runtime do jogo (`js/runtime.js`), e garante que o código inicial vazio falha. Só entra sala com 0 erros.

Use `levels/andar-01.js` como modelo de tom e formato.

## Formato

```js
addFloor({
  name: 'As Correntes',          // nome do andar, em português, clima de masmorra
  theme: 'Linked List',          // o padrão que o andar treina
  levels: [ /* salas, da mais fácil para o chefe */ ],
  guide: { /* id da sala -> { think, plan } */ }
});
```

### Sala

| campo | o que é |
|---|---|
| `id` | slug único em kebab-case, ex. `'reverse-linked-list'` |
| `lc` | número do problema no LeetCode |
| `diff` | `'Easy'`, `'Medium'` ou `'Hard'` |
| `pattern` | padrão em português, curto: `'Hash Map'`, `'Dois Ponteiros'`, `'BFS'`… |
| `fn`, `params` | nome da função e parâmetros, iguais à assinatura JS do LeetCode |
| `title` | título oficial em inglês |
| `monster`, `sprite`, `pal`, `flip` | nome do monstro, sprite e paleta (tabela abaixo); `flip: true` espelha |
| `story` | uma frase de ambientação que liga o monstro ao problema |
| `desc` | HTML curto em `<p>`, com `<code>` nos nomes; escrito com suas palavras, não copiado do LeetCode |
| `tests` | pelo menos 5; os 2 primeiros aparecem como exemplos na tela |
| `hints` | 2 dicas, da mais vaga para a mais concreta |
| `solution` | solução de referência idiomática em JS |
| `time`, `space` | complexidade, ex. `'O(n)'` |
| `lesson` | 1 ou 2 frases: o padrão por trás e onde mais ele aparece |
| `inT`, `outT`, `cmp` | opcionais, ver abaixo |

### Testes

```js
{ args: [[2,7,11,15], 9], expect: [0,1] }
{ args: [BIG, 199995], expect: [99997, 99998], label: 'nums = [0, 1, …, 99999], target = 199995' }
```

- `args` tem um item por parâmetro. `BIG` (`[0..99999]`) e `range(n)` estão disponíveis para testes de resistência. Use `label` quando o argumento for grande ou ilegível.
- Cada execução tem 2,5 s. Um teste de resistência deve reprovar a solução ingênua (O(n²) com n = 100 000), mas a solução boa precisa passar com folga.
- Cubra casos de borda: vazio, um elemento, negativos, repetidos, o caso que pega o erro clássico.
- A resposta tem que ser única, ou o `cmp` tem que aceitar todas as respostas válidas.

### Estruturas de dados (`inT` / `outT`)

`inT` diz o tipo de cada argumento (um item por parâmetro; `null` = passa como está):

- `'list'`: array → `ListNode` (`[1,2,3]`)
- `'cycle'`: `{vals:[3,2,0,-4], pos:1}` → lista em que o último nó aponta para o índice `pos` (`-1` = sem ciclo)
- `'lists'`: array de arrays → array de `ListNode`
- `'tree'`: ordem por nível do LeetCode → `TreeNode` (`[3,9,20,null,null,15,7]`)
- `'node'`: valor → o nó com esse valor dentro do argumento `'tree'`

`outT` converte o retorno: `'list'` (ListNode → array), `'tree'` (TreeNode → ordem por nível), `'val'` (nó → `.val`).

`ListNode(val, next)` e `TreeNode(val, left, right)` existem como globais no editor, como no LeetCode.

### Comparação (`cmp`)

- sem `cmp`: igualdade exata (via JSON)
- `'unordered'`: a ordem do array não importa
- `'nested'` / `'groups'`: nem a ordem externa nem a das listas internas importam (subsets, 3Sum, group anagrams)
- `'outer'`: só a ordem externa não importa; a interna sim (permutações)
- `'float'`: número com tolerância 1e-5

### Modo guiado

```js
guide: {
  'reverse-linked-list': {
    think: 'Resolução à mão do primeiro exemplo, como uma pessoa faria, em 2–4 frases.',
    plan: [
      ['variável', 'Frase curta em português dizendo o que fazer.', 'let anterior = null;'],
      ['while', 'Enquanto ainda houver nó, …', 'while (atual) {'],
      // …
    ]
  }
}
```

- Cada passo é `[ferramenta, frase, código]`. A ferramenta é algo que um iniciante já conhece: `variável`, `for`, `while`, `if`, `if / else`, `objeto`, `array`, `função`, `return`, `recursão`…
- Os códigos de todos os passos, colados em ordem dentro da função, **precisam formar a solução completa** (o validador testa). Feche chaves no passo em que a frase diz "Feche o for".
- Prefira código de iniciante no guia: nomes em português, objeto `{}` e array antes de `Map`. A solução de referência pode ser mais idiomática.
- De 3 a 8 passos.

## Sprites e paletas

Cada sprite usa letras que a `pal` precisa definir; `k` é sempre o contorno escuro.

| sprite | letras |
|---|---|
| `slime` | k g L w |
| `bat` | k g w |
| `skeleton` | k g r |
| `ghost` | k g w r |
| `dragon` | k g L y w (use `flip: true`) |
| `spider` | k g L w r |
| `eye` | k g L w r |
| `golem` | k g L y |
| `snake` | k g L w r |
| `mimic` | k g y w r |

Varie sprite e paleta entre as salas do andar. O chefe aparece maior na tela.

## Texto

- Português do Brasil, frases curtas e diretas. Títulos dos problemas em inglês, como no LeetCode.
- Sem travessão (—). Use vírgula, dois-pontos ou ponto.
