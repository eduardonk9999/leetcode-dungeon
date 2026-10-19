/* Andar 9 · A Cripta da Memória: programação dinâmica. Cada sala treina o mesmo ritual: o que dp guarda, o caso base, a recorrência e a casa da resposta. */
addFloor({
  name: 'A Cripta da Memória',
  theme: 'Programação Dinâmica',
  levels: [
{ id:'house-robber', lc:198, diff:'Medium', pattern:'Prog. Dinâmica', fn:'rob', params:'nums', title:'House Robber',
  monster:'Esqueleto Saqueador', sprite:'skeleton', pal:{k:'#16121e',g:'#d8cfb8',r:'#9b6cd8'},
  story:'Um esqueleto ladrão percorre a fileira de túmulos. Se abrir dois vizinhos, o alarme dos mortos dispara.',
  desc:`<p>Cada posição de <code>nums</code> é um túmulo com <code>nums[i]</code> moedas. Você pode saquear quantos quiser, mas nunca dois túmulos <b>vizinhos</b>.</p><p>Retorne o maior total de moedas possível.</p><p>O teste com 100 túmulos derruba a recursão que testa todas as escolhas sem memória.</p>`,
  tests:[ {args:[[1,2,3,1]],expect:4}, {args:[[2,7,9,3,1]],expect:12}, {args:[[5]],expect:5}, {args:[[2,1,1,2]],expect:4},
          {args:[[10,1,1,10]],expect:20}, {args:[[0,0,0]],expect:0},
          {args:[range(100).map(i => (i * 37 + 11) % 401)],expect:10716,label:'nums = 100 túmulos, valores (i·37 + 11) mod 401'} ],
  hints:['Olhe o último túmulo: ou você saqueia ele, ou não. Se saquear, o vizinho de antes fica proibido.','melhor(i) = max(melhor(i−1), melhor(i−2) + nums[i]). Calcule da esquerda para a direita; só os dois últimos valores importam.'],
  solution:`function rob(nums) {
  let prev = 0, cur = 0; // melhor até i-2 e até i-1
  for (const x of nums) {
    [prev, cur] = [cur, Math.max(cur, prev + x)];
  }
  return cur;
}`, time:'O(n)', space:'O(1)',
  lesson:'É o Climbing Stairs com uma escolha em cada degrau: pegar ou pular. Toda DP de "não pode pegar dois seguidos" tem essa cara.' },

{ id:'house-robber-ii', lc:213, diff:'Medium', pattern:'Prog. Dinâmica', fn:'rob', params:'nums', title:'House Robber II',
  monster:'Espectro do Círculo', sprite:'ghost', pal:{k:'#1a1430',g:'#a9a0d8',w:'#efeaff',r:'#5ce0b0'},
  story:'Aqui os túmulos formam um círculo de pedra. O espectro ri: o primeiro e o último são vizinhos.',
  desc:`<p>Igual à sala anterior, mas os túmulos estão em <b>círculo</b>: o primeiro e o último são vizinhos. Nunca saqueie dois vizinhos.</p><p>Dado <code>nums</code>, retorne o maior total possível. Com um túmulo só, ele não tem vizinho nenhum.</p>`,
  tests:[ {args:[[2,3,2]],expect:3}, {args:[[1,2,3,1]],expect:4}, {args:[[1,2,3]],expect:3}, {args:[[5]],expect:5},
          {args:[[1,2]],expect:2}, {args:[[200,3,140,20,10]],expect:340}, {args:[[2,7,9,3,1]],expect:11}, {args:[[4,1,2,7,5,3,1]],expect:14},
          {args:[range(100).map(i => (i * 37 + 11) % 401)],expect:10705,label:'nums = 100 túmulos, valores (i·37 + 11) mod 401'} ],
  hints:['O primeiro e o último nunca entram juntos. Então pelo menos um deles fica de fora.','Resolva o House Robber normal duas vezes: sem o último túmulo e sem o primeiro. A resposta é o maior dos dois. Cuidado com um túmulo só.'],
  solution:`function rob(nums) {
  if (nums.length === 1) return nums[0];
  const line = (lo, hi) => {
    let prev = 0, cur = 0;
    for (let i = lo; i <= hi; i++) [prev, cur] = [cur, Math.max(cur, prev + nums[i])];
    return cur;
  };
  return Math.max(line(0, nums.length - 2), line(1, nums.length - 1));
}`, time:'O(n)', space:'O(1)',
  lesson:'Quando um problema circular parece novo, quebre o círculo em casos lineares que você já sabe resolver. O mesmo truque aparece em problemas de arranjos circulares e de janela em anel.' },

{ id:'coin-change', lc:322, diff:'Medium', pattern:'Prog. Dinâmica', fn:'coinChange', params:'coins, amount', title:'Coin Change',
  monster:'Mímico do Troco', sprite:'mimic', pal:{k:'#1a1208',g:'#6b4a2a',y:'#d9b24a',w:'#f3efe2',r:'#b8434b'},
  story:'O baú cobra pedágio exato. Pague com o menor número de moedas ou vire comida de mímico.',
  desc:`<p>Você tem moedas dos valores em <code>coins</code>, com estoque infinito de cada uma. Retorne o <b>menor número de moedas</b> que somam exatamente <code>amount</code>.</p><p>Se não houver jeito, retorne <code>-1</code>. Para <code>amount = 0</code> a resposta é <code>0</code>.</p><p>Escolher sempre a maior moeda não funciona, e a recursão sem memória não termina a tempo no teste grande.</p>`,
  tests:[ {args:[[1,2,5],11],expect:3}, {args:[[2],3],expect:-1}, {args:[[1],0],expect:0}, {args:[[1,3,4],6],expect:2},
          {args:[[3,7],5],expect:-1}, {args:[[2,5,10,1],27],expect:4}, {args:[[5,10,25],30],expect:2},
          {args:[[186,419,83,408],6249],expect:20} ],
  hints:['Escolher sempre a maior moeda falha: com [1, 3, 4] e 6, pegar o 4 primeiro dá 4+1+1, mas 3+3 usa só duas moedas.','Monte dp[v] = menor número de moedas para formar v, de 0 até amount. dp[v] = min(dp[v − moeda] + 1) para cada moeda que cabe em v.'],
  solution:`function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let v = 1; v <= amount; v++) {
    for (const c of coins) {
      if (c <= v && dp[v - c] + 1 < dp[v]) dp[v] = dp[v - c] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`, time:'O(amount · moedas)', space:'O(amount)',
  lesson:'É a DP de mochila ilimitada: cada valor depende de valores menores. Usar Infinity como "impossível" evita um monte de if, e só no fim você troca por -1.' },

{ id:'longest-increasing-subsequence', lc:300, diff:'Medium', pattern:'Prog. Dinâmica', fn:'lengthOfLIS', params:'nums', title:'Longest Increasing Subsequence',
  monster:'Serpente Ascendente', sprite:'snake', pal:{k:'#0c1a12',g:'#4f8a3c',L:'#9ed36a',w:'#f3efe2',r:'#d24b4b'},
  story:'A serpente só engole ossos cada vez maiores. Diga quantos ela consegue engolir em ordem.',
  desc:`<p>Dado o array <code>nums</code>, retorne o tamanho da maior subsequência <b>estritamente crescente</b>.</p><p>Uma subsequência mantém a ordem original, mas pode pular elementos: <code>[2, 3, 7, 18]</code> é subsequência de <code>[10, 9, 2, 5, 3, 7, 101, 18]</code>.</p>`,
  tests:[ {args:[[10,9,2,5,3,7,101,18]],expect:4}, {args:[[0,1,0,3,2,3]],expect:4}, {args:[[7,7,7,7,7,7,7]],expect:1}, {args:[[5]],expect:1},
          {args:[[4,10,4,3,8,9]],expect:3}, {args:[[-2,-1]],expect:2}, {args:[[3,5,6,2,5,4,19,5,6,7,12]],expect:6},
          {args:[range(2500)],expect:2500,label:'nums = [0, 1, …, 2499]'},
          {args:[range(2500).map(i => (i * 7919) % 2503)],expect:49,label:'nums = 2500 valores embaralhados, (i·7919) mod 2503'} ],
  hints:['Pense na maior subsequência que <b>termina</b> exatamente em nums[i]. Quem pode vir antes dele?','dp[i] = 1 + max(dp[j]) para todo j < i com nums[j] < nums[i]. A resposta é o maior dp, não necessariamente o último.'],
  solution:`function lengthOfLIS(nums) {
  // tails[k] = menor final possível de uma subsequência crescente de tamanho k + 1
  const tails = [];
  for (const x of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = x;
  }
  return tails.length;
}`, time:'O(n log n) (a DP do guia é O(n²))', space:'O(n)',
  lesson:'"A melhor resposta que termina em i" é a definição de estado mais comum em DP de sequência. A versão O(n log n) troca a DP por busca binária num array de finais.' },

{ id:'unique-paths', lc:62, diff:'Medium', pattern:'Prog. Dinâmica 2D', fn:'uniquePaths', params:'m, n', title:'Unique Paths',
  monster:'Aranha das Lajes', sprite:'spider', pal:{k:'#120e18',g:'#4a3b5c',L:'#8c78a8',w:'#e8e0f0',r:'#e04a6a'},
  story:'O chão da cripta é uma grade de lajes. A aranha tece um fio por cada caminho possível até a saída.',
  desc:`<p>Um robô começa no canto de cima à esquerda de uma grade com <code>m</code> linhas e <code>n</code> colunas. Ele só anda para a <b>direita</b> ou para <b>baixo</b>.</p><p>Retorne quantos caminhos diferentes levam até o canto de baixo à direita.</p><p>No teste 17 × 17, a recursão sem memória faz mais de um bilhão de chamadas.</p>`,
  tests:[ {args:[3,7],expect:28}, {args:[3,2],expect:3}, {args:[1,1],expect:1}, {args:[1,10],expect:1}, {args:[7,3],expect:28},
          {args:[10,10],expect:48620}, {args:[23,12],expect:193536720}, {args:[17,17],expect:601080390} ],
  hints:['Para chegar numa casa, o robô veio de cima ou da esquerda. Nada mais.','caminhos(i, j) = caminhos(i − 1, j) + caminhos(i, j − 1). A primeira linha e a primeira coluna têm um caminho só.'],
  solution:`function uniquePaths(m, n) {
  const row = new Array(n).fill(1); // linha atual da grade
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) row[j] += row[j - 1];
  }
  return row[n - 1];
}`, time:'O(m · n)', space:'O(n)',
  lesson:'DP em grade: cada casa soma as casas de onde dá para chegar. Dá para guardar só uma linha. A resposta também é a combinação C(m + n − 2, m − 1).' },

{ id:'word-break', lc:139, diff:'Medium', pattern:'Prog. Dinâmica', fn:'wordBreak', params:'s, wordDict', title:'Word Break',
  monster:'Olho do Grimório', sprite:'eye', pal:{k:'#140a14',g:'#7a2e5c',L:'#c46a9c',w:'#f6e8d0',r:'#2a0a20'},
  story:'Um olho preso num grimório só deixa passar quem separar o feitiço em palavras que ele conhece.',
  desc:`<p>Dada a string <code>s</code> e uma lista de palavras <code>wordDict</code>, retorne <code>true</code> se dá para cortar <code>s</code> em pedaços que sejam todos palavras da lista.</p><p>A mesma palavra pode ser usada várias vezes.</p><p>Cuidado com o feitiço <code>"aaa…ab"</code>: testar todos os cortes sem memória explode.</p>`,
  tests:[ {args:['leetcode',['leet','code']],expect:true}, {args:['applepenapple',['apple','pen']],expect:true},
          {args:['catsandog',['cats','dog','sand','and','cat']],expect:false}, {args:['a',['b']],expect:false},
          {args:['cars',['car','ca','rs']],expect:true}, {args:['aaaaaaa',['aaaa','aaa']],expect:true},
          {args:['a'.repeat(150) + 'b',['a','aa','aaa','aaaa','aaaaa','aaaaaa','aaaaaaa','aaaaaaaa','aaaaaaaaa','aaaaaaaaaa']],expect:false,label:'s = "a" × 150 + "b", wordDict = ["a", "aa", …, "a" × 10]'},
          {args:['a'.repeat(150),['a','aa','aaa','aaaa','aaaaa','aaaaaa','aaaaaaa','aaaaaaaa','aaaaaaaaa','aaaaaaaaaa']],expect:true,label:'s = "a" × 150, wordDict = ["a", "aa", …, "a" × 10]'} ],
  hints:['Se o começo de s até a posição j já pode ser cortado, basta o resto de j até i ser uma palavra.','dp[i] = true se os primeiros i caracteres podem ser cortados. dp[0] = true. dp[i] = existe j < i com dp[j] e s.slice(j, i) no dicionário.'],
  solution:`function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const dp = new Array(s.length + 1).fill(false);
  dp[0] = true; // o prefixo vazio sempre dá
  for (let i = 1; i <= s.length; i++) {
    for (let j = 0; j < i && !dp[i]; j++) {
      if (dp[j] && words.has(s.slice(j, i))) dp[i] = true;
    }
  }
  return dp[s.length];
}`, time:'O(n² · k), k = tamanho da palavra', space:'O(n + dicionário)',
  lesson:'DP sobre prefixos: "dá para resolver até aqui?" vira um array de booleanos. A recursão ingênua refaz os mesmos sufixos milhões de vezes; a memória deixa cada um ser resolvido uma vez só.' },

{ id:'longest-common-subsequence', lc:1143, diff:'Medium', pattern:'Prog. Dinâmica 2D', fn:'longestCommonSubsequence', params:'text1, text2', title:'Longest Common Subsequence',
  monster:'Golem das Duas Lápides', sprite:'golem', pal:{k:'#141418',g:'#5a5e6a',L:'#9aa0ac',y:'#7cf0c8'},
  story:'Duas lápides com inscrições diferentes. O golem só acorda quem achar o maior trecho que as duas têm em comum.',
  desc:`<p>Dadas duas strings <code>text1</code> e <code>text2</code>, retorne o tamanho da maior <b>subsequência comum</b> às duas, ou <code>0</code> se não houver nenhuma.</p><p>Subsequência mantém a ordem, mas pode pular letras: <code>"ace"</code> é subsequência de <code>"abcde"</code>.</p>`,
  tests:[ {args:['abcde','ace'],expect:3}, {args:['abc','abc'],expect:3}, {args:['abc','def'],expect:0}, {args:['bl','yby'],expect:1},
          {args:['ezupkr','ubmrapg'],expect:2}, {args:['abcba','abcbcba'],expect:5}, {args:['a','a'],expect:1},
          {args:['ab'.repeat(500),'ba'.repeat(500)],expect:999,label:'text1 = "ab" × 500, text2 = "ba" × 500'},
          {args:['abcdefghij'.repeat(100),'jihgfedcba'.repeat(100)],expect:199,label:'text1 = "abcdefghij" × 100, text2 = "jihgfedcba" × 100'} ],
  hints:['Compare as últimas letras dos dois prefixos. Se forem iguais, elas entram juntas na resposta. Se não, uma das duas fica de fora.','dp[i][j] para os primeiros i caracteres de text1 e j de text2. Iguais: dp[i−1][j−1] + 1. Diferentes: max(dp[i−1][j], dp[i][j−1]).'],
  solution:`function longestCommonSubsequence(text1, text2) {
  const n = text1.length, m = text2.length;
  let prev = new Array(m + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const cur = new Array(m + 1).fill(0);
    for (let j = 1; j <= m; j++) {
      cur[j] = text1[i - 1] === text2[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[m];
}`, time:'O(n · m)', space:'O(m)',
  lesson:'Duas strings, uma tabela: dp[i][j] olha os prefixos das duas. É a base do diff de arquivos e da comparação de DNA, e o chefe deste andar usa a mesma tabela.' },

{ id:'edit-distance', lc:72, diff:'Medium', pattern:'Prog. Dinâmica 2D', fn:'minDistance', params:'word1, word2', title:'Edit Distance', boss:true,
  monster:'Dracolich Reescritor', sprite:'dragon', flip:true, pal:{k:'#0e0a14',g:'#4b3a66',L:'#9a86c4',y:'#5cf08a',w:'#ece4d0'},
  story:'O chefe da cripta. Um dragão morto-vivo reescreve o nome de quem entra, letra por letra. Prove que sabe o menor custo da transformação.',
  desc:`<p>Dadas <code>word1</code> e <code>word2</code>, retorne o <b>menor número de operações</b> para transformar <code>word1</code> em <code>word2</code>.</p><p>Cada operação custa 1: <b>inserir</b> uma letra, <b>apagar</b> uma letra ou <b>trocar</b> uma letra por outra.</p>`,
  tests:[ {args:['horse','ros'],expect:3}, {args:['intention','execution'],expect:5}, {args:['',''],expect:0}, {args:['','abc'],expect:3},
          {args:['abc',''],expect:3}, {args:['abc','abc'],expect:0}, {args:['a','b'],expect:1}, {args:['kitten','sitting'],expect:3},
          {args:['plasma','altruism'],expect:6},
          {args:['abcd'.repeat(125),'dcba'.repeat(125)],expect:252,label:'word1 = "abcd" × 125, word2 = "dcba" × 125'} ],
  hints:['Olhe só a última letra de cada prefixo. Se forem iguais, não custa nada. Se não, você apaga, insere ou troca, e sobra um problema menor.','dp[i][j] = custo para transformar os primeiros i de word1 nos primeiros j de word2. dp[i][0] = i, dp[0][j] = j. Diferentes: 1 + min(cima, esquerda, diagonal).'],
  solution:`function minDistance(word1, word2) {
  const n = word1.length, m = word2.length;
  let prev = Array.from({ length: m + 1 }, (_, j) => j); // linha i = 0
  for (let i = 1; i <= n; i++) {
    const cur = [i];
    for (let j = 1; j <= m; j++) {
      cur[j] = word1[i - 1] === word2[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
    }
    prev = cur;
  }
  return prev[m];
}`, time:'O(n · m)', space:'O(m)',
  lesson:'É a tabela do LCS com custos: cada vizinho da casa é uma operação. Distância de Levenshtein aparece em corretor ortográfico, busca aproximada e bioinformática.' }
  ],
  /* modo guiado: [ferramenta que você já conhece, frase em português, código daquele passo] */
  guide: {
'house-robber': { think:'[2, 7, 9, 3, 1]: só com o 1º túmulo, o melhor é 2. Com dois, o melhor é 7. No 9: ou fico com 7, ou pego 2 + 9 = 11. No 3: fico com 11 ou 7 + 3 = 10, então 11. No 1: 11 ou 11 + 1 = 12. Resposta 12.',
  plan:[
  ['if','Se só houver um túmulo, saqueie ele.','if (nums.length === 1) return nums[0];'],
  ['array','Crie o array dp. dp[i] é o máximo de moedas olhando só os túmulos de 0 até i.','const dp = [];'],
  ['variável','Casos base: com um túmulo, pegue ele. Com dois, pegue o mais rico.','dp[0] = nums[0];\ndp[1] = Math.max(nums[0], nums[1]);'],
  ['for','Do túmulo 2 em diante: pule este (fica dp[i - 1]) ou saqueie ele somando dp[i - 2]. Guarde o maior.','for (let i = 2; i < nums.length; i++) {\n  dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i]);\n}'],
  ['return','A resposta está na última casa do dp.','return dp[nums.length - 1];']]},
'house-robber-ii': { think:'[2, 3, 2] em círculo: o primeiro 2 e o último 2 são vizinhos, não dá para pegar os dois. Sem o último sobra [2, 3], melhor 3. Sem o primeiro sobra [3, 2], melhor 3. Resposta 3.',
  plan:[
  ['if','Com um túmulo só, ele não tem vizinho: saqueie ele.','if (nums.length === 1) return nums[0];'],
  ['função','Crie uma função que resolve uma fileira reta (o House Robber da sala anterior). Se a fileira tiver um túmulo, devolva ele.','function fileira(casas) {\n  if (casas.length === 1) return casas[0];'],
  ['array','Dentro dela, dp[i] é o máximo olhando os túmulos de 0 até i. Casos base: dp[0] é o primeiro, dp[1] é o mais rico dos dois primeiros.','const dp = [casas[0], Math.max(casas[0], casas[1])];'],
  ['for','Para cada túmulo seguinte, pule ele (dp[i - 1]) ou saqueie somando dp[i - 2].','for (let i = 2; i < casas.length; i++) {\n  dp[i] = Math.max(dp[i - 1], dp[i - 2] + casas[i]);\n}'],
  ['return','Devolva a última casa do dp. Feche a função.','return dp[casas.length - 1];\n}'],
  ['return','O primeiro e o último nunca vão juntos: resolva a fileira sem o último, depois sem o primeiro, e fique com o maior.','const semUltimo = fileira(nums.slice(0, nums.length - 1));\nconst semPrimeiro = fileira(nums.slice(1));\nreturn Math.max(semUltimo, semPrimeiro);']]},
'coin-change': { think:'Moedas [1, 2, 5], valor 11. Para formar 0 preciso de 0 moedas. Para formar 1, uma moeda de 1. Para formar 11, a última moeda foi 1, 2 ou 5: olho quantas eu precisava para 10, 9 e 6, pego a menor e somo 1. O 10 sai com 2 moedas, então 11 sai com 3.',
  plan:[
  ['array','Crie o array dp de 0 até amount. dp[v] é o menor número de moedas que formam v. Comece tudo com Infinity, que quer dizer "ainda impossível".','const dp = [];\nfor (let v = 0; v <= amount; v++) {\n  dp.push(Infinity);\n}'],
  ['variável','Caso base: formar 0 não precisa de moeda nenhuma.','dp[0] = 0;'],
  ['for','Ande por cada valor de 1 até amount, e para cada valor teste cada moeda.','for (let v = 1; v <= amount; v++) {\n  for (let i = 0; i < coins.length; i++) {\n    const moeda = coins[i];'],
  ['if','Se a moeda cabe em v, a última moeda pode ser ela: custa dp[v - moeda] + 1. Se for melhor, guarde. Feche os dois for.','if (moeda <= v && dp[v - moeda] + 1 < dp[v]) {\n  dp[v] = dp[v - moeda] + 1;\n}\n}\n}'],
  ['if','A resposta está em dp[amount]. Se continuou Infinity, não tem jeito: devolva -1.','if (dp[amount] === Infinity) return -1;\nreturn dp[amount];']]},
'longest-increasing-subsequence': { think:'[10, 9, 2, 5, 3, 7, 101, 18]: terminando no 10, tamanho 1. No 9, 1. No 2, 1. No 5, posso vir do 2: 2. No 3, do 2: 2. No 7, do 5 ou do 3: 3. No 101, do 7: 4. No 18, do 7: 4. O maior de todos é 4.',
  plan:[
  ['array','Crie o array dp. dp[i] é o tamanho da maior subsequência crescente que termina exatamente em nums[i]. Caso base: sozinho, cada número já forma uma de tamanho 1.','const dp = [];\nfor (let i = 0; i < nums.length; i++) {\n  dp.push(1);\n}'],
  ['variável','Guarde o maior tamanho encontrado.','let maior = 1;'],
  ['for','Para cada posição i, olhe todas as posições j antes dela.','for (let i = 1; i < nums.length; i++) {\n  for (let j = 0; j < i; j++) {'],
  ['if','Se nums[j] é menor, dá para colocar nums[i] depois da subsequência que termina em j. Feche o for de dentro.','if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {\n  dp[i] = dp[j] + 1;\n}\n}'],
  ['if','Se dp[i] é o maior até agora, guarde. Feche o for de fora.','if (dp[i] > maior) maior = dp[i];\n}'],
  ['return','A resposta é o maior valor do dp, não a última casa.','return maior;']]},
'unique-paths': { think:'Grade 3 × 2. Na primeira linha e na primeira coluna só há um caminho: em linha reta. Na casa (1, 1) chego de cima (1) ou da esquerda (1): 2. Na casa (2, 1) chego de cima (2) ou da esquerda (1): 3. Resposta 3.',
  plan:[
  ['array','Crie a grade dp com m linhas e n colunas. dp[i][j] é o número de caminhos do início até a casa (i, j). Comece tudo com 1: é o caso base da primeira linha e da primeira coluna.','const dp = [];\nfor (let i = 0; i < m; i++) {\n  dp.push(new Array(n).fill(1));\n}'],
  ['for','Ande pelas linhas a partir da segunda.','for (let i = 1; i < m; i++) {'],
  ['for','Dentro dela, ande pelas colunas a partir da segunda.','for (let j = 1; j < n; j++) {'],
  ['variável','Só dá para chegar aqui vindo de cima ou da esquerda: some os dois. Feche os dois for.','dp[i][j] = dp[i - 1][j] + dp[i][j - 1];\n}\n}'],
  ['return','A resposta está no canto de baixo à direita.','return dp[m - 1][n - 1];']]},
'word-break': { think:'"leetcode" com ["leet", "code"]: o começo vazio sempre dá. "leet" é palavra, então até a posição 4 dá. De 4 até 8 sobra "code", que é palavra. Então até o fim dá: true.',
  plan:[
  ['objeto','Coloque as palavras num objeto para consultar rápido se um pedaço é palavra.','const dicionario = {};\nfor (let i = 0; i < wordDict.length; i++) {\n  dicionario[wordDict[i]] = true;\n}'],
  ['array','Crie o array dp com s.length + 1 casas, todas false. dp[i] diz se os primeiros i caracteres podem ser cortados em palavras.','const dp = [];\nfor (let i = 0; i <= s.length; i++) {\n  dp.push(false);\n}'],
  ['variável','Caso base: o começo vazio sempre pode ser cortado.','dp[0] = true;'],
  ['for','Para cada fim i, teste cada ponto de corte j antes dele.','for (let i = 1; i <= s.length; i++) {\n  for (let j = 0; j < i; j++) {'],
  ['if','Se até j já dá e o pedaço de j até i é palavra, então até i também dá. Pode parar de testar cortes. Feche os dois for.','if (dp[j] && dicionario[s.slice(j, i)]) {\n  dp[i] = true;\n  break;\n}\n}\n}'],
  ['return','A resposta está na última casa: a string inteira.','return dp[s.length];']]},
'longest-common-subsequence': { think:'"abcde" e "ace": as duas começam com a, conta 1. Depois b não casa com c, pulo o b. c casa com c, conta 2. d não casa com e, pulo o d. e casa com e, conta 3. Resposta 3.',
  plan:[
  ['variável','Guarde os tamanhos das duas strings.','const n = text1.length;\nconst m = text2.length;'],
  ['array','Crie a tabela dp com n + 1 linhas e m + 1 colunas, toda com 0. dp[i][j] é a maior subsequência comum entre os primeiros i caracteres de text1 e os primeiros j de text2. Caso base: com um lado vazio, a resposta é 0.','const dp = [];\nfor (let i = 0; i <= n; i++) {\n  dp.push(new Array(m + 1).fill(0));\n}'],
  ['for','Ande por todas as casas, começando em 1 nas duas direções.','for (let i = 1; i <= n; i++) {\n  for (let j = 1; j <= m; j++) {'],
  ['if','Se as últimas letras dos dois prefixos são iguais, elas entram juntas: diagonal + 1.','if (text1[i - 1] === text2[j - 1]) {\n  dp[i][j] = dp[i - 1][j - 1] + 1;\n}'],
  ['else','Se não, deixe uma das duas letras de fora e fique com o melhor: cima ou esquerda. Feche os dois for.','else {\n  dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n}\n}\n}'],
  ['return','A resposta está na última casa da tabela.','return dp[n][m];']]},
'edit-distance': { think:'"horse" para "ros": troco o h por r e fica "rorse". Apago o primeiro r do meio e fica "rose". Apago o e e fica "ros". Foram 3 operações, e a tabela confirma que não dá com menos.',
  plan:[
  ['variável','Guarde os tamanhos das duas palavras.','const n = word1.length;\nconst m = word2.length;'],
  ['array','Crie a tabela dp com n + 1 linhas e m + 1 colunas. dp[i][j] é o menor número de operações para transformar os primeiros i caracteres de word1 nos primeiros j de word2.','const dp = [];\nfor (let i = 0; i <= n; i++) {\n  dp.push(new Array(m + 1).fill(0));\n}'],
  ['for','Casos base: transformar i letras em nada custa i remoções. Transformar nada em j letras custa j inserções.','for (let i = 0; i <= n; i++) dp[i][0] = i;\nfor (let j = 0; j <= m; j++) dp[0][j] = j;'],
  ['for','Ande por todas as outras casas da tabela, começando em 1.','for (let i = 1; i <= n; i++) {\n  for (let j = 1; j <= m; j++) {'],
  ['if','Se as últimas letras são iguais, não custa nada: copie a diagonal.','if (word1[i - 1] === word2[j - 1]) {\n  dp[i][j] = dp[i - 1][j - 1];\n}'],
  ['else','Senão, pague 1 pela melhor operação: apagar (casa de cima), inserir (casa da esquerda) ou trocar (diagonal). Feche os dois for.','else {\n  dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n}\n}\n}'],
  ['return','A resposta está na última casa da tabela.','return dp[n][m];']]}
  }
});
