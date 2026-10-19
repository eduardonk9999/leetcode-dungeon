/* Andar 5 · As Correntes: listas ligadas, onde tudo é questão de mudar a seta certa na hora certa. */
addFloor({
  name: 'As Correntes',
  theme: 'Linked List',
  levels: [
{ id:'reverse-linked-list', lc:206, diff:'Easy', pattern:'Ponteiros', fn:'reverseList', params:'head', title:'Reverse Linked List',
  monster:'Gosma Contramão', sprite:'slime', pal:{k:'#1a0f1e',g:'#b552a8',L:'#e8a6dd',w:'#f3efe2'},
  story:'A gosma escorre pela corrente no sentido errado. Vire cada elo para ela voltar de onde veio.',
  inT:['list'], outT:'list',
  desc:`<p>Dado o primeiro nó <code>head</code> de uma lista ligada, inverta a lista e retorne o novo primeiro nó.</p><p>Cada nó tem <code>val</code> e <code>next</code>. No editor existe <code>ListNode(val, next)</code>, como no LeetCode, e os testes mostram as listas como arrays: <code>[1,2,3]</code> é 1 → 2 → 3.</p>`,
  tests:[ {args:[[1,2,3,4,5]],expect:[5,4,3,2,1]}, {args:[[1,2]],expect:[2,1]}, {args:[[]],expect:[]}, {args:[[7]],expect:[7]},
          {args:[[1,1,2,2]],expect:[2,2,1,1]}, {args:[[-1,0,1]],expect:[1,0,-1]},
          {args:[range(1000)],expect:range(1000).reverse(),label:'head = [0, 1, …, 999]'} ],
  hints:['Você não precisa criar nós novos. Basta fazer cada next apontar para o nó anterior.','Use três variáveis: anterior (começa null), atual e proximo. Guarde atual.next antes de trocar a seta, senão você perde o resto da lista.'],
  solution:`function reverseList(head) {
  let prev = null, cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`, time:'O(n)', space:'O(1)',
  lesson:'Inverter a lista com três ponteiros é a peça básica deste andar. Ela reaparece dentro de Reorder List, Palindrome Linked List e Reverse Nodes in k-Group.' },

{ id:'merge-two-sorted-lists', lc:21, diff:'Easy', pattern:'Ponteiros', fn:'mergeTwoLists', params:'list1, list2', title:'Merge Two Sorted Lists',
  monster:'Morcego Costureiro', sprite:'bat', pal:{k:'#0f1a14',g:'#3e9c76',w:'#ffd36b'},
  story:'O morcego costura duas correntes numa só. Ele odeia quando um elo fica fora de ordem.',
  inT:['list','list'], outT:'list',
  desc:`<p>Você recebe <code>list1</code> e <code>list2</code>, duas listas ligadas já ordenadas em ordem crescente. Junte as duas numa lista só, também ordenada, reaproveitando os nós, e retorne o primeiro nó dela.</p><p>No editor existe <code>ListNode(val, next)</code>. Os testes mostram as listas como arrays, e <code>[]</code> é a lista vazia (<code>null</code>).</p>`,
  tests:[ {args:[[1,2,4],[1,3,4]],expect:[1,1,2,3,4,4]}, {args:[[],[]],expect:[]}, {args:[[],[0]],expect:[0]},
          {args:[[5],[1,2,3]],expect:[1,2,3,5]}, {args:[[-3,-1,8],[-2,0,9,10]],expect:[-3,-2,-1,0,8,9,10]},
          {args:[[1,1,1],[1,1]],expect:[1,1,1,1,1]}, {args:[[2,4,6],[]],expect:[2,4,6]} ],
  hints:['Compare as duas cabeças. A menor vai para a resposta e aquela lista anda um passo.','Comece com um nó falso (new ListNode(0)) e um ponteiro fim colado nele. Assim você não precisa tratar o primeiro nó como caso especial. Quando uma lista acabar, pendure a outra inteira no fim.'],
  solution:`function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
    else { tail.next = list2; list2 = list2.next; }
    tail = tail.next;
  }
  tail.next = list1 || list2;
  return dummy.next;
}`, time:'O(n + m)', space:'O(1)',
  lesson:'O nó falso no começo (dummy) elimina o "e se a lista estiver vazia?" de quase todo problema de lista. Este merge é o coração do Merge Sort e do chefe deste andar.' },

{ id:'linked-list-cycle', lc:141, diff:'Easy', pattern:'Lebre e Tartaruga', fn:'hasCycle', params:'head', title:'Linked List Cycle',
  monster:'Espectro do Laço Eterno', sprite:'ghost', pal:{k:'#16122a',g:'#a99be8',w:'#f3efe2',r:'#5be0c8'},
  story:'O espectro prende almas numa corrente que talvez nunca termine. Descubra se ela fecha em círculo.',
  inT:['cycle'],
  desc:`<p>Dado o primeiro nó <code>head</code> de uma lista ligada, retorne <code>true</code> se a lista tiver um <b>ciclo</b>: andando sempre pelo <code>next</code>, você volta a um nó que já visitou. Se ela termina em <code>null</code>, retorne <code>false</code>.</p><p>Nos testes, <code>pos</code> é o índice do nó para onde o último nó aponta (<code>-1</code> = sem ciclo). A sua função recebe só <code>head</code>, nunca <code>pos</code>. Cuidado: num ciclo, um laço que espera chegar em <code>null</code> nunca termina.</p>`,
  tests:[ {args:[{vals:[3,2,0,-4],pos:1}],expect:true,label:'head = [3,2,0,-4], pos = 1'},
          {args:[{vals:[1,2],pos:0}],expect:true,label:'head = [1,2], pos = 0'},
          {args:[{vals:[1],pos:-1}],expect:false,label:'head = [1], pos = -1'},
          {args:[{vals:[],pos:-1}],expect:false,label:'head = [], pos = -1'},
          {args:[{vals:[1],pos:0}],expect:true,label:'head = [1], pos = 0'},
          {args:[{vals:[1,2,3,4,5],pos:-1}],expect:false,label:'head = [1,2,3,4,5], pos = -1'},
          {args:[{vals:[1,2,3,4,5],pos:4}],expect:true,label:'head = [1,2,3,4,5], pos = 4'},
          {args:[{vals:range(100000),pos:50000}],expect:true,label:'head = [0, 1, …, 99999], pos = 50000'} ],
  hints:['Um jeito fácil: guarde cada nó visitado num Set. Se aparecer de novo, tem ciclo. Dá para fazer sem memória extra?','Dois ponteiros: o lento anda 1 nó, o rápido anda 2. Se existe ciclo, o rápido alcança o lento por trás. Se o rápido chega em null, não existe.'],
  solution:`function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`, time:'O(n)', space:'O(1)',
  lesson:'É o algoritmo de Floyd, a lebre e a tartaruga. Com uma segunda fase ele acha onde o ciclo começa (Linked List Cycle II) e também resolve Find the Duplicate Number.' },

{ id:'remove-nth-from-end', lc:19, diff:'Medium', pattern:'Dois Ponteiros', fn:'removeNthFromEnd', params:'head, n', title:'Remove Nth Node From End of List',
  monster:'Esqueleto Contador', sprite:'skeleton', pal:{k:'#1c1410',g:'#d8cfb8',r:'#7ad0ff'},
  story:'O esqueleto conta os elos de trás para frente e arranca um. Faça isso antes dele, numa passada só.',
  inT:['list', null], outT:'list',
  desc:`<p>Dado o primeiro nó <code>head</code> de uma lista ligada e um inteiro <code>n</code>, remova o <code>n</code>-ésimo nó <b>contando a partir do fim</b> e retorne o primeiro nó da lista resultante. <code>n</code> é sempre válido.</p><p>No editor existe <code>ListNode(val, next)</code>, e os testes mostram as listas como arrays. Atenção ao caso em que o nó removido é o primeiro.</p>`,
  tests:[ {args:[[1,2,3,4,5],2],expect:[1,2,3,5]}, {args:[[1],1],expect:[]}, {args:[[1,2],1],expect:[1]},
          {args:[[1,2],2],expect:[2]}, {args:[[1,2,3],3],expect:[2,3]}, {args:[[10,20,30,40],1],expect:[10,20,30]},
          {args:[[5,6,7,8,9],3],expect:[5,6,8,9]} ],
  hints:['Contar o tamanho e depois andar até a posição certa funciona em duas passadas. Para uma passada só, pense em dois ponteiros com uma distância fixa entre eles.','Comece com um nó falso apontando para head. Ande o ponteiro da frente n + 1 passos, depois ande os dois juntos até a frente virar null. O de trás para logo antes do nó a remover.'],
  solution:`function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`, time:'O(n)', space:'O(1)',
  lesson:'Dois ponteiros com distância fixa transformam "contando do fim" em "contando do começo". O nó falso de novo salva o caso de remover o primeiro nó.' },

{ id:'add-two-numbers', lc:2, diff:'Medium', pattern:'Simulação', fn:'addTwoNumbers', params:'l1, l2', title:'Add Two Numbers',
  monster:'Mímico Somador', sprite:'mimic', pal:{k:'#1a1006',g:'#6e4a2a',y:'#ffd36b',w:'#f3efe2',r:'#3fbf6f'},
  story:'O baú cobra pedágio em moedas enfileiradas, com as unidades na frente. Some as duas filas sem errar o vai-um.',
  inT:['list','list'], outT:'list',
  desc:`<p><code>l1</code> e <code>l2</code> representam dois números não negativos, com um dígito por nó e os dígitos <b>de trás para frente</b>: <code>[2,4,3]</code> é o número 342.</p><p>Retorne a soma dos dois no mesmo formato. Os números podem ter centenas de dígitos, então converter para <code>Number</code> não funciona. No editor existe <code>ListNode(val, next)</code>, e os testes mostram as listas como arrays.</p>`,
  tests:[ {args:[[2,4,3],[5,6,4]],expect:[7,0,8]}, {args:[[0],[0]],expect:[0]},
          {args:[[9,9,9,9,9,9,9],[9,9,9,9]],expect:[8,9,9,9,0,0,0,1]}, {args:[[5],[5]],expect:[0,1]},
          {args:[[1,8],[0]],expect:[1,8]}, {args:[[9,9],[1]],expect:[0,0,1]},
          {args:[range(100).map(() => 9),[1]],expect:range(100).map(() => 0).concat([1]),label:'l1 = [9, 9, …, 9] (100 noves), l2 = [1]'} ],
  hints:['É a conta de somar da escola, dígito por dígito, começando pelas unidades. A lista já vem nessa ordem.','Ande pelas duas listas ao mesmo tempo somando os dígitos e o vai-um. Grave soma % 10 num nó novo e leve Math.floor(soma / 10). Continue enquanto houver dígito em alguma lista ou vai-um sobrando.'],
  solution:`function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy, carry = 0;
  while (l1 || l2 || carry) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    carry = Math.floor(sum / 10);
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}`, time:'O(max(n, m))', space:'O(max(n, m)) para a resposta',
  lesson:'Simular a conta à mão com um vai-um resolve números de qualquer tamanho. Add Binary, Multiply Strings e Plus One usam o mesmo molde.' },

{ id:'merge-k-sorted-lists', lc:23, diff:'Hard', pattern:'Dividir e Conquistar', fn:'mergeKLists', params:'lists', title:'Merge k Sorted Lists', boss:true,
  monster:'Aracne, Tecelã das Correntes', sprite:'spider', pal:{k:'#120a0a',g:'#5c2a2a',L:'#a8474a',w:'#f3efe2',r:'#ffcc33'},
  story:'A rainha das correntes prende cada aventureiro em um fio ordenado. Para escapar, trance todos os fios num só, sem perder a ordem.',
  inT:['lists'], outT:'list',
  desc:`<p>Você recebe <code>lists</code>, um array com <code>k</code> listas ligadas, cada uma ordenada em ordem crescente. Junte todas numa única lista ordenada e retorne o primeiro nó dela.</p><p>O array pode estar vazio ou ter listas vazias. No editor existe <code>ListNode(val, next)</code>, e os testes mostram cada lista como um array.</p>`,
  tests:[ {args:[[[1,4,5],[1,3,4],[2,6]]],expect:[1,1,2,3,4,4,5,6]}, {args:[[]],expect:[]}, {args:[[[]]],expect:[]},
          {args:[[[],[1],[]]],expect:[1]}, {args:[[[-5,0,5],[-10,10],[-1]]],expect:[-10,-5,-1,0,5,10]},
          {args:[[[2],[1]]],expect:[1,2]}, {args:[[[1,1],[1],[1,1,1]]],expect:[1,1,1,1,1,1]},
          {args:[range(2000).map(i => [i, i + 2000, i + 4000, i + 6000, i + 8000])],expect:range(10000),label:'lists = 2000 listas de 5 nós: [i, i+2000, i+4000, i+6000, i+8000]'} ],
  hints:['Você já sabe juntar duas listas ordenadas. Juntar a primeira com a segunda, o resultado com a terceira e assim por diante funciona, mas repassa os mesmos nós muitas vezes.','Junte em pares, como num torneio: (0,1), (2,3), (4,5)… Cada rodada corta o número de listas pela metade, e cada nó só é visitado log k vezes. Outra saída é um min-heap com as k cabeças.'],
  solution:`function mergeKLists(lists) {
  const merge = (a, b) => {
    const dummy = new ListNode(0);
    let tail = dummy;
    while (a && b) {
      if (a.val <= b.val) { tail.next = a; a = a.next; }
      else { tail.next = b; b = b.next; }
      tail = tail.next;
    }
    tail.next = a || b;
    return dummy.next;
  };
  if (!lists.length) return null;
  while (lists.length > 1) {
    const next = [];
    for (let i = 0; i < lists.length; i += 2) next.push(merge(lists[i], lists[i + 1] || null));
    lists = next;
  }
  return lists[0];
}`, time:'O(N log k), N = total de nós', space:'O(k)',
  lesson:'Dividir e conquistar: um problema de k listas vira log k rodadas do problema de 2 listas. Um min-heap com as k cabeças dá a mesma complexidade e é a saída para dados em fluxo, como em Find Median from Data Stream.' }
  ],
  /* modo guiado: [ferramenta que você já conhece, frase em português, código daquele passo] */
  guide: {
'reverse-linked-list': { think:'1 → 2 → 3. Começo com "anterior" vazio. No 1: guardo quem vem depois (o 2), viro a seta do 1 para o anterior (nada) e ando: anterior = 1, atual = 2. No 2: guardo o 3, viro a seta do 2 para o 1 e ando. No 3: viro a seta para o 2. Acabou: o anterior é o 3, e a lista ficou 3 → 2 → 1.',
  plan:[
  ['variável','Crie "anterior" vazio (null) e "atual" começando no primeiro nó.','let anterior = null;\nlet atual = head;'],
  ['while','Enquanto ainda houver nó para virar, continue.','while (atual !== null) {'],
  ['variável','Guarde quem vem depois do atual, senão você perde o resto da corrente ao virar a seta.','const proximo = atual.next;'],
  ['variável','Vire a seta: o atual agora aponta para o anterior.','atual.next = anterior;'],
  ['variável','Ande um passo: o atual vira o anterior e o próximo vira o atual. Feche o while.','anterior = atual;\natual = proximo;\n}'],
  ['return','Quando acabar, o anterior é o último nó antigo, que agora é o primeiro.','return anterior;']]},
'merge-two-sorted-lists': { think:'[1, 2, 4] e [1, 3, 4]: comparo 1 com 1, pego o da primeira. Comparo 2 com 1, pego o 1. Comparo 2 com 3, pego o 2. 4 com 3, pego o 3. 4 com 4, pego o da primeira. A primeira acabou, então penduro o resto da segunda (o 4). Ficou 1, 1, 2, 3, 4, 4.',
  plan:[
  ['variável','Crie um nó falso para servir de começo e um ponteiro "fim" que sempre fica no último nó da resposta.','const inicio = new ListNode(0);\nlet fim = inicio;'],
  ['while','Enquanto as duas listas ainda tiverem nós, continue comparando.','while (list1 !== null && list2 !== null) {'],
  ['if / else','Pendure no fim a cabeça menor e ande um passo naquela lista.','if (list1.val <= list2.val) {\n  fim.next = list1;\n  list1 = list1.next;\n} else {\n  fim.next = list2;\n  list2 = list2.next;\n}'],
  ['variável','Mova o fim para o nó que você acabou de pendurar. Feche o while.','fim = fim.next;\n}'],
  ['if / else','Uma das listas acabou: pendure a que sobrou inteira no fim, ela já está em ordem.','if (list1 !== null) {\n  fim.next = list1;\n} else {\n  fim.next = list2;\n}'],
  ['return','A resposta começa depois do nó falso.','return inicio.next;']]},
'linked-list-cycle': { think:'3 → 2 → 0 → -4, e o -4 volta para o 2. Solto uma tartaruga que anda 1 nó e uma lebre que anda 2. Como a corrente gira em círculo, a lebre dá a volta e encosta na tartaruga: tem ciclo. Se a corrente tivesse fim, a lebre cairia em null antes.',
  plan:[
  ['variável','Coloque os dois ponteiros no começo: lento e rápido.','let lento = head;\nlet rapido = head;'],
  ['while','Enquanto o rápido puder dar dois passos sem cair em null, continue.','while (rapido !== null && rapido.next !== null) {'],
  ['variável','O lento anda um nó. O rápido anda dois.','lento = lento.next;\nrapido = rapido.next.next;'],
  ['if','Se os dois pararam no mesmo nó, o rápido deu a volta: tem ciclo. Feche o while.','if (lento === rapido) return true;\n}'],
  ['return','Se o rápido chegou ao fim, a corrente acaba: não tem ciclo.','return false;']]},
'remove-nth-from-end': { think:'[1, 2, 3, 4, 5] e n = 2: quero tirar o 4. Coloco um nó falso antes do 1. Ando a "frente" 3 passos (n + 1) e ela para no 3. Agora ando frente e "trás" juntos até a frente sair da lista: a trás para no 3, logo antes do 4. Faço o 3 apontar para o 5 e o 4 some.',
  plan:[
  ['variável','Crie um nó falso que aponta para head. Ele resolve o caso de remover o primeiro nó.','const inicio = new ListNode(0, head);'],
  ['variável','Coloque dois ponteiros no nó falso: frente e trás.','let frente = inicio;\nlet tras = inicio;'],
  ['for','Ande a frente n + 1 passos. Assim fica uma distância fixa entre os dois.','for (let i = 0; i <= n; i++) {\n  frente = frente.next;\n}'],
  ['while','Ande os dois juntos até a frente sair da lista. A trás para logo antes do nó a remover.','while (frente !== null) {\n  frente = frente.next;\n  tras = tras.next;\n}'],
  ['variável','Pule o nó: a trás passa a apontar para o nó depois dele.','tras.next = tras.next.next;'],
  ['return','A lista começa depois do nó falso.','return inicio.next;']]},
'add-two-numbers': { think:'342 + 465 vem como [2, 4, 3] e [5, 6, 4]. Unidades: 2 + 5 = 7. Dezenas: 4 + 6 = 10, escrevo 0 e vai um. Centenas: 3 + 4 + 1 = 8. Resposta [7, 0, 8], que é 807.',
  plan:[
  ['variável','Crie um nó falso de começo, um ponteiro "fim" e o vai-um começando em 0.','const inicio = new ListNode(0);\nlet fim = inicio;\nlet vaiUm = 0;'],
  ['while','Continue enquanto houver dígito em alguma lista ou vai-um sobrando.','while (l1 !== null || l2 !== null || vaiUm > 0) {'],
  ['if','Some o vai-um com o dígito de cada lista que ainda tem nó, e ande nela.','let soma = vaiUm;\nif (l1 !== null) {\n  soma += l1.val;\n  l1 = l1.next;\n}\nif (l2 !== null) {\n  soma += l2.val;\n  l2 = l2.next;\n}'],
  ['variável','O dígito novo é soma % 10 e o vai-um é o que passou de 10.','vaiUm = Math.floor(soma / 10);'],
  ['objeto','Pendure um nó novo com o dígito no fim e mova o fim para ele. Feche o while.','fim.next = new ListNode(soma % 10);\nfim = fim.next;\n}'],
  ['return','A resposta começa depois do nó falso.','return inicio.next;']]},
'merge-k-sorted-lists': { think:'[1, 4, 5], [1, 3, 4], [2, 6]: junto a primeira com a segunda, como na sala Merge Two Sorted Lists, e sobra [1, 1, 3, 4, 4, 5] e [2, 6]. Junto essas duas: [1, 1, 2, 3, 4, 4, 5, 6]. Com muitas listas, junto de duas em duas por rodada, e cada rodada deixa a metade das listas.',
  plan:[
  ['função','Escreva uma função que junta duas listas ordenadas, igual à sala Merge Two Sorted Lists.','function juntar(a, b) {\n  const inicio = new ListNode(0);\n  let fim = inicio;\n  while (a !== null && b !== null) {\n    if (a.val <= b.val) {\n      fim.next = a;\n      a = a.next;\n    } else {\n      fim.next = b;\n      b = b.next;\n    }\n    fim = fim.next;\n  }\n  if (a !== null) fim.next = a;\n  else fim.next = b;\n  return inicio.next;\n}'],
  ['if','Se não veio nenhuma lista, a resposta é a lista vazia.','if (lists.length === 0) return null;'],
  ['variável','Guarde as listas da rodada atual.','let rodada = lists;'],
  ['while','Enquanto sobrar mais de uma lista, faça outra rodada com um array vazio para as listas juntadas.','while (rodada.length > 1) {\n  const proxima = [];'],
  ['for','Pegue as listas de duas em duas e junte cada par. Se a última ficou sem par, ela passa sozinha.','for (let i = 0; i < rodada.length; i += 2) {\n  let b = null;\n  if (i + 1 < rodada.length) b = rodada[i + 1];\n  proxima.push(juntar(rodada[i], b));\n}'],
  ['variável','A próxima rodada usa as listas juntadas. Feche o while.','rodada = proxima;\n}'],
  ['return','Sobrou uma lista só: é a resposta.','return rodada[0];']]}
  }
});
