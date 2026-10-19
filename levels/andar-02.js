/* Andar 2 · A Biblioteca Proibida: contar, agrupar e consultar em O(1) com objetos, Maps e Sets. */
addFloor({
  name: 'A Biblioteca Proibida',
  theme: 'Arrays & Hashing',
  levels: [
{ id:'group-anagrams', lc:49, diff:'Medium', pattern:'Hash Map', fn:'groupAnagrams', params:'strs', title:'Group Anagrams',
  monster:'Espectro dos Anagramas', sprite:'ghost', pal:{k:'#1e1430',g:'#c9b8f0',w:'#f3efe2',r:'#8a5cd6'},
  story:'Um espectro bagunçou os pergaminhos da estante. Os que têm as mesmas letras precisam voltar para a mesma prateleira.',
  desc:`<p>Dado um array de strings <code>strs</code>, junte num mesmo grupo as palavras que são anagramas umas das outras, ou seja, que usam exatamente as mesmas letras nas mesmas quantidades.</p><p>Retorne a lista de grupos. A ordem dos grupos e a ordem das palavras dentro de cada grupo não importam.</p>`,
  cmp:'groups',
  tests:[ {args:[['eat','tea','tan','ate','nat','bat']],expect:[['bat'],['nat','tan'],['ate','eat','tea']]},
          {args:[['']],expect:[['']]},
          {args:[['a']],expect:[['a']]},
          {args:[['aab','aba','baa','abb']],expect:[['aab','aba','baa'],['abb']]},
          {args:[['ab','ba','abc','a','b','']],expect:[['ab','ba'],['abc'],['a'],['b'],['']]},
          {args:[['ola','ola','alo','lua']],expect:[['ola','ola','alo'],['lua']]} ],
  hints:['Duas palavras são anagramas quando, depois de arrumadas, viram a mesma coisa. Que "assinatura" todas as palavras de um grupo têm em comum?','Use as letras ordenadas como chave de um objeto: chave → lista de palavras. No fim, devolva os valores do objeto.'],
  solution:`function groupAnagrams(strs) {
  const groups = new Map(); // letras ordenadas -> palavras
  for (const w of strs) {
    const key = [...w].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()];
}`, time:'O(n · m log m), m = tamanho da palavra', space:'O(n · m)',
  lesson:'Agrupar por uma chave canônica é um padrão muito comum: tudo que é "igual de algum jeito" vira a mesma chave. Trocar a ordenação por uma contagem das 26 letras deixa a chave em O(m).' },

{ id:'top-k-frequent', lc:347, diff:'Medium', pattern:'Contagem', fn:'topKFrequent', params:'nums, k', title:'Top K Frequent Elements',
  monster:'Mímico Colecionador', sprite:'mimic', pal:{k:'#24140a',g:'#9a6233',y:'#f2c14e',w:'#f3efe2',r:'#d6453d'},
  story:'Um baú vivo guarda as moedas que mais aparecem no tesouro. Diga quais são antes que ele feche a boca.',
  desc:`<p>Dado o array de inteiros <code>nums</code> e um inteiro <code>k</code>, retorne os <code>k</code> valores que aparecem mais vezes.</p><p>A resposta é única e pode estar em qualquer ordem. Tente fazer melhor que ordenar tudo, O(n log n).</p>`,
  cmp:'unordered',
  tests:[ {args:[[1,1,1,2,2,3],2],expect:[1,2]}, {args:[[1],1],expect:[1]},
          {args:[[1,2,1,2,1,2,3,1,3,2],2],expect:[1,2]}, {args:[[4,1,-1,2,-1,2,3],2],expect:[-1,2]},
          {args:[[5,5,5,5],1],expect:[5]}, {args:[[3,0,1,0],1],expect:[0]},
          {args:[[...BIG,7,7,8],2],expect:[7,8],label:'nums = [0, 1, …, 99999, 7, 7, 8], k = 2'} ],
  hints:['Primeiro conte quantas vezes cada número aparece. Depois a pergunta vira: quais contagens são as maiores?','Nenhuma contagem passa de nums.length. Crie "baldes" onde baldes[c] guarda os números que aparecem c vezes e leia do balde mais alto para o mais baixo.'],
  solution:`function topKFrequent(nums, k) {
  const count = new Map();
  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [n, c] of count) buckets[c].push(n);
  const out = [];
  for (let c = buckets.length - 1; c > 0 && out.length < k; c--) {
    for (const n of buckets[c]) {
      out.push(n);
      if (out.length === k) break;
    }
  }
  return out;
}`, time:'O(n)', space:'O(n)',
  lesson:'Quando o valor que você quer ordenar é limitado (aqui, a contagem vai de 1 a n), bucket sort ordena em O(n). Com um heap de tamanho k também dá O(n log k).' },

{ id:'product-except-self', lc:238, diff:'Medium', pattern:'Prefixo & Sufixo', fn:'productExceptSelf', params:'nums', title:'Product of Array Except Self',
  monster:'Golem Multiplicador', sprite:'golem', pal:{k:'#16181c',g:'#7d8796',L:'#b9c2cf',y:'#5ad1e6'},
  story:'Cada pedra deste golem vale o produto de todas as outras. Arranque uma e ele recalcula o corpo inteiro.',
  desc:`<p>Dado o array <code>nums</code>, retorne um array <code>answer</code> em que <code>answer[i]</code> é o produto de todos os elementos de <code>nums</code>, menos o da posição <code>i</code>.</p><p>Faça em O(n) e <b>sem usar divisão</b>. Os produtos sempre cabem num inteiro.</p>`,
  tests:[ {args:[[1,2,3,4]],expect:[24,12,8,6]}, {args:[[-1,1,0,-3,3]],expect:[0,0,9,0,0]},
          {args:[[2,3]],expect:[3,2]}, {args:[[0,0]],expect:[0,0]}, {args:[[5,0,2]],expect:[0,10,0]},
          {args:[[-2,-3,4]],expect:[-12,-8,6]},
          {args:[range(100000).map(i => i % 2 ? -1 : 1)],expect:range(100000).map(i => i % 2 ? -1 : 1),label:'nums = [1, -1, 1, -1, …] com 100 000 elementos'} ],
  hints:['O produto de "todos menos i" é o produto de tudo que está à esquerda de i vezes o produto de tudo que está à direita.','Faça uma passada da esquerda para a direita guardando o produto acumulado em answer[i]. Depois uma passada da direita para a esquerda multiplicando pelo acumulado do outro lado.'],
  solution:`function productExceptSelf(nums) {
  const n = nums.length;
  const answer = new Array(n);
  let left = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = left;   // produto de tudo à esquerda de i
    left *= nums[i];
  }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= right; // vezes o produto de tudo à direita de i
    right *= nums[i];
  }
  return answer;
}`, time:'O(n)', space:'O(1) extra, fora a resposta',
  lesson:'Prefixos e sufixos acumulados respondem "tudo antes de i" e "tudo depois de i" sem laço interno. A mesma ideia aparece em Trapping Rain Water e em somas de intervalo.' },

{ id:'valid-sudoku', lc:36, diff:'Medium', pattern:'Hash Set', fn:'isValidSudoku', params:'board', title:'Valid Sudoku',
  monster:'Aranha das Nove Teias', sprite:'spider', pal:{k:'#120d0a',g:'#5a4636',L:'#a08a6c',w:'#f3efe2',r:'#e0483e'},
  story:'Ela teceu nove teias em forma de grade. Se algum número se repetir, a teia toda arrebenta.',
  desc:`<p>O tabuleiro <code>board</code> é uma grade 9×9 de strings: <code>'1'</code> a <code>'9'</code> nas casas preenchidas e <code>'.'</code> nas vazias.</p><p>Retorne <code>true</code> se as casas preenchidas respeitam as regras: nenhum dígito se repete na mesma linha, na mesma coluna ou no mesmo quadrado 3×3. Não precisa verificar se o sudoku tem solução.</p>`,
  tests:[ {args:[[['5','3','.','.','7','.','.','.','.'],
                  ['6','.','.','1','9','5','.','.','.'],
                  ['.','9','8','.','.','.','.','6','.'],
                  ['8','.','.','.','6','.','.','.','3'],
                  ['4','.','.','8','.','3','.','.','1'],
                  ['7','.','.','.','2','.','.','.','6'],
                  ['.','6','.','.','.','.','2','8','.'],
                  ['.','.','.','4','1','9','.','.','5'],
                  ['.','.','.','.','8','.','.','7','9']]],expect:true},
          {args:[[['8','3','.','.','7','.','.','.','.'],
                  ['6','.','.','1','9','5','.','.','.'],
                  ['.','9','8','.','.','.','.','6','.'],
                  ['8','.','.','.','6','.','.','.','3'],
                  ['4','.','.','8','.','3','.','.','1'],
                  ['7','.','.','.','2','.','.','.','6'],
                  ['.','6','.','.','.','.','2','8','.'],
                  ['.','.','.','4','1','9','.','.','5'],
                  ['.','.','.','.','8','.','.','7','9']]],expect:false},
          {args:[range(9).map(() => range(9).map(() => '.'))],expect:true,label:'tabuleiro todo vazio'},
          {args:[range(9).map(r => range(9).map(c => r === 4 && (c === 0 || c === 8) ? '7' : '.'))],expect:false,label:"linha 4 com '7' nas colunas 0 e 8"},
          {args:[range(9).map(r => range(9).map(c => c === 2 && (r === 0 || r === 8) ? '2' : '.'))],expect:false,label:"coluna 2 com '2' nas linhas 0 e 8"},
          {args:[range(9).map(r => range(9).map(c => (r === 3 && c === 3) || (r === 5 && c === 5) ? '4' : '.'))],expect:false,label:"'4' em (3,3) e (5,5): mesmo quadrado, linhas e colunas diferentes"},
          {args:[range(9).map(r => range(9).map(c => r === 0 && c < 8 ? String(c + 1) : r === 1 && c === 8 ? '9' : '.'))],expect:true,label:"linha 0 = 1..8 e '9' em (1,8): sem solução, mas válido"} ],
  hints:['São 27 grupos para vigiar: 9 linhas, 9 colunas e 9 quadrados. Cada dígito só pode aparecer uma vez em cada um.','Para a casa (l, c), o quadrado é Math.floor(l / 3) * 3 + Math.floor(c / 3). Anote chaves como "linha 2 tem 5" num objeto e recuse se a chave já existir.'],
  solution:`function isValidSudoku(board) {
  const seen = new Set();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const v = board[r][c];
      if (v === '.') continue;
      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      for (const key of ['r' + r + v, 'c' + c + v, 'b' + box + v]) {
        if (seen.has(key)) return false;
        seen.add(key);
      }
    }
  }
  return true;
}`, time:'O(1), o tabuleiro tem sempre 81 casas', space:'O(1)',
  lesson:'Um Set com chaves compostas ("linha 3 tem 7") substitui 27 estruturas separadas. O truque do índice do quadrado, l/3 e c/3, volta em qualquer problema de grade dividida em blocos.' },

{ id:'longest-consecutive', lc:128, diff:'Medium', pattern:'Hash Set', fn:'longestConsecutive', params:'nums', title:'Longest Consecutive Sequence', boss:true,
  monster:'Basilisco da Sequência Eterna', sprite:'snake', pal:{k:'#0a1408',g:'#4f8a2e',L:'#b4e05a',w:'#f3efe2',r:'#e8352b'},
  story:'O guardião da biblioteca. Cada escama é um número, e o olhar dele petrifica quem não medir a maior fileira de escamas seguidas.',
  desc:`<p>Dado o array <code>nums</code>, fora de ordem, retorne o tamanho da maior sequência de inteiros consecutivos (como 4, 5, 6, 7) que dá para formar com os valores dele.</p><p>Valores repetidos contam uma vez só. O objetivo é O(n): ordenar funciona, mas não é o que o basilisco quer ver.</p>`,
  tests:[ {args:[[100,4,200,1,3,2]],expect:4}, {args:[[0,3,7,2,5,8,4,6,0,1]],expect:9},
          {args:[[]],expect:0}, {args:[[9]],expect:1}, {args:[[1,0,1,2]],expect:3}, {args:[[-3,-2,-1,5,6]],expect:3},
          {args:[range(100000).map(i => 99999 - i)],expect:100000,label:'nums = [99999, 99998, …, 1, 0]'},
          {args:[range(100000).map(i => i * 2)],expect:1,label:'nums = [0, 2, 4, …, 199998]'},
          {args:[[...Array(50000).fill(0), ...range(50000)]],expect:50000,label:'nums = cinquenta mil zeros seguidos de [0, 1, …, 49999]'} ],
  hints:['Um número só começa uma sequência se o anterior a ele (x − 1) não existir. Como saber isso em O(1)?','Coloque tudo num Set. Para cada valor distinto que é começo de sequência, conte x + 1, x + 2… enquanto existirem. Percorra os valores sem repetição, ou os zeros repetidos do último teste vão custar caro.'],
  solution:`function longestConsecutive(nums) {
  const set = new Set(nums);
  let best = 0;
  for (const x of set) {
    if (set.has(x - 1)) continue; // x não é começo de sequência
    let len = 1;
    while (set.has(x + len)) len++;
    best = Math.max(best, len);
  }
  return best;
}`, time:'O(n)', space:'O(n)',
  lesson:'Cada número é visitado no máximo duas vezes porque só os começos de sequência disparam o laço interno. "Só comece pelo início" é o que transforma O(n²) em O(n), e a mesma ideia volta em problemas de grafos e union-find.' }
  ],
  /* modo guiado: [ferramenta que você já conhece, frase em português, código daquele passo] */
  guide: {
'group-anagrams': { think:'Com ["eat", "tea", "tan", "ate", "nat", "bat"]: arrumo as letras de "eat" e vira "aet". "tea" e "ate" também viram "aet", então vão juntas. "tan" e "nat" viram "ant". "bat" vira "abt" e fica sozinha. Três grupos.',
  plan:[
  ['objeto','Crie um objeto vazio: a chave são as letras arrumadas e o valor é a lista de palavras daquele grupo.','const grupos = {};'],
  ['for','Ande por cada palavra.','for (let i = 0; i < strs.length; i++) {\n  const palavra = strs[i];'],
  ['variável','Monte a chave: separe as letras, ordene e junte de novo.',"const chave = palavra.split('').sort().join('');"],
  ['if','Se ainda não existe grupo para essa chave, crie uma lista vazia.','if (!grupos[chave]) {\n  grupos[chave] = [];\n}'],
  ['array','Coloque a palavra no grupo dela. Feche o for.','grupos[chave].push(palavra);\n}'],
  ['return','Devolva só as listas, sem as chaves.','return Object.values(grupos);']]},
'top-k-frequent': { think:'Com [1, 1, 1, 2, 2, 3] e k = 2: o 1 aparece 3 vezes, o 2 aparece 2 e o 3 aparece 1. Organizo por quantidade: na caixa "3 vezes" está o 1, na caixa "2 vezes" está o 2. Pego das caixas mais altas até ter 2 números: [1, 2].',
  plan:[
  ['objeto','Conte quantas vezes cada número aparece.','const conta = {};\nfor (let i = 0; i < nums.length; i++) {\n  const n = nums[i];\n  conta[n] = (conta[n] || 0) + 1;\n}'],
  ['array','Crie uma caixa vazia para cada quantidade possível, de 0 até nums.length.','const baldes = [];\nfor (let i = 0; i <= nums.length; i++) {\n  baldes.push([]);\n}'],
  ['for','Coloque cada número na caixa da quantidade dele. As chaves do objeto viram texto, então converta com Number.','for (const numero in conta) {\n  baldes[conta[numero]].push(Number(numero));\n}'],
  ['array','Crie a lista de resposta.','const resposta = [];'],
  ['for','Ande das caixas mais altas para as mais baixas, pegando números até ter k. Feche os dois for.','for (let q = baldes.length - 1; q >= 0; q--) {\n  for (const numero of baldes[q]) {\n    resposta.push(numero);\n    if (resposta.length === k) return resposta;\n  }\n}'],
  ['return','Por segurança, devolva o que juntou.','return resposta;']]},
'product-except-self': { think:'Com [1, 2, 3, 4], para a posição 2 (o 3): à esquerda tenho 1 × 2 = 2, à direita tenho 4. Resposta 2 × 4 = 8. Se eu souber o produto da esquerda e o da direita de cada posição, nem preciso dividir.',
  plan:[
  ['array','Crie o array de resposta.','const resposta = [];'],
  ['for','Da esquerda para a direita: guarde em cada posição o produto de tudo que veio antes, depois multiplique o acumulado pelo número atual.','let esquerda = 1;\nfor (let i = 0; i < nums.length; i++) {\n  resposta[i] = esquerda;\n  esquerda = esquerda * nums[i];\n}'],
  ['variável','Crie o acumulado da direita, começando em 1.','let direita = 1;'],
  ['for','Da direita para a esquerda: multiplique cada posição pelo produto de tudo que vem depois, depois atualize o acumulado.','for (let i = nums.length - 1; i >= 0; i--) {\n  resposta[i] = resposta[i] * direita;\n  direita = direita * nums[i];\n}'],
  ['return','Devolva a resposta.','return resposta;']]},
'valid-sudoku': { think:'No segundo exemplo, a primeira linha começa com 8. Desço pela coluna 0: na linha 3 tem outro 8. Mesma coluna, mesmo dígito, então o tabuleiro é inválido. Basta anotar tudo que já vi em cada linha, coluna e quadrado.',
  plan:[
  ['objeto','Crie um objeto para anotar o que já foi visto, como "linha 0 tem 5".','const vistos = {};'],
  ['for','Ande por cada linha e, dentro dela, por cada coluna.','for (let l = 0; l < 9; l++) {\n  for (let c = 0; c < 9; c++) {\n    const v = board[l][c];'],
  ['if','Se a casa está vazia, pule para a próxima.',"if (v === '.') continue;"],
  ['variável','Descubra o número do quadrado 3×3 e monte as três anotações desta casa.',"const quadrado = Math.floor(l / 3) * 3 + Math.floor(c / 3);\nconst chaves = ['linha ' + l + ' tem ' + v, 'coluna ' + c + ' tem ' + v, 'quadrado ' + quadrado + ' tem ' + v];"],
  ['for + if','Para cada anotação: se ela já existe, o dígito repetiu, devolva false. Senão, anote.','for (const chave of chaves) {\n  if (vistos[chave]) return false;\n  vistos[chave] = true;\n}'],
  ['return','Feche os dois for. Se nada repetiu, o tabuleiro é válido.','}\n}\nreturn true;']]},
'longest-consecutive': { think:'Com [100, 4, 200, 1, 3, 2]: o 1 não tem o 0 antes, então começa uma sequência: 1, 2, 3, 4, e o 5 não existe. Tamanho 4. O 2 tem o 1 antes, então nem conto a partir dele. O 100 e o 200 ficam sozinhos. A maior é 4.',
  plan:[
  ['objeto','Anote cada número num objeto e guarde, à parte, a lista de números sem repetição.','const existe = {};\nconst unicos = [];\nfor (let i = 0; i < nums.length; i++) {\n  if (!existe[nums[i]]) {\n    existe[nums[i]] = true;\n    unicos.push(nums[i]);\n  }\n}'],
  ['variável','Guarde o maior tamanho encontrado.','let maior = 0;'],
  ['for','Ande pelos números sem repetição.','for (let i = 0; i < unicos.length; i++) {\n  const n = unicos[i];'],
  ['if','Se o número anterior existe, este não é começo de sequência: pule.','if (existe[n - 1]) continue;'],
  ['while','A partir dele, conte quantos seguidos existem.','let tamanho = 1;\nwhile (existe[n + tamanho]) {\n  tamanho++;\n}'],
  ['if','Se essa sequência é a maior até agora, guarde. Feche o for.','if (tamanho > maior) maior = tamanho;\n}'],
  ['return','Devolva o maior tamanho.','return maior;']]}
  }
});
