# Como escrever uma lição

Cada sala com lição vira um nó na trilha. A lição dura uns **5 minutos**: de 6 a 8 cards rápidos que levam da intuição ao código, e o último card é sempre um trecho de código que roda contra os testes de verdade da sala. O problema completo (a batalha) continua disponível depois da lição e como chefe do andar.

Os arquivos ficam em `lessons/andar-NN.js` e chamam `addLessons({ 'id-da-sala': { cards: [...] } })`, usando o mesmo `id` da sala em `levels/`. Valide com:

```bash
node tools/check.mjs lessons/andar-01.js
```

Use a lição `two-sum` em `lessons/andar-01.js` como modelo.

## Arco da lição

Uma boa lição segue esta ordem, mais ou menos:

1. **Intuição** (`choice`): qual é a ideia central? O que você procura, que estrutura usar, por que a força bruta não serve.
2. **Plano** (`order`): monte os passos na ordem. Sem `steps`, usa as frases do modo guiado da sala.
3. **Código por partes** (`blank`): complete as lacunas do trecho principal.
4. **Rodar de cabeça** (`output`): o que uma chamada devolve. Escolha uma entrada que pegue quem entendeu errado.
5. **Erro clássico** (`bug`): a linha que quebra a solução, de preferência o bug que as pessoas realmente cometem.
6. **Código** (`code`): o jogador escreve 1 a 3 linhas dentro de uma solução quase pronta.

Pode ter um segundo `choice` (complexidade, caso de borda) ou um segundo `blank`, mas não passe de 8 cards.

## Tipos de card

Todo card tem `type` e `q` (a pergunta; aceita HTML simples: `<code>`, `<b>`). Os de resposta fechada têm `why`: a explicação curta que aparece depois de responder, certo ou errado. Escreva o `why` para quem errou entender.

### `choice`

```js
{ type:'choice', q:'Qual estrutura…?', opts:['A', 'B', 'C', 'D'], a:0, why:'…' }
```
3 ou 4 opções, `a` é o índice da certa (a tela embaralha). Distratores plausíveis, não bobos.

### `order`

```js
{ type:'order', q:'Monte o plano na ordem certa.' }                  // usa o plano do modo guiado
{ type:'order', q:'…', steps:['primeiro', 'segundo', 'terceiro'] }  // ou passos próprios, já na ordem certa
```
3 a 6 passos é o ideal; frases curtas.

### `blank`

```js
{ type:'blank', q:'Complete as lacunas.', code:'const need = ___ - nums[i];', bank:['target', 'need', 'i'], a:['target'], why:'…' }
```
`___` marca cada lacuna; `a` tem uma resposta por lacuna, na ordem; `bank` tem as respostas e **pelo menos 2 distratores**, sem repetição. Fichas curtas (um nome, um operador, uma expressão pequena).

### `output`

```js
{ type:'output', q:'O que esta chamada devolve?', args:[[3,2,4], 6], opts:['[0,1]', '[1,2]', '[0,2]'], a:1, why:'…' }
```
`args` segue os parâmetros da função. Cada opção é **JSON válido** (`'true'`, `'3'`, `'[1,2]'`, `'"abc"'`). O validador roda a solução de referência e confere que só a opção `a` está certa. Quando a função devolve booleano, use só `opts:['true', 'false']`, sem distrator inventado.

### `bug`

```js
{ type:'bug', q:'Qual linha quebra…?', lines:['linha 1', 'linha 2', '…'], a:2, why:'…' }
```
Código curto (4 a 8 linhas), uma linha errada só. Diga na pergunta o sintoma ("devolve X para Y").

### `code`

```js
{ type:'code', q:'Escreva a linha que falta: …',
  template:'function twoSum(nums, target) {\n  …\n/*>>*/\n  …\n}',
  answer:'    if (seen.has(need)) return [seen.get(need), i];',
  placeholder:'    // dica curta do que escrever',
  hint:'Uma dica com <code>código</code>.' }
```
`template` é a solução inteira com `/*>>*/` no lugar do trecho que o jogador escreve (sozinho numa linha). `answer` é esse trecho, com indentação. O validador exige que **template + answer passe em todos os testes** da sala e que o **template vazio falhe**. Peça só 1 a 3 linhas: o miolo da ideia, não o boilerplate.

## Texto

- Português do Brasil, frases curtas. Nomes de código em `<code>`.
- Sem travessão (—). Use vírgula, dois-pontos ou ponto.
- A pergunta tem que caber na tela do celular: 1 ou 2 linhas.
