/* Andar 4 · A Torre do Eco: pilhas que lembram o passado e buscas binárias em arrays girados. */
addFloor({
  name: 'A Torre do Eco',
  theme: 'Pilha & Busca Binária',
  levels: [
{ id:'eval-rpn', lc:150, diff:'Medium', pattern:'Pilha', fn:'evalRPN', params:'tokens', title:'Evaluate Reverse Polish Notation',
  monster:'Mímico Pós-Fixo', sprite:'mimic', pal:{k:'#1e1208',g:'#9a6a32',y:'#f2c14e',w:'#f3efe2',r:'#d9483b'},
  story:'Um baú na entrada da torre só abre para quem calcular a conta escrita de trás para frente na tampa.',
  desc:`<p>Você recebe <code>tokens</code>, um array de strings com uma expressão em <b>notação polonesa reversa</b>: cada operador vem <b>depois</b> dos dois números em que ele atua. Os operadores são <code>+</code>, <code>-</code>, <code>*</code> e <code>/</code>.</p><p>Retorne o valor da expressão como número. A divisão é inteira e corta em direção ao zero: <code>7 / -2</code> dá <code>-3</code>, não <code>-4</code>. A expressão é sempre válida e nunca divide por zero.</p>`,
  tests:[ {args:[['2','1','+','3','*']],expect:9}, {args:[['4','13','5','/','+']],expect:6},
          {args:[['10','6','9','3','+','-11','*','/','*','17','+','5','+']],expect:22},
          {args:[['7','-2','/']],expect:-3}, {args:[['-7','2','/']],expect:-3}, {args:[['3','4','-']],expect:-1},
          {args:[['4','-2','/','2','-3','-','-']],expect:-7}, {args:[['42']],expect:42} ],
  hints:['Quando chega um operador, ele usa os dois últimos números que apareceram. Que estrutura devolve "o último que entrou"?','Empilhe números. Num operador, desempilhe b e depois a, calcule a op b e empilhe o resultado. Para a divisão use Math.trunc(a / b), não Math.floor.'],
  solution:`function evalRPN(tokens) {
  const ops = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => Math.trunc(a / b),
  };
  const stack = [];
  for (const t of tokens) {
    if (ops[t]) {
      const b = stack.pop(), a = stack.pop();
      stack.push(ops[t](a, b));
    } else {
      stack.push(Number(t));
    }
  }
  return stack.pop();
}`, time:'O(n)', space:'O(n)',
  lesson:'A pilha guarda resultados parciais até alguém precisar deles. É assim que calculadoras e interpretadores avaliam expressões, e a mesma ideia aparece em Basic Calculator e Decode String.' },

{ id:'daily-temperatures', lc:739, diff:'Medium', pattern:'Pilha Monotônica', fn:'dailyTemperatures', params:'temperatures', title:'Daily Temperatures',
  monster:'Morcego da Geada', sprite:'bat', pal:{k:'#0c1626',g:'#5a9fd4',w:'#e8f6ff'},
  story:'O morcego congela a escadaria. Para cada degrau, diga quantos passos faltam até um degrau mais quente.',
  desc:`<p>Dado o array <code>temperatures</code> com a temperatura de cada dia, retorne um array <code>answer</code> em que <code>answer[i]</code> é quantos dias você precisa esperar, a partir do dia <code>i</code>, até um dia <b>estritamente</b> mais quente.</p><p>Se esse dia não existir, use <code>0</code>. Cuidado com o teste de resistência: procurar à frente para cada dia é O(n²).</p>`,
  tests:[ {args:[[73,74,75,71,69,72,76,73]],expect:[1,1,4,2,1,1,0,0]}, {args:[[30,40,50,60]],expect:[1,1,1,0]},
          {args:[[30,60,90]],expect:[1,1,0]}, {args:[[50]],expect:[0]}, {args:[[70,70,70]],expect:[0,0,0]},
          {args:[[60,50,40,70]],expect:[3,2,1,0]},
          {args:[range(100000).map(i => 100000 - i)],expect:range(100000).map(() => 0),label:'temperatures = [100000, 99999, …, 1]'},
          {args:[range(99999).map(i => 99999 - i).concat([100000])],expect:range(99999).map(i => 99999 - i).concat([0]),label:'temperatures = [99999, 99998, …, 1, 100000]'} ],
  hints:['Um dia frio fica "esperando" até aparecer um dia mais quente. Quem está esperando há menos tempo é resolvido primeiro.','Guarde numa pilha os índices que ainda esperam. Para cada dia i, enquanto o topo da pilha for mais frio que hoje, desempilhe e anote i − topo. Depois empilhe i.'],
  solution:`function dailyTemperatures(temperatures) {
  const answer = new Array(temperatures.length).fill(0);
  const stack = []; // índices ainda sem dia mais quente, temperaturas decrescentes
  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}`, time:'O(n)', space:'O(n)',
  lesson:'Pilha monotônica: cada índice entra e sai uma vez só, por isso é O(n). Ela responde "qual o próximo maior (ou menor) à direita?" e volta em Next Greater Element, Stock Span e no chefe deste andar.' },

{ id:'find-min-rotated', lc:153, diff:'Medium', pattern:'Busca Binária', fn:'findMin', params:'nums', title:'Find Minimum in Rotated Sorted Array',
  monster:'Ouroboros Girado', sprite:'snake', pal:{k:'#10200c',g:'#6fae3a',L:'#c4e86b',w:'#f3efe2',r:'#d9483b'},
  story:'A serpente morde o próprio rabo e girou a fila de pedras. Ache onde fica a cauda, a menor de todas.',
  desc:`<p>Um array ordenado em ordem crescente, sem repetidos, foi <b>girado</b> algumas vezes: um pedaço do fim foi para o começo. Por exemplo, <code>[0,1,2,4,5,6,7]</code> pode virar <code>[4,5,6,7,0,1,2]</code>.</p><p>Dado esse array <code>nums</code>, retorne o menor elemento. O objetivo é O(log n): use busca binária em vez de olhar tudo.</p>`,
  tests:[ {args:[[3,4,5,1,2]],expect:1}, {args:[[4,5,6,7,0,1,2]],expect:0}, {args:[[11,13,15,17]],expect:11},
          {args:[[1]],expect:1}, {args:[[2,1]],expect:1}, {args:[[5,1,2,3,4]],expect:1},
          {args:[[-3,-1,0,2,-10,-5]],expect:-10},
          {args:[BIG.slice(31337).concat(BIG.slice(0, 31337))],expect:0,label:'nums = [31337, …, 99999, 0, …, 31336]'} ],
  hints:['Compare o meio com o último elemento. Se o meio for maior, a "quebra" do giro está à direita do meio.','Com lo e hi: se nums[mid] > nums[hi], faça lo = mid + 1; senão hi = mid (o meio pode ser o mínimo). Pare quando lo === hi.'],
  solution:`function findMin(nums) {
  let lo = 0, hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] > nums[hi]) lo = mid + 1;
    else hi = mid;
  }
  return nums[lo];
}`, time:'O(log n)', space:'O(1)',
  lesson:'Busca binária não exige array todo ordenado, só uma pergunta que divida o espaço em "lado bom" e "lado ruim". Aqui a pergunta é: o meio está antes ou depois da quebra?' },

{ id:'search-rotated', lc:33, diff:'Medium', pattern:'Busca Binária', fn:'search', params:'nums, target', title:'Search in Rotated Sorted Array',
  monster:'Olho do Giro', sprite:'eye', pal:{k:'#1a0c22',g:'#8e4fc2',L:'#d4a8f0',w:'#f3efe2',r:'#e0b43a'},
  story:'O olho gira a sala inteira sempre que você pisca. Encontre o alvo mesmo com o chão fora do lugar.',
  desc:`<p>O array <code>nums</code> estava em ordem crescente, sem repetidos, e foi girado em algum ponto desconhecido, como <code>[4,5,6,7,0,1,2]</code>.</p><p>Dado um <code>target</code>, retorne o índice dele em <code>nums</code>, ou <code>-1</code> se ele não existir. O objetivo é O(log n).</p>`,
  tests:[ {args:[[4,5,6,7,0,1,2],0],expect:4}, {args:[[4,5,6,7,0,1,2],3],expect:-1}, {args:[[1],0],expect:-1},
          {args:[[1],1],expect:0}, {args:[[3,1],1],expect:1}, {args:[[5,1,3],5],expect:0},
          {args:[[4,5,6,7,8,1,2,3],8],expect:4}, {args:[[6,7,1,2,3,4,5],6],expect:0},
          {args:[BIG.slice(31337).concat(BIG.slice(0, 31337)), 5],expect:68668,label:'nums = [31337, …, 99999, 0, …, 31336], target = 5'} ],
  hints:['Ao cortar no meio, pelo menos uma das duas metades está ordenada de verdade. Descubra qual.','Se nums[lo] <= nums[mid], a esquerda está ordenada: o alvo está nela se nums[lo] <= target < nums[mid]. Senão a direita está ordenada: confira nums[mid] < target <= nums[hi].'],
  solution:`function search(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (nums[mid] === target) return mid;
    if (nums[lo] <= nums[mid]) { // metade esquerda ordenada
      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
      else lo = mid + 1;
    } else { // metade direita ordenada
      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
      else hi = mid - 1;
    }
  }
  return -1;
}`, time:'O(log n)', space:'O(1)',
  lesson:'Quando o array não está todo ordenado, procure a parte que está e decida com ela. Isso volta em Search in Rotated Sorted Array II e em Find Peak Element.' },

{ id:'largest-rectangle', lc:84, diff:'Hard', pattern:'Pilha Monotônica', fn:'largestRectangleArea', params:'heights', title:'Largest Rectangle in Histogram', boss:true,
  monster:'Colosso dos Mil Pilares', sprite:'golem', pal:{k:'#16100a',g:'#7d6a58',L:'#b9a68c',y:'#ff7a2e'},
  story:'O chefe da torre é feito de pilares de pedra. Ele só cai quando você achar o maior bloco retangular escondido no corpo dele.',
  desc:`<p>O array <code>heights</code> descreve um histograma: cada barra tem largura 1 e altura <code>heights[i]</code>, e as barras ficam lado a lado.</p><p>Retorne a área do <b>maior retângulo</b> que cabe inteiro dentro do histograma. O teste de resistência derruba qualquer solução O(n²).</p>`,
  tests:[ {args:[[2,1,5,6,2,3]],expect:10}, {args:[[2,4]],expect:4}, {args:[[1]],expect:1}, {args:[[2,2,2,2]],expect:8},
          {args:[[6,2,5,4,5,1,6]],expect:12}, {args:[[5,4,3,2,1]],expect:9}, {args:[[0,0]],expect:0}, {args:[[2,0,2]],expect:2},
          {args:[BIG],expect:2500000000,label:'heights = [0, 1, …, 99999]'},
          {args:[range(100000).map(() => 1)],expect:100000,label:'heights = [1, 1, …, 1] (100000 barras)'} ],
  hints:['Para cada barra, o maior retângulo com a altura dela vai até a primeira barra mais baixa à esquerda e à direita.','Mantenha uma pilha de índices com alturas crescentes. Quando chegar uma barra mais baixa, desempilhe: a barra que saiu tem como limite direito o i atual e como limite esquerdo o novo topo da pilha. Use uma barra de altura 0 no fim para esvaziar tudo.'],
  solution:`function largestRectangleArea(heights) {
  const stack = []; // índices com alturas crescentes
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    while (stack.length && heights[stack[stack.length - 1]] >= h) {
      const height = heights[stack.pop()];
      const left = stack.length ? stack[stack.length - 1] + 1 : 0;
      best = Math.max(best, height * (i - left));
    }
    stack.push(i);
  }
  return best;
}`, time:'O(n)', space:'O(n)',
  lesson:'É a pilha monotônica de Daily Temperatures olhando para os dois lados ao mesmo tempo. Com ela, Maximal Rectangle (matriz de 0 e 1) vira este problema rodado uma vez por linha.' }
  ],
  /* modo guiado: [ferramenta que você já conhece, frase em português, código daquele passo] */
  guide: {
'eval-rpn': { think:'["2", "1", "+", "3", "*"]: guardo o 2, guardo o 1. Chega o +: pego os dois últimos, 2 + 1 = 3, e guardo o 3. Guardo outro 3. Chega o *: pego os dois últimos, 3 * 3 = 9. Sobrou só o 9: é a resposta.',
  plan:[
  ['array','Crie um array vazio para ser a pilha de números.','const pilha = [];'],
  ['for','Ande por cada token.','for (let i = 0; i < tokens.length; i++) {\n  const t = tokens[i];'],
  ['if','Se o token é um operador, tire dois números da pilha. O primeiro que sai é o da direita (b).',"if (t === '+' || t === '-' || t === '*' || t === '/') {\n  const b = pilha.pop();\n  const a = pilha.pop();"],
  ['if / else','Faça a conta certa e guarde o resultado de volta na pilha. Na divisão, Math.trunc corta em direção ao zero.',"let resultado;\nif (t === '+') resultado = a + b;\nelse if (t === '-') resultado = a - b;\nelse if (t === '*') resultado = a * b;\nelse resultado = Math.trunc(a / b);\npilha.push(resultado);\n}"],
  ['else','Se não é operador, é um número: converta e guarde na pilha. Feche o for.','else {\n  pilha.push(Number(t));\n}\n}'],
  ['return','No fim sobra um número só na pilha: é a resposta.','return pilha.pop();']]},
'daily-temperatures': { think:'[73, 74, 75, 71, 69, 72, 76]: o 73 espera e o 74 já é mais quente, então 1 dia. O 75 espera. O 71 espera, o 69 espera. Chega o 72: resolve o 69 (1 dia) e o 71 (2 dias), mas não o 75. Chega o 76: resolve o 72 e o 75 (4 dias). Quem espera há menos tempo sempre é resolvido primeiro.',
  plan:[
  ['array','Crie a resposta com um 0 para cada dia.','const resposta = [];\nfor (let i = 0; i < temperatures.length; i++) resposta.push(0);'],
  ['array','Crie uma pilha para guardar as posições dos dias que ainda esperam um dia mais quente.','const pilha = [];'],
  ['for','Ande por cada dia.','for (let i = 0; i < temperatures.length; i++) {'],
  ['while','Enquanto o dia no topo da pilha for mais frio que hoje, tire ele e anote quantos dias ele esperou.','while (pilha.length > 0 && temperatures[pilha[pilha.length - 1]] < temperatures[i]) {\n  const dia = pilha.pop();\n  resposta[dia] = i - dia;\n}'],
  ['array','Coloque o dia de hoje na pilha: agora ele também espera. Feche o for.','pilha.push(i);\n}'],
  ['return','Devolva a resposta. Quem ficou na pilha nunca achou dia mais quente e continua com 0.','return resposta;']]},
'find-min-rotated': { think:'[4, 5, 6, 7, 0, 1, 2]: o meio é 7 e o último é 2. O 7 é maior que o 2, então a quebra (onde o menor mora) está à direita do 7. Sobra [0, 1, 2]: o meio é 1, menor que o último, então o menor está no 1 ou antes. Sobra [0]: achei.',
  plan:[
  ['variável','Marque o começo e o fim da parte onde o menor pode estar.','let inicio = 0;\nlet fim = nums.length - 1;'],
  ['while','Enquanto sobrar mais de um candidato, continue cortando.','while (inicio < fim) {'],
  ['variável','Ache a posição do meio.','const meio = Math.floor((inicio + fim) / 2);'],
  ['if / else','Se o meio é maior que o último, o menor está depois do meio. Senão, o menor é o meio ou está antes dele. Feche o while.','if (nums[meio] > nums[fim]) {\n  inicio = meio + 1;\n} else {\n  fim = meio;\n}\n}'],
  ['return','Sobrou um candidato só: ele é o menor.','return nums[inicio];']]},
'search-rotated': { think:'Procuro 0 em [4, 5, 6, 7, 0, 1, 2]. O meio é 7. A esquerda [4, 5, 6, 7] está em ordem, mas o 0 não cabe entre 4 e 7, então vou para a direita: [0, 1, 2]. O meio é 1, a esquerda [0, 1] está em ordem e o 0 cabe nela. Sobra [0]: achei na posição 4.',
  plan:[
  ['variável','Marque o começo e o fim da parte onde o alvo pode estar.','let inicio = 0;\nlet fim = nums.length - 1;'],
  ['while','Enquanto ainda sobrar espaço para procurar, continue.','while (inicio <= fim) {\n  const meio = Math.floor((inicio + fim) / 2);'],
  ['if','Se o meio é o alvo, devolva a posição.','if (nums[meio] === target) return meio;'],
  ['if / else','Se a metade da esquerda está em ordem, veja se o alvo cabe nela. Se cabe, fique na esquerda; senão, vá para a direita.','if (nums[inicio] <= nums[meio]) {\n  if (nums[inicio] <= target && target < nums[meio]) {\n    fim = meio - 1;\n  } else {\n    inicio = meio + 1;\n  }\n}'],
  ['else','Senão, a metade da direita é que está em ordem: faça a mesma pergunta com ela. Feche o while.','else {\n  if (nums[meio] < target && target <= nums[fim]) {\n    inicio = meio + 1;\n  } else {\n    fim = meio - 1;\n  }\n}\n}'],
  ['return','Se o espaço acabou, o alvo não existe.','return -1;']]},
'largest-rectangle': { think:'[2, 1, 5, 6, 2, 3]: guardo as barras enquanto elas sobem: 1, 5, 6. Chega o 2, mais baixo. O 6 não pode passar dele: retângulo 6 x 1 = 6. O 5 também não: ele vai do 5 até o 6, 5 x 2 = 10. O 1 aguenta. No fim, cada barra que sobra mede até a borda. O maior foi 10.',
  plan:[
  ['array','Crie uma pilha de posições, com alturas sempre subindo, e a melhor área até agora.','const pilha = [];\nlet maior = 0;'],
  ['for','Ande por cada barra e por uma barra extra de altura 0 no fim, que obriga a pilha a esvaziar.','for (let i = 0; i <= heights.length; i++) {\n  let altura = 0;\n  if (i < heights.length) altura = heights[i];'],
  ['while','Enquanto a barra do topo for mais alta ou igual à atual, ela não passa daqui: tire ela da pilha.','while (pilha.length > 0 && heights[pilha[pilha.length - 1]] >= altura) {\n  const alturaTopo = heights[pilha.pop()];'],
  ['if / else','O retângulo dela começa logo depois da barra que ficou no topo da pilha, ou no começo se a pilha esvaziou.','let comeco = 0;\nif (pilha.length > 0) comeco = pilha[pilha.length - 1] + 1;'],
  ['if','A largura vai do começo até antes de i. Se a área for a maior, guarde. Feche o while.','const area = alturaTopo * (i - comeco);\nif (area > maior) maior = area;\n}'],
  ['array','Guarde a posição atual na pilha. Feche o for.','pilha.push(i);\n}'],
  ['return','Devolva a maior área.','return maior;']]}
  }
});
