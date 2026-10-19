/* Andar 7 · O Poço dos Ecos: heap para achar "os maiores" sem ordenar tudo, e backtracking para explorar escolhas e desfazer na volta. */
addFloor({
  name: 'O Poço dos Ecos',
  theme: 'Heap & Backtracking',
  levels: [
{ id:'kth-largest', lc:215, diff:'Medium', pattern:'Heap', fn:'findKthLargest', params:'nums, k', title:'Kth Largest Element in an Array',
  monster:'Golem do Monte', sprite:'golem', pal:{k:'#17120c',g:'#7d6a58',L:'#b9a68e',y:'#ffb347'},
  story:'O golem é feito de pedras empilhadas, a menor sempre no topo. Ele só cede quando você disser qual pedra ocupa o k-ésimo lugar.',
  desc:`<p>Dado um array de inteiros <code>nums</code> e um inteiro <code>k</code>, retorne o <b>k-ésimo maior</b> elemento.</p><p>É o k-ésimo na ordem decrescente, contando repetidos: em <code>[3, 3, 1]</code> o 2º maior é <code>3</code>. Dá para resolver sem ordenar o array inteiro.</p>`,
  tests:[ {args:[[3,2,1,5,6,4],2],expect:5}, {args:[[3,2,3,1,2,4,5,5,6],4],expect:4}, {args:[[1],1],expect:1},
          {args:[[-1,-1],2],expect:-1}, {args:[[7,6,5,4,3,2,1],7],expect:1}, {args:[[2,1],1],expect:2},
          {args:[BIG,50000],expect:50000,label:'nums = [0, 1, …, 99999], k = 50000'},
          {args:[range(100000).map(i => (i * 7919) % 1000 - 500),1],expect:499,label:'nums = 100 000 valores entre -500 e 499, embaralhados, k = 1'} ],
  hints:['Você não precisa da ordem completa. Basta guardar os k maiores que viu até agora e saber qual é o menor deles.','Mantenha um heap mínimo com no máximo k números. Se chegar um número maior que o topo, ele substitui o topo. No fim, o topo é a resposta.'],
  solution:`function findKthLargest(nums, k) {
  const heap = []; // heap mínimo com os k maiores vistos até agora
  const swap = (a, b) => { [heap[a], heap[b]] = [heap[b], heap[a]]; };
  const up = i => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[p] <= heap[i]) return;
      swap(p, i); i = p;
    }
  };
  const down = i => {
    for (;;) {
      const l = 2 * i + 1, r = l + 1;
      let m = i;
      if (l < heap.length && heap[l] < heap[m]) m = l;
      if (r < heap.length && heap[r] < heap[m]) m = r;
      if (m === i) return;
      swap(m, i); i = m;
    }
  };
  for (const n of nums) {
    if (heap.length < k) { heap.push(n); up(heap.length - 1); }
    else if (n > heap[0]) { heap[0] = n; down(0); }
  }
  return heap[0];
}`, time:'O(n log k)', space:'O(k)',
  lesson:'Um heap é uma árvore guardada num array: o pai de i fica em (i − 1) / 2 e os filhos em 2i + 1 e 2i + 2, e o menor sempre está no topo. Um heap de tamanho k é o molde de todo "top k": K Closest Points, Top K Frequent, Kth Largest in a Stream. Ordenar também resolve, em O(n log n).' },

{ id:'last-stone-weight', lc:1046, diff:'Easy', pattern:'Heap', fn:'lastStoneWeight', params:'stones', title:'Last Stone Weight',
  monster:'Baú Triturador', sprite:'mimic', pal:{k:'#1a0f0a',g:'#8a5a2b',y:'#e7c25a',w:'#f3efe2',r:'#c0392b'},
  story:'O baú engole as duas pedras mais pesadas e cospe o que sobrar do choque. O que sai no fim?',
  desc:`<p>Cada número em <code>stones</code> é o peso de uma pedra. A cada rodada, pegue as <b>duas mais pesadas</b> e bata uma na outra:</p><p>se os pesos forem iguais, as duas somem; se forem diferentes, a mais leve some e a outra volta com peso igual à diferença.</p><p>Quando restar no máximo uma pedra, retorne o peso dela, ou <code>0</code> se não restar nenhuma.</p>`,
  tests:[ {args:[[2,7,4,1,8,1]],expect:1}, {args:[[1]],expect:1}, {args:[[2,2]],expect:0}, {args:[[10,4,2,10]],expect:2},
          {args:[[3,7,2]],expect:2}, {args:[[9,3,2,10]],expect:0}, {args:[[5,5,5]],expect:5} ],
  hints:['Toda rodada você precisa das duas maiores pedras. Que estrutura entrega o maior valor rapidinho?','Com poucas pedras, ordenar a cada rodada já serve. O jeito clássico é um heap máximo: tire duas, devolva a diferença se ela não for zero.'],
  solution:`function lastStoneWeight(stones) {
  const h = []; // heap máximo
  const push = v => {
    h.push(v);
    let i = h.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[p] >= h[i]) break;
      [h[p], h[i]] = [h[i], h[p]]; i = p;
    }
  };
  const pop = () => {
    const top = h[0], last = h.pop();
    if (h.length) {
      h[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < h.length && h[l] > h[m]) m = l;
        if (r < h.length && h[r] > h[m]) m = r;
        if (m === i) break;
        [h[m], h[i]] = [h[i], h[m]]; i = m;
      }
    }
    return top;
  };
  for (const s of stones) push(s);
  while (h.length > 1) {
    const y = pop(), x = pop();
    if (y !== x) push(y - x);
  }
  return h.length ? h[0] : 0;
}`, time:'O(n log n)', space:'O(n)',
  lesson:'Simulação com "sempre o maior" é o uso mais direto de um heap máximo. A mesma ideia aparece em agendadores de tarefas, Merge K Sorted Lists e no algoritmo de Dijkstra.' },

{ id:'subsets', lc:78, diff:'Medium', pattern:'Backtracking', fn:'subsets', params:'nums', title:'Subsets', cmp:'nested',
  monster:'Morcego do Eco', sprite:'bat', pal:{k:'#0c1420',g:'#3f6f9e',w:'#bfe3ff'},
  story:'Cada grito no poço volta duas vezes: uma com a pedra na mão, outra sem. O morcego quer ouvir todos os ecos.',
  desc:`<p>Dado um array <code>nums</code> de números <b>distintos</b>, retorne todos os subconjuntos possíveis, incluindo o vazio e o próprio array.</p><p>Não pode haver subconjunto repetido. A ordem dos subconjuntos e a ordem dentro de cada um não importam.</p>`,
  tests:[ {args:[[1,2,3]],expect:[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]}, {args:[[0]],expect:[[],[0]]},
          {args:[[1,2]],expect:[[],[1],[2],[1,2]]}, {args:[[5,-1]],expect:[[],[5],[-1],[5,-1]]},
          {args:[[4,1,0,9]],expect:[[],[4],[1],[0],[9],[4,1],[4,0],[4,9],[1,0],[1,9],[0,9],[4,1,0],[4,1,9],[4,0,9],[1,0,9],[4,1,0,9]]} ],
  hints:['Cada número tem dois destinos: entra ou não entra. Com n números, são 2ⁿ subconjuntos.','Uma função recursiva decide o número i: coloca no subconjunto atual, chama para i + 1, tira de volta e chama para i + 1 de novo. Quando i chega ao fim, guarde uma cópia.'],
  solution:`function subsets(nums) {
  const res = [], cur = [];
  const go = i => {
    if (i === nums.length) { res.push([...cur]); return; }
    cur.push(nums[i]);
    go(i + 1);
    cur.pop();
    go(i + 1);
  };
  go(0);
  return res;
}`, time:'O(n · 2ⁿ)', space:'O(n) além da resposta',
  lesson:'Backtracking é uma árvore de decisões: escolher, explorar, desfazer. O "desfazer" (o pop) é o que deixa reaproveitar o mesmo array em todos os ramos. Guarde sempre uma cópia, nunca o array que você continua mexendo.' },

{ id:'permutations', lc:46, diff:'Medium', pattern:'Backtracking', fn:'permute', params:'nums', title:'Permutations', cmp:'outer',
  monster:'Espectro das Mil Ordens', sprite:'ghost', pal:{k:'#24123a',g:'#c9a8f0',w:'#f3efe2',r:'#ff7ab6'},
  story:'O espectro repete seu nome em todas as ordens possíveis. Para calá-lo, recite cada uma delas.',
  desc:`<p>Dado um array <code>nums</code> de números <b>distintos</b>, retorne todas as permutações possíveis, ou seja, todas as ordens em que dá para enfileirar os números.</p><p>A ordem das permutações na resposta não importa, mas a ordem dentro de cada permutação importa.</p>`,
  tests:[ {args:[[1,2,3]],expect:[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]}, {args:[[0,1]],expect:[[0,1],[1,0]]},
          {args:[[1]],expect:[[1]]}, {args:[[-1,5]],expect:[[-1,5],[5,-1]]},
          {args:[[4,0,-2]],expect:[[4,0,-2],[4,-2,0],[0,4,-2],[0,-2,4],[-2,4,0],[-2,0,4]]},
          {args:[[1,2,3,4]],expect:[[1,2,3,4],[1,2,4,3],[1,3,2,4],[1,3,4,2],[1,4,2,3],[1,4,3,2],[2,1,3,4],[2,1,4,3],[2,3,1,4],[2,3,4,1],[2,4,1,3],[2,4,3,1],[3,1,2,4],[3,1,4,2],[3,2,1,4],[3,2,4,1],[3,4,1,2],[3,4,2,1],[4,1,2,3],[4,1,3,2],[4,2,1,3],[4,2,3,1],[4,3,1,2],[4,3,2,1]]} ],
  hints:['Escolha quem vai na primeira casa, depois quem vai na segunda entre os que sobraram, e assim por diante.','Guarde quais posições já foram usadas. Na recursão, tente cada número livre: marque, coloque, desça, depois tire e desmarque.'],
  solution:`function permute(nums) {
  const res = [], cur = [], used = new Array(nums.length).fill(false);
  const go = () => {
    if (cur.length === nums.length) { res.push([...cur]); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; cur.push(nums[i]);
      go();
      cur.pop(); used[i] = false;
    }
  };
  go();
  return res;
}`, time:'O(n · n!)', space:'O(n) além da resposta',
  lesson:'A diferença para Subsets: aqui toda posição precisa ser preenchida e qualquer número livre pode ir nela, por isso o for passa por todos e o array "usado" impede repetir. O mesmo molde resolve N-Queens e Sudoku.' },

{ id:'combination-sum', lc:39, diff:'Medium', pattern:'Backtracking', fn:'combinationSum', params:'candidates, target', title:'Combination Sum', cmp:'nested',
  monster:'Aranha Somadora', sprite:'spider', pal:{k:'#140a0a',g:'#5b2a2a',L:'#a35b4a',w:'#f3efe2',r:'#ffcf4d'},
  story:'A teia só se rompe com um peso exato. A aranha aceita qualquer combinação de fios, quantas vezes você quiser cada um.',
  desc:`<p>Dado um array <code>candidates</code> de inteiros positivos e <b>distintos</b> e um inteiro <code>target</code>, retorne todas as combinações de candidatos cuja soma é <code>target</code>.</p><p>O mesmo candidato pode ser usado quantas vezes quiser. Duas combinações são iguais se usam os mesmos números nas mesmas quantidades, então não repita. A ordem não importa.</p>`,
  tests:[ {args:[[2,3,6,7],7],expect:[[2,2,3],[7]]}, {args:[[2,3,5],8],expect:[[2,2,2,2],[2,3,3],[3,5]]}, {args:[[2],1],expect:[]},
          {args:[[1],2],expect:[[1,1]]}, {args:[[3,4,5],11],expect:[[3,4,4],[3,3,5]]}, {args:[[8,6,4],10],expect:[[4,6]]},
          {args:[[2,3,5],10],expect:[[2,2,2,2,2],[2,2,3,3],[2,3,5],[5,5]]} ],
  hints:['Vá escolhendo candidatos e descontando do alvo. Se o que falta virar 0, achou; se ficar negativo, volte.','Para não gerar [2, 3] e [3, 2], só deixe escolher candidatos do índice atual em diante. Passe i (e não i + 1) na recursão para permitir repetir o mesmo número.'],
  solution:`function combinationSum(candidates, target) {
  const res = [], cur = [];
  const nums = [...candidates].sort((a, b) => a - b);
  const go = (start, left) => {
    if (left === 0) { res.push([...cur]); return; }
    for (let i = start; i < nums.length && nums[i] <= left; i++) {
      cur.push(nums[i]);
      go(i, left - nums[i]);
      cur.pop();
    }
  };
  go(0, target);
  return res;
}`, time:'O(n^(t/m)), t = target, m = menor candidato', space:'O(t/m) além da resposta',
  lesson:'O índice inicial é o que evita repetir a mesma combinação em outra ordem. Ordenar os candidatos deixa cortar o ramo cedo: se este já passa do que falta, os próximos também passam.' },

{ id:'word-search', lc:79, diff:'Medium', pattern:'Backtracking', fn:'exist', params:'board, word', title:'Word Search', boss:true,
  monster:'Dragão Soletrador do Abismo', sprite:'dragon', flip:true, pal:{k:'#0a0c1c',g:'#33407a',L:'#7f8fd6',y:'#d14b8f',w:'#ffd36b'},
  story:'O chefe do poço gravou palavras nas paredes, letra por letra. Ele só some se você seguir a trilha exata, sem pisar duas vezes na mesma pedra.',
  desc:`<p>Dada uma grade <code>board</code> de letras (cada casa é uma string de um caractere) e uma string <code>word</code>, retorne <code>true</code> se a palavra puder ser formada andando por casas vizinhas.</p><p>Vizinhas são as casas de cima, de baixo, da esquerda e da direita (diagonal não vale). Cada casa pode ser usada no máximo uma vez na mesma palavra.</p>`,
  tests:[ {args:[[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],'ABCCED'],expect:true},
          {args:[[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],'SEE'],expect:true},
          {args:[[['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],'ABCB'],expect:false},
          {args:[[['a']],'a'],expect:true}, {args:[[['a','b'],['c','d']],'abcd'],expect:false},
          {args:[[['a','b'],['c','d']],'acdb'],expect:true},
          {args:[[['C','A','A'],['A','A','A'],['B','C','D']],'AAB'],expect:true},
          {args:[[['A','B','C','E'],['S','F','E','S'],['A','D','E','E']],'ABCESEEEFS'],expect:true},
          {args:[[['A','A','A','A'],['A','A','A','A'],['A','A','A','A']],'AAAAAAAAAAAAB'],expect:false,label:'board = grade 3 × 4 só de "A", word = "AAAAAAAAAAAAB"'} ],
  hints:['Tente começar a palavra em cada casa. De uma casa certa, a próxima letra precisa estar num dos 4 vizinhos.','Marque a casa enquanto ela está no caminho (troque por "#") e restaure a letra quando voltar da recursão. Sem restaurar, um caminho que falhou bloqueia outro que daria certo.'],
  solution:`function exist(board, word) {
  const R = board.length, C = board[0].length;
  // poda: se a grade não tem letras suficientes, nem começa
  const count = {};
  for (const row of board) for (const ch of row) count[ch] = (count[ch] || 0) + 1;
  for (const ch of word) { if (!count[ch]) return false; count[ch]--; }
  const dfs = (i, j, k) => {
    if (k === word.length) return true;
    if (i < 0 || j < 0 || i >= R || j >= C || board[i][j] !== word[k]) return false;
    const ch = board[i][j];
    board[i][j] = '#';
    const ok = dfs(i + 1, j, k + 1) || dfs(i - 1, j, k + 1) || dfs(i, j + 1, k + 1) || dfs(i, j - 1, k + 1);
    board[i][j] = ch;
    return ok;
  };
  for (let i = 0; i < R; i++)
    for (let j = 0; j < C; j++)
      if (dfs(i, j, 0)) return true;
  return false;
}`, time:'O(m · n · 3^L), L = tamanho da palavra', space:'O(L) da recursão',
  lesson:'É DFS numa grade com backtracking: marcar ao entrar e desmarcar ao sair. Esse par "marca, explora, desmarca" é o coração de todo backtracking, e a poda (contar as letras antes) é o que salva quando a busca explode.' }
  ],
  /* modo guiado: [ferramenta que você já conhece, frase em português, código daquele passo] */
  guide: {
'kth-largest': { think:'Em [3, 2, 1, 5, 6, 4] com k = 2, guardo só os 2 maiores que vi, com o menor deles sempre à mão. Entram 3 e 2. Chega 1: é menor que o menor guardado (2), ignoro. Chega 5: troco o 2 pelo 5, ficam 3 e 5. Chega 6: troco o 3, ficam 5 e 6. Chega 4: ignoro. O menor guardado, 5, é a resposta.',
  plan:[
  ['array','Crie um array que vai funcionar como heap mínimo: o menor valor fica sempre na posição 0.','const heap = [];'],
  ['função','Crie uma função que faz o valor da posição i subir enquanto for menor que o pai. O pai de i fica em (i - 1) / 2, arredondado para baixo.','function subir(i) {\n  while (i > 0) {\n    const pai = Math.floor((i - 1) / 2);\n    if (heap[pai] <= heap[i]) break;\n    const temp = heap[pai];\n    heap[pai] = heap[i];\n    heap[i] = temp;\n    i = pai;\n  }\n}'],
  ['função','Crie uma função que faz o valor da posição i descer, trocando com o menor filho (2i + 1 ou 2i + 2) enquanto algum filho for menor que ele.','function descer(i) {\n  while (true) {\n    const esq = 2 * i + 1;\n    const dir = 2 * i + 2;\n    let menor = i;\n    if (esq < heap.length && heap[esq] < heap[menor]) menor = esq;\n    if (dir < heap.length && heap[dir] < heap[menor]) menor = dir;\n    if (menor === i) break;\n    const temp = heap[menor];\n    heap[menor] = heap[i];\n    heap[i] = temp;\n    i = menor;\n  }\n}'],
  ['for','Ande por cada número.','for (let i = 0; i < nums.length; i++) {\n  const n = nums[i];'],
  ['if','Se o heap ainda tem menos de k números, coloque este no fim e faça ele subir.','if (heap.length < k) {\n  heap.push(n);\n  subir(heap.length - 1);\n}'],
  ['else if','Senão, se o número for maior que o menor guardado (heap[0]), ele toma o lugar do topo e desce até a posição certa. Feche o for.','else if (n > heap[0]) {\n  heap[0] = n;\n  descer(0);\n}\n}'],
  ['return','O topo é o menor dos k maiores, ou seja, o k-ésimo maior.','return heap[0];']]},
'last-stone-weight': { think:'[2, 7, 4, 1, 8, 1]: as duas mais pesadas são 8 e 7, sobra 1. Fica [2, 4, 1, 1, 1]. Depois 4 e 2, sobra 2: [2, 1, 1, 1]. Depois 2 e 1, sobra 1: [1, 1, 1]. Depois 1 e 1 somem: [1]. Resta uma pedra de peso 1.',
  plan:[
  ['array','Copie as pedras para um array seu.','const pedras = stones.slice();'],
  ['while','Enquanto houver pelo menos duas pedras, continue batendo.','while (pedras.length > 1) {'],
  ['array','Ordene da mais pesada para a mais leve e tire as duas primeiras.','pedras.sort((a, b) => b - a);\nconst maior = pedras.shift();\nconst segunda = pedras.shift();'],
  ['if','Se os pesos forem diferentes, a diferença volta para o monte. Feche o while.','if (maior !== segunda) {\n  pedras.push(maior - segunda);\n}\n}'],
  ['if / else','Se sobrou uma pedra, devolva o peso dela. Se não sobrou nenhuma, devolva 0.','if (pedras.length === 1) {\n  return pedras[0];\n} else {\n  return 0;\n}']]},
'subsets': { think:'[1, 2, 3]: para cada número decido "levo" ou "não levo". Levo 1, levo 2, levo 3: [1, 2, 3]. Volto um passo e não levo o 3: [1, 2]. Volto mais, não levo o 2: saem [1, 3] e [1]. Depois repito tudo sem o 1. São 2 × 2 × 2 = 8 subconjuntos.',
  plan:[
  ['array','Crie a lista de respostas e o subconjunto que você está montando agora.','const resposta = [];\nconst atual = [];'],
  ['função','Crie uma função que decide o destino do número na posição i.','function decidir(i) {'],
  ['if','Se já decidiu todos os números, guarde uma cópia do subconjunto atual e volte.','if (i === nums.length) {\n  resposta.push(atual.slice());\n  return;\n}'],
  ['recursão','Caminho 1: leve o número, decida o próximo e depois tire ele de volta. Esse "tirar de volta" é o eco do backtracking.','atual.push(nums[i]);\ndecidir(i + 1);\natual.pop();'],
  ['recursão','Caminho 2: não leve o número e decida o próximo. Feche a função.','decidir(i + 1);\n}'],
  ['return','Comece decidindo a posição 0 e devolva tudo o que foi guardado.','decidir(0);\nreturn resposta;']]},
'permutations': { think:'[1, 2, 3]: escolho quem vai na primeira casa, o 1. Na segunda sobram 2 e 3: escolho o 2, e o 3 fecha: [1, 2, 3]. Desfaço o 2 e escolho o 3: [1, 3, 2]. Depois desfaço o 1 e repito começando pelo 2 e pelo 3. São 3 × 2 × 1 = 6 ordens.',
  plan:[
  ['array','Crie a lista de respostas, a permutação que está montando e um array que marca quais posições já foram usadas.','const resposta = [];\nconst atual = [];\nconst usado = [];'],
  ['função','Crie uma função que escolhe o próximo número da permutação.','function escolher() {'],
  ['if','Se a permutação já tem todos os números, guarde uma cópia e volte.','if (atual.length === nums.length) {\n  resposta.push(atual.slice());\n  return;\n}'],
  ['for','Tente cada posição. Se ela já foi usada, pule.','for (let i = 0; i < nums.length; i++) {\n  if (usado[i]) continue;'],
  ['recursão','Marque, coloque na permutação, escolha o resto e depois desfaça as duas coisas. Feche o for e a função.','  usado[i] = true;\n  atual.push(nums[i]);\n  escolher();\n  atual.pop();\n  usado[i] = false;\n}\n}'],
  ['return','Comece a escolher e devolva todas as permutações.','escolher();\nreturn resposta;']]},
'combination-sum': { think:'[2, 3, 6, 7] com alvo 7: pego 2, faltam 5. Outro 2, faltam 3. Outro 2, falta 1, e nada cabe: volto. Troco o último 2 por 3: falta 0, achei [2, 2, 3]. Para não achar [3, 2, 2] depois, quem escolheu o 3 só pode escolher do 3 em diante. No fim aparece também o [7].',
  plan:[
  ['array','Crie a lista de respostas e a combinação que você está montando agora.','const resposta = [];\nconst atual = [];'],
  ['função','Crie uma função que recebe a partir de qual candidato pode escolher e quanto ainda falta para o alvo.','function buscar(inicio, falta) {'],
  ['if','Se não falta nada, a combinação fecha: guarde uma cópia e volte.','if (falta === 0) {\n  resposta.push(atual.slice());\n  return;\n}'],
  ['if','Se passou do alvo, esse caminho não serve: volte.','if (falta < 0) return;'],
  ['for','Tente cada candidato a partir de inicio. Passe i (e não i + 1) para poder repetir o mesmo número, e desfaça a escolha depois. Feche o for e a função.','for (let i = inicio; i < candidates.length; i++) {\n  atual.push(candidates[i]);\n  buscar(i, falta - candidates[i]);\n  atual.pop();\n}\n}'],
  ['return','Comece no candidato 0 com o alvo inteiro e devolva as combinações.','buscar(0, target);\nreturn resposta;']]},
'word-search': { think:'Procuro "SEE". Ando pela grade até achar um S que sirva: o da direita, no meio. Embaixo dele tem E, e ao lado desse E tem outro E. Achei. Enquanto ando, marco as casas do caminho para não pisar nelas de novo. Se um caminho der errado, desmarco as casas na volta, porque outro caminho pode precisar delas.',
  plan:[
  ['variável','Guarde quantas linhas e colunas a grade tem.','const linhas = board.length;\nconst colunas = board[0].length;'],
  ['função','Crie uma função que tenta encaixar a letra de índice k da palavra na casa (i, j).','function tentar(i, j, k) {'],
  ['if','Se já encaixou todas as letras, achou a palavra.','if (k === word.length) return true;'],
  ['if','Se a casa está fora da grade ou não tem a letra certa, este caminho falhou. Casas marcadas com "#" nunca batem.',"if (i < 0 || j < 0 || i >= linhas || j >= colunas) return false;\nif (board[i][j] !== word[k]) return false;"],
  ['recursão','Marque a casa, tente a próxima letra nos 4 vizinhos e, na volta, devolva a letra para a casa. Feche a função.',"const letra = board[i][j];\nboard[i][j] = '#';\nconst achou = tentar(i + 1, j, k + 1) || tentar(i - 1, j, k + 1) || tentar(i, j + 1, k + 1) || tentar(i, j - 1, k + 1);\nboard[i][j] = letra;\nreturn achou;\n}"],
  ['for','Tente começar a palavra em cada casa da grade.','for (let i = 0; i < linhas; i++) {\n  for (let j = 0; j < colunas; j++) {\n    if (tentar(i, j, 0)) return true;\n  }\n}'],
  ['return','Se nenhum começo deu certo, a palavra não está na grade.','return false;']]}
  }
});
