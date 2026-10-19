/* Andar 6 · O Bosque Invertido: árvores binárias e recursão. Cada galho é uma pergunta feita para a subárvore. */
addFloor({
  name: 'O Bosque Invertido',
  theme: 'Árvores',
  levels: [
{ id:'invert-binary-tree', lc:226, diff:'Easy', pattern:'Recursão', fn:'invertTree', params:'root', title:'Invert Binary Tree',
  monster:'Morcego Pendurado', sprite:'bat', pal:{k:'#0f1a0c',g:'#5c8a3a',w:'#e8f0a0'},
  story:'Ele vive de cabeça para baixo nos galhos e exige que o bosque inteiro fique igual a ele: espelhado.',
  desc:`<p>Neste andar as árvores chegam como nós <code>TreeNode(val, left, right)</code>, que já existe no editor. Na tela, cada árvore aparece na ordem por nível do LeetCode: a raiz, depois os filhos da esquerda para a direita, nível por nível, com <code>null</code> no lugar de um filho que não existe. Exemplo: <code>[1,null,2]</code> é a raiz 1 só com um filho à direita, o 2.</p><p>Dada a raiz <code>root</code>, espelhe a árvore: em todo nó, o filho da esquerda troca de lugar com o da direita. Retorne a raiz.</p>`,
  inT:['tree'], outT:'tree',
  tests:[ {args:[[4,2,7,1,3,6,9]],expect:[4,7,2,9,6,3,1]}, {args:[[2,1,3]],expect:[2,3,1]}, {args:[[]],expect:[]},
          {args:[[1]],expect:[1]}, {args:[[1,2]],expect:[1,null,2]}, {args:[[1,2,3,4,null,null,5]],expect:[1,3,2,5,null,null,4]} ],
  hints:['Se a subárvore da esquerda e a da direita já estivessem espelhadas, o que faltaria fazer na raiz?','Caso base: nó vazio devolve null. Senão, inverta os dois filhos chamando a própria função e depois troque left com right.'],
  solution:`function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}`, time:'O(n)', space:'O(h), h = altura da árvore',
  lesson:'Quase todo problema de árvore tem esta forma: resolva para os dois filhos com a mesma função e combine na raiz. O caso base é sempre o nó vazio.' },

{ id:'max-depth-binary-tree', lc:104, diff:'Easy', pattern:'Recursão', fn:'maxDepth', params:'root', title:'Maximum Depth of Binary Tree',
  monster:'Aranha das Raízes', sprite:'spider', pal:{k:'#140e06',g:'#6b4a26',L:'#a8834e',w:'#f0e2b8',r:'#9fd34a'},
  story:'A aranha desce pelas raízes até o fundo da terra. Diga a ela quantos andares de raiz existem.',
  desc:`<p>Dada a raiz <code>root</code>, retorne a profundidade máxima da árvore: quantos nós existem no caminho mais longo entre a raiz e uma folha.</p><p>Árvore vazia tem profundidade <code>0</code>.</p>`,
  inT:['tree'],
  tests:[ {args:[[3,9,20,null,null,15,7]],expect:3}, {args:[[1,null,2]],expect:2}, {args:[[]],expect:0}, {args:[[1]],expect:1},
          {args:[[1,2,3,4,null,null,5,6]],expect:4}, {args:[[1,2,null,3,null,4,null,5]],expect:5},
          {args:[BIG],expect:17,label:'root = [0, 1, …, 99999] (árvore completa)'} ],
  hints:['A profundidade de uma árvore é 1 (a raiz) mais a profundidade do filho mais fundo.','maxDepth(null) = 0. Para um nó: 1 + o maior entre maxDepth(left) e maxDepth(right).'],
  solution:`function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`, time:'O(n)', space:'O(h)',
  lesson:'Recursão em árvore é delegar: cada nó pergunta a resposta aos filhos e soma a sua parte. Dá para fazer com BFS também, contando os níveis.' },

{ id:'same-tree', lc:100, diff:'Easy', pattern:'Recursão', fn:'isSameTree', params:'p, q', title:'Same Tree',
  monster:'Espectro Gêmeo', sprite:'ghost', pal:{k:'#16261a',g:'#a9d8a0',w:'#f3f6e6',r:'#3e7a4a'},
  story:'Dois espectros idênticos rondam duas árvores. Só um deles é verdadeiro: descubra se as árvores são iguais.',
  desc:`<p>Dadas as raízes <code>p</code> e <code>q</code> de duas árvores, retorne <code>true</code> se elas forem iguais: mesmo formato e mesmos valores em cada posição.</p>`,
  inT:['tree','tree'],
  tests:[ {args:[[1,2,3],[1,2,3]],expect:true}, {args:[[1,2],[1,null,2]],expect:false}, {args:[[1,2,1],[1,1,2]],expect:false},
          {args:[[],[]],expect:true}, {args:[[1],[]],expect:false}, {args:[[0],[0]],expect:true},
          {args:[[1,2,3,4],[1,2,3,null,4]],expect:false}, {args:[[5,4,6,null,null,3,7],[5,4,6,null,null,3,7]],expect:true} ],
  hints:['Duas árvores são iguais se as raízes têm o mesmo valor e as subárvores correspondentes também são iguais.','Casos base: as duas vazias dá true; só uma vazia dá false. Depois compare os valores e chame a função para left com left e right com right.'],
  solution:`function isSameTree(p, q) {
  if (!p || !q) return p === q;
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`, time:'O(n)', space:'O(h)',
  lesson:'Percorrer duas árvores ao mesmo tempo é a base de Subtree of Another Tree e Symmetric Tree. Cuidado com o valor 0: teste o nó, não o valor.' },

{ id:'level-order-traversal', lc:102, diff:'Medium', pattern:'BFS', fn:'levelOrder', params:'root', title:'Binary Tree Level Order Traversal',
  monster:'Olho da Copa', sprite:'eye', pal:{k:'#0c1a10',g:'#3f8f4f',L:'#8fd48a',w:'#f3efe2',r:'#d9a43a'},
  story:'Do alto da copa, o olho vê o bosque em camadas. Conte a ele o que existe em cada andar de folhas.',
  desc:`<p>Dada a raiz <code>root</code>, retorne os valores dos nós agrupados por nível: um array para cada nível, de cima para baixo, e dentro de cada nível da esquerda para a direita.</p>`,
  inT:['tree'],
  tests:[ {args:[[3,9,20,null,null,15,7]],expect:[[3],[9,20],[15,7]]}, {args:[[1]],expect:[[1]]}, {args:[[]],expect:[]},
          {args:[[1,2,3,4,null,null,5]],expect:[[1],[2,3],[4,5]]}, {args:[[1,2,null,3,null,4]],expect:[[1],[2],[3],[4]]},
          {args:[[0,-1,2,null,-3]],expect:[[0],[-1,2],[-3]]} ],
  hints:['Use uma fila: quem entra primeiro sai primeiro, e isso visita os nós nível por nível.','No começo de cada volta, a fila tem exatamente os nós de um nível. Guarde o tamanho dela, tire esse tanto de nós e coloque os filhos deles no fim.'],
  solution:`function levelOrder(root) {
  if (!root) return [];
  const out = [];
  let level = [root];
  while (level.length) {
    out.push(level.map(n => n.val));
    const next = [];
    for (const n of level) {
      if (n.left) next.push(n.left);
      if (n.right) next.push(n.right);
    }
    level = next;
  }
  return out;
}`, time:'O(n)', space:'O(n)',
  lesson:'BFS com fila percorre por camadas. Separar a fila por nível resolve Right Side View, Zigzag e Average of Levels com quase o mesmo código.' },

{ id:'validate-bst', lc:98, diff:'Medium', pattern:'Recursão', fn:'isValidBST', params:'root', title:'Validate Binary Search Tree',
  monster:'Golem de Casca', sprite:'golem', pal:{k:'#1a1208',g:'#7a5a34',L:'#b08a56',y:'#c8e06a'},
  story:'O golem de casca de árvore guarda a ordem do bosque. Ele esmaga qualquer galho fora do lugar.',
  desc:`<p>Dada a raiz <code>root</code>, retorne <code>true</code> se ela for uma árvore binária de busca válida.</p><p>Isso quer dizer: para todo nó, <b>todos</b> os valores da subárvore da esquerda são menores que ele, e <b>todos</b> os da direita são maiores. Valores iguais não são permitidos.</p>`,
  inT:['tree'],
  tests:[ {args:[[2,1,3]],expect:true}, {args:[[5,1,4,null,null,3,6]],expect:false},
          {args:[[5,4,6,null,null,3,7]],expect:false,label:'root = [5,4,6,null,null,3,7]'},
          {args:[[1,1]],expect:false}, {args:[[2147483647]],expect:true}, {args:[[3,1,5,0,2,4,6]],expect:true},
          {args:[[10,5,15,null,null,6,20]],expect:false}, {args:[[-2147483648,null,2147483647]],expect:true} ],
  hints:['Comparar cada nó só com os filhos diretos não basta: em [5,4,6,null,null,3,7] o 3 é menor que o 6, mas está do lado direito do 5.','Leve para baixo um intervalo (mínimo, máximo) permitido. Ao ir para a esquerda, o máximo vira o valor do nó; ao ir para a direita, o mínimo vira o valor do nó.'],
  solution:`function isValidBST(root) {
  const ok = (node, lo, hi) => {
    if (!node) return true;
    if (node.val <= lo || node.val >= hi) return false;
    return ok(node.left, lo, node.val) && ok(node.right, node.val, hi);
  };
  return ok(root, -Infinity, Infinity);
}`, time:'O(n)', space:'O(h)',
  lesson:'Quando a regra vale para a subárvore inteira, passe limites para baixo na recursão. Outra saída: o percurso em ordem de uma BST precisa sair estritamente crescente.' },

{ id:'lca-bst', lc:235, diff:'Medium', pattern:'BST', fn:'lowestCommonAncestor', params:'root, p, q', title:'Lowest Common Ancestor of a Binary Search Tree',
  monster:'Serpente do Galho', sprite:'snake', pal:{k:'#0e1608',g:'#6a9c2e',L:'#b6d86a',w:'#f3efe2',r:'#d24a3a'},
  story:'A serpente se enrola no galho onde dois caminhos se separam. Encontre esse galho antes que ela dê o bote.',
  desc:`<p>Dada uma árvore binária de busca <code>root</code> e dois nós <code>p</code> e <code>q</code> que existem nela, retorne o <b>menor ancestral comum</b>: o nó mais fundo que tem os dois como descendentes.</p><p>Um nó conta como descendente de si mesmo. Na tela, <code>p</code> e <code>q</code> aparecem pelo valor, mas a função recebe os nós.</p>`,
  inT:['tree','node','node'], outT:'val',
  tests:[ {args:[[6,2,8,0,4,7,9,null,null,3,5],2,8],expect:6,label:'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8'},
          {args:[[6,2,8,0,4,7,9,null,null,3,5],2,4],expect:2,label:'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4'},
          {args:[[2,1],2,1],expect:2,label:'root = [2,1], p = 2, q = 1'},
          {args:[[6,2,8,0,4,7,9,null,null,3,5],3,5],expect:4,label:'root = [6,2,8,0,4,7,9,null,null,3,5], p = 3, q = 5'},
          {args:[[6,2,8,0,4,7,9,null,null,3,5],0,5],expect:2,label:'root = [6,2,8,0,4,7,9,null,null,3,5], p = 0, q = 5'},
          {args:[[6,2,8,0,4,7,9,null,null,3,5],7,9],expect:8,label:'root = [6,2,8,0,4,7,9,null,null,3,5], p = 7, q = 9'},
          {args:[[6,2,8,0,4,7,9,null,null,3,5],3,9],expect:6,label:'root = [6,2,8,0,4,7,9,null,null,3,5], p = 3, q = 9'} ],
  hints:['Numa BST, se p e q são os dois menores que o nó atual, o ancestral comum está à esquerda. Se são os dois maiores, está à direita.','Desça a partir da raiz. No primeiro nó em que p e q ficam em lados diferentes (ou um deles é o próprio nó), você achou a resposta.'],
  solution:`function lowestCommonAncestor(root, p, q) {
  let node = root;
  while (node) {
    if (p.val < node.val && q.val < node.val) node = node.left;
    else if (p.val > node.val && q.val > node.val) node = node.right;
    else return node;
  }
  return null;
}`, time:'O(h)', space:'O(1)',
  lesson:'A ordem da BST diz para que lado ir sem olhar o outro: é a mesma ideia da busca binária, agora em galhos. Em árvore comum (LC 236) é preciso perguntar aos dois lados.' },

{ id:'kth-smallest-bst', lc:230, diff:'Medium', pattern:'Em Ordem', fn:'kthSmallest', params:'root, k', title:'Kth Smallest Element in a BST',
  monster:'Mímico do Tronco Oco', sprite:'mimic', pal:{k:'#140c06',g:'#5e3f22',y:'#9ccf4a',w:'#f3efe2',r:'#c0392b'},
  story:'Ele se finge de tronco oco cheio de sementes numeradas. Diga qual é a k-ésima menor e ele abre a boca.',
  desc:`<p>Dada a raiz <code>root</code> de uma árvore binária de busca e um inteiro <code>k</code>, retorne o <code>k</code>-ésimo menor valor da árvore (contando a partir de 1).</p>`,
  inT:['tree', null],
  tests:[ {args:[[3,1,4,null,2],1],expect:1}, {args:[[5,3,6,2,4,null,null,1],3],expect:3}, {args:[[5,3,6,2,4,null,null,1],6],expect:6},
          {args:[[1],1],expect:1}, {args:[[3,1,4,null,2],4],expect:4}, {args:[[2,1,3],2],expect:2}, {args:[[5,3,6,2,4,null,null,1],1],expect:1} ],
  hints:['Em uma BST, visitar esquerda, nó, direita (percurso em ordem) entrega os valores já ordenados.','Faça o percurso em ordem contando os nós visitados. Quando o contador chegar a k, esse é o valor.'],
  solution:`function kthSmallest(root, k) {
  const stack = [];
  let node = root;
  while (node || stack.length) {
    while (node) { stack.push(node); node = node.left; }
    node = stack.pop();
    if (--k === 0) return node.val;
    node = node.right;
  }
  return -1;
}`, time:'O(h + k)', space:'O(h)',
  lesson:'O percurso em ordem transforma uma BST num array ordenado sem precisar ordenar. Com pilha explícita dá para parar no k-ésimo sem visitar o resto.' },

{ id:'binary-tree-max-path-sum', lc:124, diff:'Hard', pattern:'Recursão', fn:'maxPathSum', params:'root', title:'Binary Tree Maximum Path Sum', boss:true,
  monster:'Dragão Espinho-Negro', sprite:'dragon', flip:true, pal:{k:'#0a1408',g:'#2f6b2a',L:'#7fbf5a',y:'#c9a227',w:'#e6f59a'},
  story:'O chefe do bosque tem espinhos em cada galho, uns doces, outros venenosos. Ache o caminho de maior seiva antes que ele te enrosque.',
  desc:`<p>Um <b>caminho</b> é uma sequência de nós ligados por arestas em que nenhum nó se repete. Ele não precisa passar pela raiz e pode subir por um lado e descer pelo outro, mas tem pelo menos um nó.</p><p>Dada a raiz <code>root</code>, retorne a maior soma de valores possível em um caminho. Os valores podem ser negativos.</p>`,
  inT:['tree'],
  tests:[ {args:[[1,2,3]],expect:6}, {args:[[-10,9,20,null,null,15,7]],expect:42}, {args:[[-3]],expect:-3},
          {args:[[-2,-1]],expect:-1}, {args:[[-1,-2,-3]],expect:-1}, {args:[[-5,-4,-8,-11,null,-13,-4]],expect:-4},
          {args:[[2,-1]],expect:2}, {args:[[1,-2,3]],expect:4}, {args:[[-1,-2,10,-6,null,-3,-6]],expect:10},
          {args:[[5,4,8,11,null,13,4,7,2,null,null,null,1]],expect:48} ],
  hints:['Separe duas coisas: o melhor caminho que faz a curva neste nó (esquerda + nó + direita) e o melhor ganho que este nó pode oferecer ao pai (nó + um lado só).','Uma função ganho(no) devolve no.val + max(ganhoEsq, ganhoDir), tratando ganhos negativos como 0. Dentro dela, atualize uma variável de fora com no.val + ganhoEsq + ganhoDir. Comece essa variável em -Infinity por causa das árvores todas negativas.'],
  solution:`function maxPathSum(root) {
  let best = -Infinity;
  const gain = node => {
    if (!node) return 0;
    const l = Math.max(gain(node.left), 0);
    const r = Math.max(gain(node.right), 0);
    best = Math.max(best, node.val + l + r);
    return node.val + Math.max(l, r);
  };
  gain(root);
  return best;
}`, time:'O(n)', space:'O(h)',
  lesson:'A recursão devolve uma coisa ao pai (o ganho de um lado só) e guarda outra numa variável de fora (a melhor curva). O mesmo truque resolve Diameter of Binary Tree e Longest Univalue Path.' }
  ],
  /* modo guiado: [ferramenta que você já conhece, frase em português, código daquele passo] */
  guide: {
'invert-binary-tree': { think:'Em [2, 1, 3], pergunto para a subárvore da esquerda (o 1): "se espelhe". Ela é só uma folha, fica igual. Pergunto o mesmo para a da direita (o 3). Agora troco as duas de lugar na raiz: o 3 vai para a esquerda e o 1 para a direita. Resultado: [2, 3, 1].',
  plan:[
  ['if','Se o nó está vazio, não há nada para espelhar: devolva null.','if (!root) return null;'],
  ['recursão','Peça para a subárvore da esquerda se espelhar, e depois para a da direita. Guarde as duas respostas.','const esquerdaEspelhada = invertTree(root.left);\nconst direitaEspelhada = invertTree(root.right);'],
  ['variável','Troque os lados: a da direita vira filho da esquerda e vice-versa.','root.left = direitaEspelhada;\nroot.right = esquerdaEspelhada;'],
  ['return','Devolva a raiz, agora espelhada.','return root;']]},
'max-depth-binary-tree': { think:'Em [3, 9, 20, null, null, 15, 7], pergunto para a subárvore da esquerda (o 9) qual a profundidade dela: 1. Pergunto para a da direita (o 20, com 15 e 7): 2. Fico com a maior, 2, e somo 1 pela raiz. Resposta: 3.',
  plan:[
  ['if','Se o nó está vazio, a profundidade é 0.','if (!root) return 0;'],
  ['recursão','Pergunte a profundidade da subárvore da esquerda e da direita.','const alturaEsquerda = maxDepth(root.left);\nconst alturaDireita = maxDepth(root.right);'],
  ['if / else','Devolva 1 (este nó) mais a maior das duas alturas.','if (alturaEsquerda > alturaDireita) {\n  return 1 + alturaEsquerda;\n} else {\n  return 1 + alturaDireita;\n}']]},
'same-tree': { think:'[1, 2] e [1, null, 2]: as raízes valem 1 nas duas, ok. Pergunto se as subárvores da esquerda são iguais: na primeira tem o 2, na segunda não tem nada. Uma vazia e a outra não: são diferentes, resposta false.',
  plan:[
  ['if','Se os dois nós estão vazios, as árvores (aqui) são iguais.','if (!p && !q) return true;'],
  ['if','Se só um deles está vazio, são diferentes.','if (!p || !q) return false;'],
  ['if','Se os valores são diferentes, também são diferentes.','if (p.val !== q.val) return false;'],
  ['recursão','Pergunte se as esquerdas são iguais e se as direitas são iguais. Precisa das duas coisas.','return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);']]},
'level-order-traversal': { think:'Em [3, 9, 20, null, null, 15, 7]: começo com a fila [3]. Tiro o 3, anoto o nível [3] e coloco os filhos 9 e 20. Agora a fila tem 2 nós: tiro os dois, anoto [9, 20] e coloco 15 e 7. Tiro os dois, anoto [15, 7]. Fila vazia, fim.',
  plan:[
  ['if','Se a árvore está vazia, não há níveis: devolva um array vazio.','if (!root) return [];'],
  ['array','Crie o array de resposta e uma fila começando com a raiz.','const resposta = [];\nconst fila = [root];'],
  ['while','Enquanto a fila tiver nós, ainda há um nível para ler.','while (fila.length > 0) {'],
  ['variável','Guarde quantos nós estão na fila agora: esse é o tamanho do nível. Crie o array do nível.','const tamanho = fila.length;\nconst nivel = [];'],
  ['for','Tire esse tanto de nós do começo da fila e anote o valor de cada um.','for (let i = 0; i < tamanho; i++) {\n  const no = fila.shift();\n  nivel.push(no.val);'],
  ['if','Coloque os filhos que existirem no fim da fila. Feche o for.','if (no.left) fila.push(no.left);\nif (no.right) fila.push(no.right);\n}'],
  ['array','Guarde o nível na resposta. Feche o while.','resposta.push(nivel);\n}'],
  ['return','Devolva a resposta.','return resposta;']]},
'validate-bst': { think:'Em [5, 4, 6, null, null, 3, 7]: a raiz 5 pode ser qualquer coisa. Pergunto para a esquerda: "você só pode ter valores menores que 5". O 4 serve. Pergunto para a direita: "só valores maiores que 5". O 6 serve, mas o 3 dentro dela não é maior que 5. Resposta: false.',
  plan:[
  ['função','Crie uma função que recebe um nó e o intervalo permitido (mínimo e máximo). Nó vazio é sempre válido.','function valida(no, minimo, maximo) {\n  if (!no) return true;'],
  ['if','Se o valor do nó saiu do intervalo, a árvore é inválida.','if (no.val <= minimo || no.val >= maximo) return false;'],
  ['recursão','Pergunte para a esquerda com o máximo virando o valor do nó, e para a direita com o mínimo virando o valor do nó. Feche a função.','return valida(no.left, minimo, no.val) && valida(no.right, no.val, maximo);\n}'],
  ['return','Comece pela raiz com intervalo infinito para os dois lados.','return valida(root, -Infinity, Infinity);']]},
'lca-bst': { think:'Com p = 2 e q = 4 em [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]: na raiz 6, os dois são menores, então desço para a esquerda. Cheguei no 2: ele é o próprio p, e o 4 está abaixo dele. É aqui que os caminhos se separam: resposta 2.',
  plan:[
  ['variável','Comece no topo da árvore.','let atual = root;'],
  ['while','Enquanto houver nó, continue descendo.','while (atual) {'],
  ['if','Se p e q são os dois menores que o nó atual, a resposta está à esquerda.','if (p.val < atual.val && q.val < atual.val) {\n  atual = atual.left;\n}'],
  ['else if','Se os dois são maiores, a resposta está à direita.','else if (p.val > atual.val && q.val > atual.val) {\n  atual = atual.right;\n}'],
  ['else','Senão, eles se separam aqui (ou um deles é este nó): achou. Feche o while.','else {\n  return atual;\n}\n}'],
  ['return','Não deve chegar aqui, mas devolva null por segurança.','return null;']]},
'kth-smallest-bst': { think:'Em [5, 3, 6, 2, 4, null, null, 1] com k = 3: visito sempre a esquerda primeiro, depois o nó, depois a direita. A ordem sai 1, 2, 3, 4, 5, 6, já crescente. O terceiro é o 3.',
  plan:[
  ['array','Crie um array para guardar os valores na ordem em que forem visitados.','const ordenados = [];'],
  ['função','Crie uma função que visita um nó. Se ele estiver vazio, não faz nada.','function visita(no) {\n  if (!no) return;'],
  ['recursão','Visite a esquerda, anote o valor do nó, visite a direita. Feche a função.','visita(no.left);\nordenados.push(no.val);\nvisita(no.right);\n}'],
  ['recursão','Comece a visita pela raiz.','visita(root);'],
  ['return','O k-ésimo menor está na posição k - 1.','return ordenados[k - 1];']]},
'binary-tree-max-path-sum': { think:'Em [-10, 9, 20, null, null, 15, 7]: o 20 pergunta para a esquerda (15) e para a direita (7). O caminho que faz a curva no 20 vale 15 + 20 + 7 = 42, o melhor até agora. Mas para o pai ele só pode oferecer um lado: 20 + 15 = 35. Na raiz, -10 + 9 + 35 = 34, pior que 42. Resposta: 42.',
  plan:[
  ['variável','Guarde a melhor soma vista. Comece em -Infinity, porque a árvore pode ser toda negativa.','let melhor = -Infinity;'],
  ['função','Crie uma função que diz quanto um nó consegue oferecer ao pai. Nó vazio oferece 0.','function ganho(no) {\n  if (!no) return 0;'],
  ['recursão','Pergunte o ganho da esquerda e da direita. Se algum for negativo, ignore aquele lado (use 0).','let esquerda = ganho(no.left);\nlet direita = ganho(no.right);\nif (esquerda < 0) esquerda = 0;\nif (direita < 0) direita = 0;'],
  ['if','O caminho que faz a curva neste nó vale esquerda + nó + direita. Se for o melhor até agora, guarde.','const curva = esquerda + no.val + direita;\nif (curva > melhor) melhor = curva;'],
  ['if / else','Para o pai, devolva o nó mais só o maior dos dois lados. Feche a função.','if (esquerda > direita) {\n  return no.val + esquerda;\n} else {\n  return no.val + direita;\n}\n}'],
  ['return','Rode a função a partir da raiz e devolva a melhor soma.','ganho(root);\nreturn melhor;']]}
  }
});
