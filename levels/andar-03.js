/* Andar 3 · As Minas Gêmeas: dois índices que andam juntos, das pontas para o meio ou como uma janela que desliza. */
addFloor({
  name: 'As Minas Gêmeas',
  theme: 'Dois Ponteiros & Janela Deslizante',
  levels: [
{ id:'two-sum-ii', lc:167, diff:'Medium', pattern:'Dois Ponteiros', fn:'twoSum', params:'numbers, target', title:'Two Sum II - Input Array Is Sorted',
  monster:'Morcego das Galerias', sprite:'bat', pal:{k:'#1a1208',g:'#b07a2a',w:'#ffe08a'},
  story:'Dois túneis, um em cada ponta da mina. O morcego só deixa passar quem achar as duas pepitas que somam o peso pedido.',
  desc:`<p>O array <code>numbers</code> já vem em ordem crescente. Encontre os dois números que somam <code>target</code> e retorne as posições deles <b>contando a partir de 1</b>, como <code>[i, j]</code> com <code>i &lt; j</code>.</p><p>Existe exatamente uma resposta e você não pode usar o mesmo elemento duas vezes. Use só memória extra constante.</p>`,
  tests:[ {args:[[2,7,11,15],9],expect:[1,2]}, {args:[[2,3,4],6],expect:[1,3]}, {args:[[-1,0],-1],expect:[1,2]},
          {args:[[1,2,3,4,4,9,56,90],8],expect:[4,5]}, {args:[[5,25,75],100],expect:[2,3]},
          {args:[[-5,-3,0,2,8],-8],expect:[1,2]},
          {args:[BIG,199997],expect:[99999,100000],label:'numbers = [0, 1, …, 99999], target = 199997'} ],
  hints:['Some o menor com o maior. Se passou do alvo, qual dos dois nunca vai servir?','Ponteiro esq no começo e dir no fim. Soma pequena: esq++. Soma grande: dir--. Lembre de somar 1 nas posições ao devolver.'],
  solution:`function twoSum(numbers, target) {
  let l = 0, r = numbers.length - 1;
  while (l < r) {
    const sum = numbers[l] + numbers[r];
    if (sum === target) return [l + 1, r + 1];
    if (sum < target) l++;
    else r--;
  }
  return [];
}`, time:'O(n)', space:'O(1)',
  lesson:'Com o array ordenado, cada comparação descarta um elemento inteiro. É a base de 3Sum, Container With Most Water e de qualquer problema "par com soma X" em dados ordenados.' },

{ id:'three-sum', lc:15, diff:'Medium', pattern:'Dois Ponteiros', fn:'threeSum', params:'nums', title:'3Sum',
  monster:'Trinca de Ossos', sprite:'skeleton', pal:{k:'#1c1610',g:'#d8cfb8',r:'#7fe07a'},
  story:'Três esqueletos de mineiros se dão as mãos no escuro. Só os trios que se anulam conseguem descansar.',
  desc:`<p>Dado o array <code>nums</code>, retorne todos os trios <code>[a, b, c]</code> de elementos em posições diferentes cuja soma é <code>0</code>.</p><p>Não pode haver trios repetidos na resposta. A ordem dos trios e a ordem dentro de cada trio não importam.</p>`,
  cmp:'nested',
  tests:[ {args:[[-1,0,1,2,-1,-4]],expect:[[-1,-1,2],[-1,0,1]]}, {args:[[0,1,1]],expect:[]}, {args:[[0,0,0]],expect:[[0,0,0]]},
          {args:[[0,0,0,0]],expect:[[0,0,0]]}, {args:[[-2,0,1,1,2]],expect:[[-2,0,2],[-2,1,1]]},
          {args:[[-2,0,0,2,2]],expect:[[-2,0,2]]}, {args:[[3,-2,1,0]],expect:[]},
          {args:[[...range(3000).map(i => i + 1), -3]],expect:[[-3,1,2]],label:'nums = [1, 2, …, 3000, -3]'} ],
  hints:['Ordene o array. Fixando o primeiro número do trio, o problema vira um Two Sum II no resto.','Para cada i, rode esq e dir procurando nums[esq] + nums[dir] = −nums[i]. Pule valores iguais ao anterior, tanto no i quanto no esq, para não repetir trios.'],
  solution:`function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        out.push([nums[i], nums[l], nums[r]]);
        l++; r--;
        while (l < r && nums[l] === nums[l - 1]) l++;
      }
    }
  }
  return out;
}`, time:'O(n²)', space:'O(1) extra, fora a ordenação',
  lesson:'Ordenar e fixar um elemento reduz k-Sum a (k−1)-Sum, até chegar nos dois ponteiros. Pular vizinhos iguais depois de ordenar é o jeito clássico de evitar respostas repetidas.' },

{ id:'container-water', lc:11, diff:'Medium', pattern:'Dois Ponteiros', fn:'maxArea', params:'height', title:'Container With Most Water',
  monster:'Slime da Cisterna', sprite:'slime', pal:{k:'#06161c',g:'#2f8fa8',L:'#86d9e8',w:'#eafcff'},
  story:'A mina está inundando. O slime só sai do caminho se você mostrar onde cabe mais água.',
  desc:`<p><code>height[i]</code> é a altura de uma parede vertical na posição <code>i</code>. Escolha duas paredes: junto com o chão, elas formam um tanque.</p><p>A água fica na altura da parede <b>mais baixa</b> e ocupa a distância entre elas. Retorne a maior quantidade de água possível.</p>`,
  tests:[ {args:[[1,8,6,2,5,4,8,3,7]],expect:49}, {args:[[1,1]],expect:1}, {args:[[4,3,2,1,4]],expect:16}, {args:[[1,2,1]],expect:2},
          {args:[[2,3,4,5,18,17,6]],expect:17}, {args:[[0,0,0]],expect:0},
          {args:[BIG],expect:2499950000,label:'height = [0, 1, …, 99999]'} ],
  hints:['Comece com as duas paredes das pontas: é a maior largura possível. Para melhorar, você precisa de uma parede mais alta.','Mover a parede mais alta nunca ajuda, porque a água continua limitada pela mais baixa e a largura diminui. Então mova sempre a mais baixa.'],
  solution:`function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l++;
    else r--;
  }
  return best;
}`, time:'O(n)', space:'O(1)',
  lesson:'Os dois ponteiros funcionam porque dá para provar que um dos lados nunca vai fazer parte de uma resposta melhor, então ele pode ser descartado. Procure esse argumento de descarte sempre que pensar em dois ponteiros.' },

{ id:'char-replacement', lc:424, diff:'Medium', pattern:'Janela Deslizante', fn:'characterReplacement', params:'s, k', title:'Longest Repeating Character Replacement',
  monster:'Espectro Falsário', sprite:'ghost', pal:{k:'#2a0f1e',g:'#e8a3c4',w:'#f3efe2',r:'#c43d7a'},
  story:'Um fantasma reescreve as placas da mina. Ele deixa você trocar algumas letras, mas quer ver a maior fileira de letras iguais.',
  desc:`<p>Você recebe uma string <code>s</code> de letras maiúsculas e um inteiro <code>k</code>. Pode trocar qualquer letra por outra maiúscula, no máximo <code>k</code> vezes.</p><p>Retorne o tamanho da maior substring formada só por letras iguais que dá para conseguir.</p>`,
  tests:[ {args:['ABAB',2],expect:4}, {args:['AABABBA',1],expect:4}, {args:['A',0],expect:1}, {args:['AAAA',0],expect:4},
          {args:['ABCDE',1],expect:2}, {args:['BAAAB',2],expect:5}, {args:['ABBBCC',1],expect:4},
          {args:['AB'.repeat(50000),20000],expect:40001,label:"s = 'ABAB…' com 100 000 letras, k = 20000"} ],
  hints:['Uma janela é boa quando (tamanho da janela) − (quantas vezes aparece a letra mais comum dela) ≤ k: esse é o número de trocas necessárias.','Expanda a janela pela direita contando letras. Se ela ficar ruim, tire a letra da esquerda. A maior frequência guardada não precisa diminuir quando a janela encolhe.'],
  solution:`function characterReplacement(s, k) {
  const count = {};
  let start = 0, maxFreq = 0, best = 0;
  for (let i = 0; i < s.length; i++) {
    count[s[i]] = (count[s[i]] || 0) + 1;
    maxFreq = Math.max(maxFreq, count[s[i]]);
    while (i - start + 1 - maxFreq > k) {
      count[s[start]]--;
      start++;
    }
    best = Math.max(best, i - start + 1);
  }
  return best;
}`, time:'O(n)', space:'O(1), no máximo 26 letras',
  lesson:'A janela deslizante precisa de uma regra de "janela válida" que dá para checar em O(1). Aqui a regra é tamanho − maior frequência ≤ k, e o mesmo molde resolve Max Consecutive Ones III.' },

{ id:'min-window', lc:76, diff:'Hard', pattern:'Janela Deslizante', fn:'minWindow', params:'s, t', title:'Minimum Window Substring', boss:true,
  monster:'Olho Abissal da Fresta', sprite:'eye', pal:{k:'#100616',g:'#5b2a7a',L:'#a35fd0',w:'#f6e9ff',r:'#ff3b3b'},
  story:'No fundo das minas, um olho enorme espia por uma fresta. Para fechá-lo, mostre a menor fresta por onde se veem todas as runas.',
  desc:`<p>Dadas as strings <code>s</code> e <code>t</code>, retorne a menor substring de <code>s</code> que contém todos os caracteres de <code>t</code>, incluindo os repetidos (se <code>t</code> tem dois <code>'a'</code>, a janela precisa de dois).</p><p>Se não existir, retorne <code>""</code>. Nos testes, a menor janela é sempre única. Maiúsculas e minúsculas são diferentes.</p>`,
  tests:[ {args:['ADOBECODEBANC','ABC'],expect:'BANC'}, {args:['a','a'],expect:'a'}, {args:['a','aa'],expect:''},
          {args:['ab','b'],expect:'b'}, {args:['bba','ab'],expect:'ba'}, {args:['aa','aa'],expect:'aa'},
          {args:['cabwefgewcwaefgcf','cae'],expect:'cwae'}, {args:['xyz','A'],expect:''},
          {args:['a'.repeat(99998) + 'bc','abc'],expect:'abc',label:"s = 'aaa…abc' com 100 000 letras, t = 'abc'"} ],
  hints:['Expanda a janela pela direita até ela conter tudo de t. Depois encolha pela esquerda enquanto ela continuar valendo, anotando a menor.','Guarde quantas vezes cada letra de t ainda falta e um contador "faltam" com o total. A janela é válida quando faltam chega a 0, sem precisar comparar objetos inteiros.'],
  solution:`function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);
  let missing = t.length, start = 0, bestStart = 0, bestLen = Infinity;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if ((need.get(c) || 0) > 0) missing--;
    need.set(c, (need.get(c) || 0) - 1);
    while (missing === 0) {
      if (i - start + 1 < bestLen) { bestLen = i - start + 1; bestStart = start; }
      const out = s[start++];
      need.set(out, need.get(out) + 1);
      if (need.get(out) > 0) missing++;
    }
  }
  return bestLen === Infinity ? '' : s.slice(bestStart, bestStart + bestLen);
}`, time:'O(|s| + |t|)', space:'O(k), k = caracteres distintos',
  lesson:'É o molde completo da janela deslizante: expandir até valer, encolher enquanto vale. O contador "faltam" deixa a checagem em O(1). O mesmo molde resolve Find All Anagrams e Permutation in String.' }
  ],
  /* modo guiado: [ferramenta que você já conhece, frase em português, código daquele passo] */
  guide: {
'two-sum-ii': { think:'Com [2, 7, 11, 15] e alvo 9: somo as pontas, 2 + 15 = 17. Passou, e o 15 é o maior, então ele não serve com ninguém: descarto. 2 + 11 = 13, descarto o 11. 2 + 7 = 9. Achei! Posições 1 e 2, contando do 1.',
  plan:[
  ['variável','Coloque um marcador no começo e outro no fim do array.','let esq = 0;\nlet dir = numbers.length - 1;'],
  ['while','Enquanto os marcadores não se encontrarem, continue.','while (esq < dir) {\n  const soma = numbers[esq] + numbers[dir];'],
  ['if','Se a soma é o alvo, devolva as posições somando 1 em cada.','if (soma === target) return [esq + 1, dir + 1];'],
  ['if / else','Se a soma é pequena, ande com o da esquerda. Se é grande, recue o da direita. Feche o while.','if (soma < target) {\n  esq++;\n} else {\n  dir--;\n}\n}'],
  ['return','Não deve chegar aqui, mas devolva um array vazio por garantia.','return [];']]},
'three-sum': { think:'Ordeno [-1, 0, 1, 2, -1, -4] e fica [-4, -1, -1, 0, 1, 2]. Fixo o -4: preciso de dois que somem 4, e não tem. Fixo o -1: preciso de dois que somem 1. Achei -1 + 2 e 0 + 1. O próximo -1 é repetido, pulo. Resposta: [-1, -1, 2] e [-1, 0, 1].',
  plan:[
  ['array','Ordene os números do menor para o maior e crie a lista de resposta.','nums.sort((a, b) => a - b);\nconst resposta = [];'],
  ['for','Fixe o primeiro número do trio, um de cada vez.','for (let i = 0; i < nums.length - 2; i++) {'],
  ['if','Se ele é igual ao anterior, já testou esse caso: pule.','if (i > 0 && nums[i] === nums[i - 1]) continue;'],
  ['variável','Coloque um marcador logo depois dele e outro no fim.','let esq = i + 1;\nlet dir = nums.length - 1;'],
  ['while','Enquanto os marcadores não se cruzarem, some os três.','while (esq < dir) {\n  const soma = nums[i] + nums[esq] + nums[dir];'],
  ['if / else','Soma negativa: ande com esq. Positiva: recue dir. Zero: guarde o trio, mova os dois e pule os repetidos da esquerda.','if (soma < 0) {\n  esq++;\n} else if (soma > 0) {\n  dir--;\n} else {\n  resposta.push([nums[i], nums[esq], nums[dir]]);\n  esq++;\n  dir--;\n  while (esq < dir && nums[esq] === nums[esq - 1]) {\n    esq++;\n  }\n}'],
  ['return','Feche o while e o for. Devolva os trios.','}\n}\nreturn resposta;']]},
'container-water': { think:'Com [1, 8, 6, 2, 5, 4, 8, 3, 7]: as pontas são 1 e 7, a água fica na altura 1 com largura 8, dá 8. A parede 1 limita tudo, então troco ela. Agora 8 e 7, largura 7: 7 × 7 = 49. Sigo sempre movendo a parede mais baixa e o melhor continua 49.',
  plan:[
  ['variável','Coloque um marcador em cada ponta e guarde a melhor área, começando em 0.','let esq = 0;\nlet dir = height.length - 1;\nlet melhor = 0;'],
  ['while','Enquanto os marcadores não se encontrarem, continue.','while (esq < dir) {'],
  ['variável','Calcule a água: a parede mais baixa vezes a distância entre elas.','const baixa = Math.min(height[esq], height[dir]);\nconst area = baixa * (dir - esq);'],
  ['if','Se essa área é a maior até agora, guarde.','if (area > melhor) melhor = area;'],
  ['if / else','Mova a parede mais baixa para dentro. Feche o while.','if (height[esq] < height[dir]) {\n  esq++;\n} else {\n  dir--;\n}\n}'],
  ['return','Devolva a melhor área.','return melhor;']]},
'char-replacement': { think:'Com "AABABBA" e k = 1: a janela "AABA" tem 3 letras A e 1 B, então basta 1 troca: tamanho 4. Se eu crescer para "AABAB", seriam 2 trocas, não pode. Então tiro letras da esquerda e sigo. Nenhuma janela maior que 4 precisa de só 1 troca.',
  plan:[
  ['objeto','Crie um objeto para contar as letras dentro da janela.','const conta = {};'],
  ['variável','Guarde onde a janela começa, a maior contagem de uma letra só e o melhor tamanho.','let inicio = 0;\nlet maisComum = 0;\nlet melhor = 0;'],
  ['for','Ande com o fim da janela, letra por letra, contando a letra nova.','for (let fim = 0; fim < s.length; fim++) {\n  const letra = s[fim];\n  conta[letra] = (conta[letra] || 0) + 1;'],
  ['if','Se essa letra agora é a mais comum da janela, atualize.','if (conta[letra] > maisComum) maisComum = conta[letra];'],
  ['while','Enquanto as trocas necessárias passarem de k, tire a letra do começo da janela.','while (fim - inicio + 1 - maisComum > k) {\n  conta[s[inicio]]--;\n  inicio++;\n}'],
  ['if','Se a janela atual é a maior até agora, guarde. Feche o for.','if (fim - inicio + 1 > melhor) melhor = fim - inicio + 1;\n}'],
  ['return','Devolva o melhor tamanho.','return melhor;']]},
'min-window': { think:'Em "ADOBECODEBANC" procuro A, B e C. Cresço a janela até "ADOBEC", que tem tudo: 6 letras. Agora encolho pela esquerda: sem o A ela não vale mais, então cresço de novo até achar outro A. Repetindo isso, a menor janela que aparece é "BANC", com 4 letras.',
  plan:[
  ['objeto','Conte quantas vezes cada letra de t é necessária.','const precisa = {};\nfor (let i = 0; i < t.length; i++) {\n  precisa[t[i]] = (precisa[t[i]] || 0) + 1;\n}'],
  ['variável','Guarde quantas letras ainda faltam, onde a janela começa e a melhor janela encontrada.','let faltam = t.length;\nlet inicio = 0;\nlet melhorInicio = 0;\nlet melhorTamanho = Infinity;'],
  ['for','Ande com o fim da janela, letra por letra.','for (let fim = 0; fim < s.length; fim++) {\n  const letra = s[fim];'],
  ['if','Se essa letra ainda era necessária, falta uma a menos. Depois desconte ela do objeto.','if (precisa[letra] > 0) faltam--;\nprecisa[letra] = (precisa[letra] || 0) - 1;'],
  ['while','Enquanto não falta nada, a janela vale: se for a menor até agora, guarde.','while (faltam === 0) {\n  if (fim - inicio + 1 < melhorTamanho) {\n    melhorTamanho = fim - inicio + 1;\n    melhorInicio = inicio;\n  }'],
  ['variável','Tire a letra do começo. Se ela fazia falta, a janela deixa de valer. Feche o while e o for.','const saiu = s[inicio];\n  precisa[saiu]++;\n  if (precisa[saiu] > 0) faltam++;\n  inicio++;\n}\n}'],
  ['return','Se nunca achou janela, devolva texto vazio. Senão, recorte a melhor.',"if (melhorTamanho === Infinity) return '';\nreturn s.slice(melhorInicio, melhorInicio + melhorTamanho);"]]}
  }
});
