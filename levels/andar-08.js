/* Andar 8 · As Cavernas Conectadas: grades e grafos. DFS para afundar o que está ligado, BFS para medir a distância em camadas. */
addFloor({
  name: 'As Cavernas Conectadas',
  theme: 'Grafos',
  levels: [
{ id:'number-of-islands', lc:200, diff:'Medium', pattern:'DFS', fn:'numIslands', params:'grid', title:'Number of Islands',
  monster:'Gosma Arquipélago', sprite:'slime', pal:{k:'#06161a',g:'#2f9e9a',L:'#8fe3d6',w:'#f3efe2'},
  story:'A gosma se espalha em poças pelo chão da caverna. Conte quantos pedaços separados ela tem antes que eles se juntem.',
  desc:`<p>Dada uma grade <code>grid</code> em que <code>'1'</code> é terra e <code>'0'</code> é água, retorne quantas <b>ilhas</b> existem.</p><p>Uma ilha é um grupo de terras ligadas na horizontal ou na vertical (diagonal não conta). Tudo fora da grade é água.</p>`,
  tests:[ {args:[[['1','1','1','1','0'],['1','1','0','1','0'],['1','1','0','0','0'],['0','0','0','0','0']]],expect:1},
          {args:[[['1','1','0','0','0'],['1','1','0','0','0'],['0','0','1','0','0'],['0','0','0','1','1']]],expect:3},
          {args:[[['0']]],expect:0}, {args:[[['1']]],expect:1}, {args:[[['1','0','1','0','1']]],expect:3},
          {args:[[['1','0'],['0','1']]],expect:2},
          {args:[[['1','0','1'],['1','0','1'],['1','1','1']]],expect:1},
          {args:[Array.from({length:100}, (_, i) => Array.from({length:100}, (_, j) => (i + j) % 2 === 0 ? '1' : '0'))],expect:5000,label:"grid = 100 × 100 em xadrez ('1' onde i + j é par)"} ],
  hints:['Ande pela grade. Cada vez que achar uma terra ainda não visitada, é uma ilha nova. O truque é não contar a mesma ilha duas vezes.','Ao achar um "1", conte e afunde a ilha inteira: troque por "0" e repita nos 4 vizinhos (DFS). Assim o resto dela nunca mais será contado.'],
  solution:`function numIslands(grid) {
  const R = grid.length, C = grid[0].length;
  const sink = (i, j) => {
    if (i < 0 || j < 0 || i >= R || j >= C || grid[i][j] !== '1') return;
    grid[i][j] = '0';
    sink(i + 1, j); sink(i - 1, j); sink(i, j + 1); sink(i, j - 1);
  };
  let count = 0;
  for (let i = 0; i < R; i++)
    for (let j = 0; j < C; j++)
      if (grid[i][j] === '1') { count++; sink(i, j); }
  return count;
}`, time:'O(m · n)', space:'O(m · n) da recursão no pior caso',
  lesson:'Contar componentes conectados é o problema-base de grafos: cada casa é um nó e os vizinhos são as arestas. Afundar a ilha é marcar como visitado sem gastar memória extra. Em grades enormes, troque a recursão por uma pilha ou fila para não estourar a pilha de chamadas.' },

{ id:'max-area-island', lc:695, diff:'Medium', pattern:'DFS', fn:'maxAreaOfIsland', params:'grid', title:'Max Area of Island',
  monster:'Olho do Cartógrafo', sprite:'eye', pal:{k:'#141006',g:'#c9a64a',L:'#f0dc8e',w:'#fdf7e3',r:'#3a7d44'},
  story:'Este olho mapeia cada pedaço de terra da caverna. Ele quer saber o tamanho do maior território antes de piscar.',
  desc:`<p>Dada uma grade <code>grid</code> de <code>0</code> (água) e <code>1</code> (terra), retorne a <b>área</b> da maior ilha, ou seja, quantas casas ela tem.</p><p>Casas de uma ilha se ligam na horizontal ou na vertical. Se não houver ilha, retorne <code>0</code>.</p>`,
  tests:[ {args:[[[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]],expect:6},
          {args:[[[0,0,0,0,0,0,0,0]]],expect:0},
          {args:[[[1]]],expect:1}, {args:[[[1,1],[1,0]]],expect:3}, {args:[[[1,0,1],[0,1,0],[1,0,1]]],expect:1},
          {args:[[[1,1,0,1],[0,1,0,1],[1,1,0,1],[0,0,0,1]]],expect:5},
          {args:[Array.from({length:100}, () => Array.from({length:100}, (_, j) => j % 3 === 2 ? 0 : 1))],expect:200,label:'grid = 100 × 100 com faixas de terra de 2 colunas separadas por 1 coluna de água'} ],
  hints:['É o Number of Islands, mas em vez de contar ilhas você mede cada uma.','Faça o DFS devolver quantas casas afundou: 1 pela casa atual mais o que cada um dos 4 vizinhos afundar. Guarde o maior valor.'],
  solution:`function maxAreaOfIsland(grid) {
  const R = grid.length, C = grid[0].length;
  const sink = (i, j) => {
    if (i < 0 || j < 0 || i >= R || j >= C || grid[i][j] !== 1) return 0;
    grid[i][j] = 0;
    return 1 + sink(i + 1, j) + sink(i - 1, j) + sink(i, j + 1) + sink(i, j - 1);
  };
  let best = 0;
  for (let i = 0; i < R; i++)
    for (let j = 0; j < C; j++)
      if (grid[i][j] === 1) best = Math.max(best, sink(i, j));
  return best;
}`, time:'O(m · n)', space:'O(m · n) da recursão no pior caso',
  lesson:'Um DFS que devolve um valor (aqui, a área) é o mesmo molde de "altura da árvore": junta a resposta dos filhos e soma a do nó atual. Serve para perímetro de ilha, tamanho de componentes e regiões cercadas.' },

{ id:'rotting-oranges', lc:994, diff:'Medium', pattern:'BFS', fn:'orangesRotting', params:'grid', title:'Rotting Oranges',
  monster:'Esqueleto do Pomar Podre', sprite:'skeleton', pal:{k:'#1a1206',g:'#e3d3a8',r:'#f08a24'},
  story:'O esqueleto planta laranjas na caverna e espera elas estragarem. Diga quantos minutos ele vai esperar, ou se vai esperar para sempre.',
  desc:`<p>Na grade <code>grid</code>, <code>0</code> é vazio, <code>1</code> é laranja fresca e <code>2</code> é laranja podre.</p><p>A cada minuto, toda laranja fresca vizinha (cima, baixo, esquerda, direita) de uma podre também apodrece. Retorne quantos minutos passam até não sobrar nenhuma fresca, ou <code>-1</code> se alguma nunca apodrecer.</p>`,
  tests:[ {args:[[[2,1,1],[1,1,0],[0,1,1]]],expect:4}, {args:[[[2,1,1],[0,1,1],[1,0,1]]],expect:-1}, {args:[[[0,2]]],expect:0},
          {args:[[[0]]],expect:0}, {args:[[[1]]],expect:-1}, {args:[[[2,1,1,1,1]]],expect:4},
          {args:[[[2,1,1],[1,1,1],[1,1,2]]],expect:2}, {args:[[[1,2,1,1,2,1,1]]],expect:2},
          {args:[Array.from({length:10}, (_, i) => Array.from({length:10}, (_, j) => i === 0 && j === 0 ? 2 : 1))],expect:18,label:'grid = 10 × 10 de laranjas frescas, só a do canto [0][0] podre'} ],
  hints:['Todas as laranjas podres espalham ao mesmo tempo. Pense em ondas: a primeira onda são as podres do começo, a segunda são as que elas estragaram, e assim por diante.','BFS com várias origens: coloque todas as podres na fila, conte as frescas e processe a fila camada por camada. Cada camada é um minuto. No fim, se sobrou fresca, a resposta é -1.'],
  solution:`function orangesRotting(grid) {
  const R = grid.length, C = grid[0].length;
  let queue = [], fresh = 0;
  for (let i = 0; i < R; i++)
    for (let j = 0; j < C; j++) {
      if (grid[i][j] === 2) queue.push([i, j]);
      else if (grid[i][j] === 1) fresh++;
    }
  let minutes = 0;
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (queue.length && fresh > 0) {
    const next = [];
    for (const [i, j] of queue)
      for (const [di, dj] of dirs) {
        const a = i + di, b = j + dj;
        if (a >= 0 && b >= 0 && a < R && b < C && grid[a][b] === 1) {
          grid[a][b] = 2; fresh--; next.push([a, b]);
        }
      }
    queue = next;
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`, time:'O(m · n)', space:'O(m · n)',
  lesson:'BFS anda em camadas, e cada camada é uma unidade de tempo ou distância. Começar com várias origens na fila (multi-source BFS) resolve Walls and Gates, 01 Matrix e qualquer "distância até o mais próximo".' },

{ id:'course-schedule', lc:207, diff:'Medium', pattern:'Ordenação Topológica', fn:'canFinish', params:'numCourses, prerequisites', title:'Course Schedule',
  monster:'Ouroboros da Grade Curricular', sprite:'snake', pal:{k:'#0a1408',g:'#4f8a2e',L:'#a5d66b',w:'#f3efe2',r:'#d6336c'},
  story:'A serpente morde o próprio rabo: para fazer um curso, exige outro que exige o primeiro. Descubra se existe uma ordem que escapa do círculo.',
  desc:`<p>Existem <code>numCourses</code> cursos, numerados de <code>0</code> a <code>numCourses - 1</code>. Cada par <code>[a, b]</code> em <code>prerequisites</code> diz que para fazer o curso <code>a</code> você precisa ter feito o curso <code>b</code> antes.</p><p>Retorne <code>true</code> se for possível terminar todos os cursos, e <code>false</code> se não for.</p>`,
  tests:[ {args:[2,[[1,0]]],expect:true}, {args:[2,[[1,0],[0,1]]],expect:false}, {args:[1,[]],expect:true},
          {args:[3,[[0,1],[0,2],[1,2]]],expect:true}, {args:[4,[[1,0],[2,1],[3,2],[1,3]]],expect:false},
          {args:[4,[[1,0],[2,0],[3,1],[3,2]]],expect:true}, {args:[3,[[0,0]]],expect:false},
          {args:[5,[]],expect:true},
          {args:[2000,Array.from({length:1999}, (_, i) => [i + 1, i])],expect:true,label:'numCourses = 2000, cada curso i + 1 exige o curso i (uma corrente)'},
          {args:[2000,Array.from({length:2000}, (_, i) => [(i + 1) % 2000, i])],expect:false,label:'numCourses = 2000, a mesma corrente, mas o curso 0 exige o 1999 (um círculo)'} ],
  hints:['Pense nos cursos como nós e nos pré-requisitos como setas. Só é impossível se existir um ciclo.','Conte quantos pré-requisitos cada curso ainda espera. Coloque numa fila quem espera 0, "faça" cada um e desconte dos cursos que ele libera. Se no fim você fez todos, não havia ciclo.'],
  solution:`function canFinish(numCourses, prerequisites) {
  const indeg = new Array(numCourses).fill(0);
  const adj = Array.from({ length: numCourses }, () => []);
  for (const [a, b] of prerequisites) { adj[b].push(a); indeg[a]++; }
  const queue = [];
  for (let i = 0; i < numCourses; i++) if (indeg[i] === 0) queue.push(i);
  let done = 0;
  for (let h = 0; h < queue.length; h++) { // a fila cresce enquanto andamos nela
    done++;
    for (const next of adj[queue[h]]) if (--indeg[next] === 0) queue.push(next);
  }
  return done === numCourses;
}`, time:'O(V + E)', space:'O(V + E)',
  lesson:'Este é o algoritmo de Kahn para ordenação topológica: a ordem em que os cursos saem da fila já é uma ordem válida (Course Schedule II pede exatamente ela). Outra saída é um DFS com três estados: não visitado, visitando e pronto. Encontrar um nó "visitando" é encontrar um ciclo.' },

{ id:'word-ladder', lc:127, diff:'Hard', pattern:'BFS', fn:'ladderLength', params:'beginWord, endWord, wordList', title:'Word Ladder', boss:true,
  monster:'Aranha-Rainha das Palavras', sprite:'spider', pal:{k:'#0c0614',g:'#3b1f5c',L:'#7d4fb8',w:'#e8dcff',r:'#ff4d6d'},
  story:'A rainha das cavernas teceu uma escada de palavras sobre o abismo. Cada degrau muda uma letra só. Ache o caminho mais curto até ela antes que a teia se feche.',
  desc:`<p>Uma escada de palavras vai de <code>beginWord</code> até <code>endWord</code> trocando <b>uma letra por vez</b>, e toda palavra depois da primeira precisa estar em <code>wordList</code>. Todas as palavras têm o mesmo tamanho e só letras minúsculas.</p><p>Retorne quantas palavras tem a escada mais curta, contando a primeira e a última, ou <code>0</code> se não existir escada. <code>beginWord</code> não precisa estar na lista.</p>`,
  tests:[ {args:['hit','cog',['hot','dot','dog','lot','log','cog']],expect:5}, {args:['hit','cog',['hot','dot','dog','lot','log']],expect:0},
          {args:['a','c',['a','b','c']],expect:2}, {args:['hot','dog',['hot','dog']],expect:0}, {args:['hot','dog',['hot','dog','dot']],expect:3},
          {args:['red','tax',['ted','tex','red','tax','tad','den','rex','pee']],expect:4},
          {args:['lost','cost',['most','fist','lost','cost','fish']],expect:2},
          {args:['aaaaa','hhhhh',(() => { const out = [], go = s => { if (s.length === 5) { out.push(s); return; } for (const c of 'abcdefgh') go(s + c); }; go(''); return out; })()],expect:6,label:"beginWord = 'aaaaa', endWord = 'hhhhh', wordList = todas as 32 768 palavras de 5 letras feitas com a até h"} ],
  hints:['Cada palavra é um nó, e duas palavras se ligam se diferem em uma letra. "Menor número de passos" num grafo sem pesos pede BFS.','Comparar cada palavra com todas as outras é lento demais no teste grande. Em vez disso, para cada posição troque a letra por a até z e veja se a palavra nova existe num Set. Tire do Set quem já entrou na fila.'],
  solution:`function ladderLength(beginWord, endWord, wordList) {
  const words = new Set(wordList);
  if (!words.has(endWord)) return 0;
  words.delete(beginWord);
  let level = [beginWord], steps = 1;
  while (level.length) {
    const next = [];
    for (const w of level) {
      for (let i = 0; i < w.length; i++) {
        const pre = w.slice(0, i), post = w.slice(i + 1);
        for (let c = 97; c <= 122; c++) {
          const cand = pre + String.fromCharCode(c) + post;
          if (!words.has(cand)) continue;
          if (cand === endWord) return steps + 1;
          words.delete(cand);
          next.push(cand);
        }
      }
    }
    level = next;
    steps++;
  }
  return 0;
}`, time:'O(N · L · 26), N = palavras, L = tamanho', space:'O(N · L)',
  lesson:'O grafo nunca é montado: os vizinhos são gerados na hora, trocando uma letra. BFS garante que a primeira vez que você chega ao destino é pelo caminho mais curto. Para ir ainda mais rápido, rode a BFS das duas pontas ao mesmo tempo (BFS bidirecional).' }
  ],
  /* modo guiado: [ferramenta que você já conhece, frase em português, código daquele passo] */
  guide: {
'number-of-islands': { think:'Ando pela grade linha por linha. Achei um "1": é uma ilha nova, conto 1. Para não contar a mesma ilha de novo, afundo a ilha inteira: viro esse "1" em "0" e faço o mesmo com cada vizinho de cima, de baixo, da esquerda e da direita que for terra. No primeiro exemplo, o primeiro "1" afunda tudo de uma vez, então a resposta é 1.',
  plan:[
  ['variável','Crie um contador de ilhas.','let ilhas = 0;'],
  ['função','Crie uma função que afunda a ilha a partir da casa (i, j).','function afundar(i, j) {'],
  ['if','Se a casa está fora da grade ou já é água, não há nada para afundar.',"if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length) return;\nif (grid[i][j] !== '1') return;"],
  ['recursão','Vire a casa em água e afunde os 4 vizinhos. Feche a função.',"grid[i][j] = '0';\nafundar(i + 1, j);\nafundar(i - 1, j);\nafundar(i, j + 1);\nafundar(i, j - 1);\n}"],
  ['for','Ande por todas as casas da grade.','for (let i = 0; i < grid.length; i++) {\n  for (let j = 0; j < grid[0].length; j++) {'],
  ['if','Ao achar terra, conte uma ilha nova e afunde ela inteira. Feche os dois for.',"if (grid[i][j] === '1') {\n  ilhas++;\n  afundar(i, j);\n}\n}\n}"],
  ['return','Devolva quantas ilhas você contou.','return ilhas;']]},
'max-area-island': { think:'Ando pela grade. No primeiro 1 que acho, afundo a ilha e conto cada casa afundada: essa casa vale 1, mais o que os vizinhos afundarem. No primeiro exemplo, a ilha da direita, que desce em forma de gancho, tem 6 casas, e nenhuma outra passa disso.',
  plan:[
  ['variável','Guarde a maior área encontrada.','let maior = 0;'],
  ['função','Crie uma função que afunda a ilha a partir de (i, j) e devolve quantas casas afundou.','function afundar(i, j) {'],
  ['if','Fora da grade ou água: nenhuma casa afundada.','if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length) return 0;\nif (grid[i][j] !== 1) return 0;'],
  ['recursão','Vire a casa em água e devolva 1 mais o que os 4 vizinhos afundarem. Feche a função.','grid[i][j] = 0;\nreturn 1 + afundar(i + 1, j) + afundar(i - 1, j) + afundar(i, j + 1) + afundar(i, j - 1);\n}'],
  ['for','Ande por todas as casas da grade.','for (let i = 0; i < grid.length; i++) {\n  for (let j = 0; j < grid[0].length; j++) {'],
  ['if','Ao achar terra, afunde a ilha e compare a área com a maior. Feche os dois for.','if (grid[i][j] === 1) {\n  const area = afundar(i, j);\n  if (area > maior) maior = area;\n}\n}\n}'],
  ['return','Devolva a maior área.','return maior;']]},
'rotting-oranges': { think:'[[2,1,1],[1,1,0],[0,1,1]]: no minuto 1, a podre do canto estraga as duas vizinhas. No minuto 2, essas estragam as delas. A onda segue até a última laranja do canto de baixo, no minuto 4. Cada onda é a fila de quem apodrece no próximo minuto.',
  plan:[
  ['array','Crie a fila das laranjas podres de agora e um contador de laranjas frescas.','let fila = [];\nlet frescas = 0;'],
  ['for','Ande pela grade: podre (2) entra na fila, fresca (1) entra na contagem.','for (let i = 0; i < grid.length; i++) {\n  for (let j = 0; j < grid[0].length; j++) {\n    if (grid[i][j] === 2) fila.push([i, j]);\n    if (grid[i][j] === 1) frescas++;\n  }\n}'],
  ['variável','Comece o relógio em 0 e liste as 4 direções.','let minutos = 0;\nconst direcoes = [[1, 0], [-1, 0], [0, 1], [0, -1]];'],
  ['while','Enquanto houver podres espalhando e frescas para estragar, comece a montar a fila de quem apodrece no próximo minuto.','while (fila.length > 0 && frescas > 0) {\n  const proxima = [];'],
  ['for','Para cada podre da fila, olhe os 4 vizinhos. Vizinho fresco apodrece, sai da contagem e entra na próxima fila.','for (const [i, j] of fila) {\n  for (const [di, dj] of direcoes) {\n    const ni = i + di;\n    const nj = j + dj;\n    if (ni >= 0 && nj >= 0 && ni < grid.length && nj < grid[0].length && grid[ni][nj] === 1) {\n      grid[ni][nj] = 2;\n      frescas--;\n      proxima.push([ni, nj]);\n    }\n  }\n}'],
  ['variável','A próxima fila vira a atual e o relógio anda 1 minuto. Feche o while.','fila = proxima;\nminutos++;\n}'],
  ['if / else','Se sobrou laranja fresca, ela nunca vai apodrecer: devolva -1. Senão, devolva os minutos.','if (frescas > 0) {\n  return -1;\n} else {\n  return minutos;\n}']]},
'course-schedule': { think:'2 cursos e [[1, 0]]: o curso 1 espera o 0. O 0 não espera ninguém, então faço ele primeiro. Isso libera o 1, que agora não espera mais nada. Fiz os 2: true. Já com [[1, 0], [0, 1]], cada um espera o outro, nenhum chega a zero pendências e nenhum é feito: false.',
  plan:[
  ['array','Crie um array com quantos pré-requisitos cada curso ainda espera e outro com a lista de cursos que cada um libera.','const pendentes = [];\nconst libera = [];\nfor (let i = 0; i < numCourses; i++) {\n  pendentes.push(0);\n  libera.push([]);\n}'],
  ['for','Para cada par [curso, antes]: o curso "antes" libera o "curso", e o "curso" ganha uma pendência.','for (let i = 0; i < prerequisites.length; i++) {\n  const curso = prerequisites[i][0];\n  const antes = prerequisites[i][1];\n  libera[antes].push(curso);\n  pendentes[curso]++;\n}'],
  ['array','Coloque numa fila todo curso que não espera ninguém.','const fila = [];\nfor (let i = 0; i < numCourses; i++) {\n  if (pendentes[i] === 0) fila.push(i);\n}'],
  ['while','Enquanto houver curso livre na fila, tire ele e conte como feito.','let feitos = 0;\nwhile (fila.length > 0) {\n  const atual = fila.shift();\n  feitos++;'],
  ['for','Cada curso que ele libera perde uma pendência. Quem chegar a zero entra na fila. Feche o for e o while.','  for (const proximo of libera[atual]) {\n    pendentes[proximo]--;\n    if (pendentes[proximo] === 0) fila.push(proximo);\n  }\n}'],
  ['return','Só deu para fazer tudo se o contador chegou em numCourses.','return feitos === numCourses;']]},
'word-ladder': { think:'De "hit" até "cog". A escada começa com 1 palavra: "hit". Trocando uma letra, chego em "hot" (2). De "hot" saem "dot" e "lot" (3). Deles saem "dog" e "log" (4). De "dog" sai "cog" (5). Como ando em camadas, a primeira vez que encontro "cog" já é pelo caminho mais curto.',
  plan:[
  ['objeto','Anote as palavras da lista num objeto para saber rápido se uma palavra existe.','const existe = {};\nfor (const p of wordList) existe[p] = true;'],
  ['if','Se o endWord nem está na lista, não há escada.','if (!existe[endWord]) return 0;'],
  ['array','Comece a fila com o beginWord e a escada com 1 palavra. Risque o beginWord para nunca voltar a ele.','let fila = [beginWord];\nlet passos = 1;\nexiste[beginWord] = false;'],
  ['while','Enquanto houver palavras na camada atual, monte a próxima camada.','while (fila.length > 0) {\n  const proxima = [];'],
  ['for','Para cada palavra da camada e cada posição dela, troque a letra daquela posição por todas de a até z.','for (const palavra of fila) {\n  for (let i = 0; i < palavra.length; i++) {\n    for (let c = 97; c <= 122; c++) {\n      const nova = palavra.slice(0, i) + String.fromCharCode(c) + palavra.slice(i + 1);'],
  ['if','Se a palavra nova é o endWord, a escada tem um degrau a mais que agora. Se ela existe e não foi riscada, risque e coloque na próxima camada. Feche os três for.','      if (nova === endWord) return passos + 1;\n      if (existe[nova]) {\n        existe[nova] = false;\n        proxima.push(nova);\n      }\n    }\n  }\n}'],
  ['variável','A próxima camada vira a atual e a escada cresce um degrau. Feche o while.','fila = proxima;\npassos++;\n}'],
  ['return','Se as camadas acabaram sem achar o endWord, não há caminho.','return 0;']]}
  }
});
