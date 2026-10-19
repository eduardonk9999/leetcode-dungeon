/* Andar 1 · O Saguão: os dez clássicos de aquecimento. Vencer o chefe daqui abre os outros andares. */
addFloor({
  name: 'O Saguão',
  theme: 'Fundamentos',
  levels: [
{ id:'two-sum', lc:1, diff:'Easy', pattern:'Hash Map', fn:'twoSum', params:'nums, target', title:'Two Sum',
  monster:'Slime Indexador', sprite:'slime', pal:{k:'#0e1a10',g:'#58b552',L:'#a7e58c',w:'#f3efe2'},
  story:'Um slime guarda a ponte. Só passa quem achar as duas runas que somam o número gravado na pedra.',
  desc:`<p>Dado um array de inteiros <code>nums</code> e um inteiro <code>target</code>, retorne os <b>índices</b> dos dois números que somam <code>target</code>.</p><p>Existe exatamente uma resposta e você não pode usar o mesmo elemento duas vezes. A ordem dos índices não importa.</p>`,
  unordered:true,
  tests:[ {args:[[2,7,11,15],9],expect:[0,1]}, {args:[[3,2,4],6],expect:[1,2]}, {args:[[3,3],6],expect:[0,1]},
          {args:[[-1,-2,-3,-4,-5],-8],expect:[2,4]}, {args:[BIG,199995],expect:[99997,99998],label:'nums = [0, 1, …, 99999], target = 199995'} ],
  hints:['Para cada número x, o que você procura é target − x. Como saber em O(1) se esse valor já apareceu antes?','Use um Map de valor → índice. Em cada passo, verifique se o complemento já está no Map; só depois guarde o número atual.'],
  solution:`function twoSum(nums, target) {
  const seen = new Map(); // valor -> índice
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`, time:'O(n)', space:'O(n)',
  lesson:'Trocar o laço interno por uma consulta em Map é o truque mais cobrado em entrevista. Você gasta memória e derruba o tempo de O(n²) para O(n).' },

{ id:'contains-duplicate', lc:217, diff:'Easy', pattern:'Set', fn:'containsDuplicate', params:'nums', title:'Contains Duplicate',
  monster:'Gosma Repetida', sprite:'slime', pal:{k:'#0d1424',g:'#4a86d6',L:'#9cc6f2',w:'#f3efe2'},
  story:'Esta gosma se divide quando vê algo repetido. Descubra antes dela.',
  desc:`<p>Dado um array <code>nums</code>, retorne <code>true</code> se algum valor aparecer pelo menos duas vezes, e <code>false</code> se todos forem distintos.</p>`,
  tests:[ {args:[[1,2,3,1]],expect:true}, {args:[[1,2,3,4]],expect:false}, {args:[[1,1,1,3,3,4,3,2,4,2]],expect:true},
          {args:[[]],expect:false}, {args:[BIG],expect:false,label:'nums = [0, 1, …, 99999]'} ],
  hints:['Comparar cada par é O(n²) e não sobrevive ao teste de resistência.','Um Set guarda o que você já viu. Se o número já está lá, achou a duplicata.'],
  solution:`function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}`, time:'O(n)', space:'O(n)',
  lesson:'Set é o Map sem valor: perfeito para "já vi isso?". Também dá para ordenar e comparar vizinhos em O(n log n) sem memória extra.' },

{ id:'valid-anagram', lc:242, diff:'Easy', pattern:'Contagem', fn:'isAnagram', params:'s, t', title:'Valid Anagram',
  monster:'Morcego Embaralhado', sprite:'bat', pal:{k:'#140c20',g:'#7a4fb8',w:'#ffd36b'},
  story:'O morcego troca as letras dos nomes de quem entra. Prove que é o mesmo nome.',
  desc:`<p>Dadas duas strings <code>s</code> e <code>t</code>, retorne <code>true</code> se <code>t</code> for um anagrama de <code>s</code>: as mesmas letras, nas mesmas quantidades, em qualquer ordem.</p>`,
  tests:[ {args:['anagram','nagaram'],expect:true}, {args:['rat','car'],expect:false}, {args:['a','ab'],expect:false},
          {args:['listen','silent'],expect:true}, {args:['aacc','ccac'],expect:false} ],
  hints:['Se os tamanhos forem diferentes, já pode responder.','Conte as letras de s num objeto, depois desconte as de t. Se algum contador ficar negativo, não é anagrama.'],
  solution:`function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`, time:'O(n)', space:'O(k), k = letras distintas',
  lesson:'Contagem de frequência resolve uma família inteira: anagramas, agrupar anagramas, "primeiro caractere único". Ordenar as duas strings também funciona, em O(n log n).' },

{ id:'valid-palindrome', lc:125, diff:'Easy', pattern:'Dois Ponteiros', fn:'isPalindrome', params:'s', title:'Valid Palindrome',
  monster:'Morcego Espelhado', sprite:'bat', pal:{k:'#1c0b0e',g:'#b8434b',w:'#f3efe2'},
  story:'Ele só respeita frases que se leem igual nos dois sentidos.',
  desc:`<p>Uma frase é palíndromo se, depois de converter tudo para minúsculas e remover o que não for letra ou número, ela se lê igual de trás para frente.</p><p>Dada a string <code>s</code>, retorne <code>true</code> se ela for palíndromo.</p>`,
  tests:[ {args:['A man, a plan, a canal: Panama'],expect:true}, {args:['race a car'],expect:false}, {args:[' '],expect:true},
          {args:['0P'],expect:false}, {args:['Socorram-me, subi no onibus em Marrocos'],expect:true} ],
  hints:['Um ponteiro no começo e outro no fim, andando um em direção ao outro.','Pule caracteres que não sejam letra ou número com /[a-z0-9]/i e compare em minúsculas.'],
  solution:`function isPalindrome(s) {
  const ok = c => /[a-z0-9]/i.test(c);
  let l = 0, r = s.length - 1;
  while (l < r) {
    while (l < r && !ok(s[l])) l++;
    while (l < r && !ok(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++; r--;
  }
  return true;
}`, time:'O(n)', space:'O(1)',
  lesson:'Dois ponteiros vindo das pontas evitam criar uma string limpa e invertida. O mesmo padrão aparece em Container With Most Water e 3Sum.' },

{ id:'valid-parentheses', lc:20, diff:'Easy', pattern:'Pilha', fn:'isValid', params:'s', title:'Valid Parentheses',
  monster:'Esqueleto Desbalanceado', sprite:'skeleton', pal:{k:'#1a1424',g:'#e6dcc4',r:'#ec5d50'},
  story:'Os ossos dele estão fora de ordem. Feche cada abertura no lugar certo.',
  desc:`<p>Dada uma string com apenas <code>()[]{}</code>, retorne <code>true</code> se ela for válida: cada abertura fecha com o mesmo tipo e na ordem correta.</p>`,
  tests:[ {args:['()'],expect:true}, {args:['()[]{}'],expect:true}, {args:['(]'],expect:false}, {args:['([)]'],expect:false},
          {args:['{[]}'],expect:true}, {args:['('],expect:false}, {args:[')'],expect:false} ],
  hints:['O último que abriu é o primeiro que precisa fechar. Que estrutura funciona assim?','Empilhe aberturas. Ao ver um fechamento, desempilhe e confira o par. No fim, a pilha precisa estar vazia.'],
  solution:`function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (const c of s) {
    if (pairs[c]) {
      if (stack.pop() !== pairs[c]) return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}`, time:'O(n)', space:'O(n)',
  lesson:'Sempre que o problema fala em "o mais recente" ou em aninhamento, pense em pilha. Em JS, um array com push e pop já resolve.' },

{ id:'binary-search', lc:704, diff:'Easy', pattern:'Busca Binária', fn:'search', params:'nums, target', title:'Binary Search',
  monster:'Fantasma Bissetor', sprite:'ghost', pal:{k:'#20304a',g:'#b9d4e8',w:'#f3efe2',r:'#ec5d50'},
  story:'Ele se esconde num corredor ordenado. Corte o corredor ao meio até encurralá-lo.',
  desc:`<p>Dado um array <code>nums</code> ordenado em ordem crescente e um <code>target</code>, retorne o índice de <code>target</code> ou <code>-1</code> se não existir.</p><p>O objetivo é O(log n), então nada de <code>indexOf</code>.</p>`,
  tests:[ {args:[[-1,0,3,5,9,12],9],expect:4}, {args:[[-1,0,3,5,9,12],2],expect:-1}, {args:[[5],5],expect:0},
          {args:[[1,3],3],expect:1}, {args:[[2,4,6,8,10,12,14],2],expect:0} ],
  hints:['Olhe o meio. Se for menor que o alvo, a metade esquerda inteira pode ser descartada.','Use lo e hi, laço enquanto lo <= hi, e mova lo = mid + 1 ou hi = mid - 1.'],
  solution:`function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`, time:'O(log n)', space:'O(1)',
  lesson:'Os bugs da busca binária moram nas bordas: <= ou <, mid+1 ou mid. Decore este molde e adapte para "primeira posição onde a condição vira verdadeira".' },

{ id:'stock', lc:121, diff:'Easy', pattern:'Greedy', fn:'maxProfit', params:'prices', title:'Best Time to Buy and Sell Stock',
  monster:'Esqueleto Mercador', sprite:'skeleton', pal:{k:'#2a1c08',g:'#e7c25a',r:'#7ad0ff'},
  story:'Ele vende ouro amaldiçoado. Compre barato, venda caro, uma vez só.',
  desc:`<p><code>prices[i]</code> é o preço de uma ação no dia <code>i</code>. Escolha um dia para comprar e um dia <b>posterior</b> para vender.</p><p>Retorne o maior lucro possível, ou <code>0</code> se não der lucro.</p>`,
  tests:[ {args:[[7,1,5,3,6,4]],expect:5}, {args:[[7,6,4,3,1]],expect:0}, {args:[[2,4,1]],expect:2}, {args:[[1]],expect:0},
          {args:[[3,2,6,5,0,3]],expect:4} ],
  hints:['Se você vendesse hoje, qual seria o melhor dia para ter comprado?','Percorra uma vez guardando o menor preço visto até agora e o melhor lucro (preço atual − menor).'],
  solution:`function maxProfit(prices) {
  let min = Infinity, best = 0;
  for (const p of prices) {
    min = Math.min(min, p);
    best = Math.max(best, p - min);
  }
  return best;
}`, time:'O(n)', space:'O(1)',
  lesson:'Carregar "o melhor até aqui" numa variável transforma comparações entre pares em uma passada só. É a mesma ideia do Kadane, duas salas à frente.' },

{ id:'climbing-stairs', lc:70, diff:'Easy', pattern:'Prog. Dinâmica', fn:'climbStairs', params:'n', title:'Climbing Stairs',
  monster:'Espectro da Escadaria', sprite:'ghost', pal:{k:'#123224',g:'#8fe0b0',w:'#f3efe2',r:'#2b6b4a'},
  story:'Uma escada sem fim. Ele pergunta de quantas formas você consegue subir.',
  desc:`<p>Você sobe uma escada de <code>n</code> degraus dando passos de 1 ou 2 degraus. De quantas formas distintas dá para chegar ao topo?</p><p>Atenção ao teste com <code>n = 45</code>: recursão sem memória não termina a tempo.</p>`,
  tests:[ {args:[1],expect:1}, {args:[2],expect:2}, {args:[3],expect:3}, {args:[5],expect:8}, {args:[10],expect:89}, {args:[45],expect:1836311903} ],
  hints:['Para chegar ao degrau n, seu último passo veio do degrau n−1 ou do n−2.','formas(n) = formas(n−1) + formas(n−2). Calcule de baixo para cima guardando só os dois últimos valores.'],
  solution:`function climbStairs(n) {
  let a = 1, b = 1; // formas para os degraus i-2 e i-1
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}`, time:'O(n)', space:'O(1)',
  lesson:'É Fibonacci disfarçado. Programação dinâmica é isto: achar a recorrência e evitar recalcular subproblemas, com memo ou de baixo para cima.' },

{ id:'max-subarray', lc:53, diff:'Medium', pattern:'Kadane', fn:'maxSubArray', params:'nums', title:'Maximum Subarray',
  monster:'Magma de Kadane', sprite:'slime', pal:{k:'#2a0e06',g:'#e2662e',L:'#ffc04d',w:'#fff1c9'},
  story:'Um rio de lava com trechos quentes e frios. Encontre o trecho contínuo mais quente.',
  desc:`<p>Dado o array <code>nums</code>, encontre o subarray <b>contínuo</b> (com pelo menos um elemento) de maior soma e retorne essa soma.</p>`,
  tests:[ {args:[[-2,1,-3,4,-1,2,1,-5,4]],expect:6}, {args:[[1]],expect:1}, {args:[[5,4,-1,7,8]],expect:23}, {args:[[-3,-1,-2]],expect:-1},
          {args:[[8,-19,5,-4,20]],expect:21} ],
  hints:['Em cada posição, decida: continuar o subarray anterior ou começar um novo aqui?','cur = max(nums[i], cur + nums[i]); best = max(best, cur). Comece os dois com nums[0] para lidar com tudo negativo.'],
  solution:`function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`, time:'O(n)', space:'O(1)',
  lesson:'Kadane é DP com uma variável: o melhor subarray que termina em i. Se a soma acumulada ficou negativa, ela só atrapalha, então recomece.' },

{ id:'longest-substring', lc:3, diff:'Medium', pattern:'Janela Deslizante', fn:'lengthOfLongestSubstring', params:'s', title:'Longest Substring Without Repeating Characters', boss:true,
  monster:'Dragão da Janela Deslizante', sprite:'dragon', flip:true, pal:{k:'#0b1a14',g:'#3f9e78',L:'#a6e3b5',y:'#f0a23b',w:'#ffe28a'},
  story:'O chefe final. O sopro dele só para quando você mede a maior janela sem letras repetidas.',
  desc:`<p>Dada a string <code>s</code>, retorne o tamanho da maior substring sem caracteres repetidos.</p>`,
  tests:[ {args:['abcabcbb'],expect:3}, {args:['bbbbb'],expect:1}, {args:['pwwkew'],expect:3}, {args:[''],expect:0},
          {args:['dvdf'],expect:3}, {args:['abba'],expect:2}, {args:[' '],expect:1} ],
  hints:['Mantenha uma janela [start, i] sem repetições e expanda i um passo por vez.','Guarde num Map o último índice de cada caractere. Ao repetir, mova start para depois dele, mas nunca para trás (veja o caso "abba").'],
  solution:`function lengthOfLongestSubstring(s) {
  const last = new Map(); // char -> último índice
  let start = 0, best = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (last.has(c) && last.get(c) >= start) start = last.get(c) + 1;
    last.set(c, i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}`, time:'O(n)', space:'O(k)',
  lesson:'Janela deslizante: dois índices que só andam para frente, e uma estrutura que descreve o que está dentro da janela. Serve para Minimum Window Substring, Longest Repeating Character Replacement e muitos outros.' }
  ],
  /* modo guiado: [ferramenta que você já conhece, frase em português, código daquele passo] */
  guide: {
'two-sum': { think:'Com [2, 7, 11, 15] e alvo 9: olho o 2, faltam 7. Ainda não vi nenhum 7, então anoto "o 2 está na posição 0". Olho o 7, faltam 2. Já anotei o 2! Resposta: [0, 1].',
  plan:[
  ['objeto','Crie um objeto vazio para anotar cada número já visto e a posição dele.','const vistos = {};'],
  ['for','Ande por cada posição do array.','for (let i = 0; i < nums.length; i++) {'],
  ['variável','Calcule quanto falta para chegar no target.','const falta = target - nums[i];'],
  ['if','Se o que falta já está anotado, achou o par: devolva as duas posições.','if (vistos[falta] !== undefined) {\n  return [vistos[falta], i];\n}'],
  ['objeto','Senão, anote o número atual e a posição dele. Feche o for.','vistos[nums[i]] = i;\n}']]},
'contains-duplicate': { think:'Com [1, 2, 3, 1]: vejo o 1 e anoto. Vejo o 2, anoto. Vejo o 3, anoto. Vejo o 1 de novo: já estava anotado. Tem repetido, resposta true.',
  plan:[
  ['objeto','Crie um objeto vazio para anotar os números já vistos.','const vistos = {};'],
  ['for','Ande por cada número do array.','for (let i = 0; i < nums.length; i++) {\n  const n = nums[i];'],
  ['if','Se esse número já foi anotado, achou repetido: devolva true.','if (vistos[n]) return true;'],
  ['objeto','Senão, anote que ele apareceu. Feche o for.','vistos[n] = true;\n}'],
  ['return','Se o for terminou sem achar repetido, devolva false.','return false;']]},
'valid-anagram': { think:'"rat" e "car": conto as letras de rat: r=1, a=1, t=1. Agora desconto as de car: c? Não tenho nenhum c. Não é anagrama.',
  plan:[
  ['if','Se os tamanhos forem diferentes, já devolva false.','if (s.length !== t.length) return false;'],
  ['objeto','Crie um objeto para contar quantas vezes cada letra aparece.','const conta = {};'],
  ['for','Ande pelas letras de s somando 1 na contagem de cada uma.','for (let i = 0; i < s.length; i++) {\n  const letra = s[i];\n  conta[letra] = (conta[letra] || 0) + 1;\n}'],
  ['for + if','Ande pelas letras de t. Se a letra não tem saldo, devolva false. Se tem, tire 1.','for (let i = 0; i < t.length; i++) {\n  const letra = t[i];\n  if (!conta[letra]) return false;\n  conta[letra]--;\n}'],
  ['return','Se passou por tudo, é anagrama.','return true;']]},
'valid-palindrome': { think:'"race a car" vira "raceacar". Comparo a primeira com a última: r e r, ok. a e a, ok. c e c, ok. e e a: diferentes. Não é palíndromo.',
  plan:[
  ['variável','Deixe tudo minúsculo e remova o que não é letra ou número.',"const limpo = s.toLowerCase().replace(/[^a-z0-9]/g, '');"],
  ['variável','Crie dois marcadores: um no começo e outro no fim.','let esq = 0;\nlet dir = limpo.length - 1;'],
  ['while','Enquanto eles não se cruzarem, continue comparando.','while (esq < dir) {'],
  ['if','Se as letras das duas pontas forem diferentes, devolva false.','if (limpo[esq] !== limpo[dir]) return false;'],
  ['variável','Aproxime os marcadores um do outro. Feche o while.','esq++;\ndir--;\n}'],
  ['return','Se nunca achou diferença, é palíndromo.','return true;']]},
'valid-parentheses': { think:'"{[]}": abre {, guardo. Abre [, guardo em cima. Fecha ]: o último que guardei é [, combina, tiro. Fecha }: o último agora é {, combina. Sobrou nada guardado: válido.',
  plan:[
  ['objeto','Crie um objeto que diz qual abertura combina com cada fechamento.',"const par = { ')': '(', ']': '[', '}': '{' };"],
  ['array','Crie um array vazio para guardar as aberturas (a pilha).','const pilha = [];'],
  ['for','Ande por cada caractere da string.','for (let i = 0; i < s.length; i++) {\n  const c = s[i];'],
  ['if','Se for um fechamento, tire o último guardado e confira se é o par certo.','if (par[c]) {\n  const ultimo = pilha.pop();\n  if (ultimo !== par[c]) return false;\n}'],
  ['else','Se for abertura, guarde na pilha. Feche o for.','else {\n  pilha.push(c);\n}\n}'],
  ['return','No fim, só é válido se não sobrou nada aberto.','return pilha.length === 0;']]},
'binary-search': { think:'Procuro 9 em [-1, 0, 3, 5, 9, 12]. O meio é 3: 9 é maior, descarto a metade da esquerda. Sobra [5, 9, 12], o meio é 9. Achei, posição 4.',
  plan:[
  ['variável','Marque o começo e o fim da parte onde o alvo ainda pode estar.','let inicio = 0;\nlet fim = nums.length - 1;'],
  ['while','Enquanto ainda sobrar espaço para procurar, continue.','while (inicio <= fim) {'],
  ['variável','Ache a posição do meio.','const meio = Math.floor((inicio + fim) / 2);'],
  ['if','Se o meio é o alvo, devolva a posição.','if (nums[meio] === target) return meio;'],
  ['if / else','Se o meio é menor que o alvo, jogue fora a esquerda. Senão, jogue fora a direita. Feche o while.','if (nums[meio] < target) {\n  inicio = meio + 1;\n} else {\n  fim = meio - 1;\n}\n}'],
  ['return','Se o espaço acabou, o alvo não existe.','return -1;']]},
'stock': { think:'[7, 1, 5, 3, 6, 4]: o menor preço até agora vira 1 no dia 2. Vendendo a 5 lucro 4, a 3 lucro 2, a 6 lucro 5, a 4 lucro 3. O melhor foi 5.',
  plan:[
  ['variável','Guarde o menor preço visto até agora e o melhor lucro (começa em 0).','let menor = Infinity;\nlet lucro = 0;'],
  ['for','Ande por cada preço.','for (let i = 0; i < prices.length; i++) {\n  const p = prices[i];'],
  ['if','Se este preço é o menor até agora, ele vira o novo dia de compra.','if (p < menor) menor = p;'],
  ['if','Se vender hoje dá mais lucro que o melhor guardado, atualize. Feche o for.','if (p - menor > lucro) lucro = p - menor;\n}'],
  ['return','Devolva o melhor lucro.','return lucro;']]},
'climbing-stairs': { think:'1 degrau: 1 forma. 2 degraus: 2 formas (1+1 ou 2). 3 degraus: ou venho do degrau 2 ou do 1, então 2 + 1 = 3. 4 degraus: 3 + 2 = 5. Cada um é a soma dos dois anteriores.',
  plan:[
  ['if','Se n for 1 ou 2, a resposta é o próprio n.','if (n <= 2) return n;'],
  ['variável','Guarde as formas dos dois degraus anteriores: degrau 1 e degrau 2.','let antes = 1;\nlet agora = 2;'],
  ['for','Do degrau 3 até o n, calcule o próximo somando os dois anteriores e ande uma casa.','for (let i = 3; i <= n; i++) {\n  const proximo = antes + agora;\n  antes = agora;\n  agora = proximo;\n}'],
  ['return','Devolva as formas do último degrau.','return agora;']]},
'max-subarray': { think:'[-2, 1, -3, 4, -1, 2, 1]: soma -2, ruim, recomeço no 1. 1 + (-3) = -2, ruim, recomeço no 4. 4 - 1 = 3, + 2 = 5, + 1 = 6. A maior soma que vi foi 6.',
  plan:[
  ['variável','Guarde a soma do trecho atual e a melhor soma vista, as duas começando no primeiro número.','let atual = nums[0];\nlet melhor = nums[0];'],
  ['for','Ande a partir da segunda posição.','for (let i = 1; i < nums.length; i++) {'],
  ['if / else','Se a soma atual ficou negativa, ela só atrapalha: recomece neste número. Senão, some.','if (atual < 0) {\n  atual = nums[i];\n} else {\n  atual += nums[i];\n}'],
  ['if','Se a soma atual é a maior até agora, guarde. Feche o for.','if (atual > melhor) melhor = atual;\n}'],
  ['return','Devolva a melhor soma.','return melhor;']]},
'longest-substring': { think:'"abcabcbb": janela "abc" tem 3. Chega outro a: o a anterior estava na posição 0, então a janela começa na 1: "bca". Sempre que repete, pulo o começo para depois da repetição. O maior tamanho foi 3.',
  plan:[
  ['objeto','Crie um objeto que guarda a última posição em que cada letra apareceu.','const ultimaVez = {};'],
  ['variável','Guarde onde a janela começa e o maior tamanho encontrado.','let inicio = 0;\nlet maior = 0;'],
  ['for','Ande por cada letra.','for (let i = 0; i < s.length; i++) {\n  const letra = s[i];'],
  ['if','Se essa letra já apareceu dentro da janela atual, mova o começo para logo depois dela.','if (ultimaVez[letra] >= inicio) {\n  inicio = ultimaVez[letra] + 1;\n}'],
  ['objeto','Anote a posição atual da letra.','ultimaVez[letra] = i;'],
  ['if','Meça a janela. Se for a maior até agora, guarde. Feche o for.','const tamanho = i - inicio + 1;\nif (tamanho > maior) maior = tamanho;\n}'],
  ['return','Devolva o maior tamanho.','return maior;']]}
  }
});
