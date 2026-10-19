/* Andar 10 · O Salão dos Intervalos: o último andar. Intervalos e escolhas gulosas. Vencer o chefe daqui abre a saída da masmorra. */
addFloor({
  name: 'O Salão dos Intervalos',
  theme: 'Intervalos & Greedy',
  levels: [
{ id:'jump-game', lc:55, diff:'Medium', pattern:'Greedy', fn:'canJump', params:'nums', title:'Jump Game',
  monster:'Slime Saltitante', sprite:'slime', pal:{k:'#0f1a06',g:'#8cc63f',L:'#d4f28a',w:'#f3efe2'},
  story:'O piso do salão é feito de pedras soltas. O slime quica de pedra em pedra e duvida que você chegue até a última.',
  desc:`<p>Você começa na posição <code>0</code> do array <code>nums</code>. Cada <code>nums[i]</code> diz o <b>tamanho máximo</b> do pulo que dá para dar a partir da posição <code>i</code>: você pode pular qualquer distância de 1 até esse valor.</p><p>Retorne <code>true</code> se for possível chegar à última posição, e <code>false</code> caso contrário.</p>`,
  tests:[ {args:[[2,3,1,1,4]],expect:true}, {args:[[3,2,1,0,4]],expect:false}, {args:[[0]],expect:true}, {args:[[0,1]],expect:false},
          {args:[[2,0,0]],expect:true}, {args:[[1,0,1,0]],expect:false},
          {args:[range(100000).map(i => i < 99999 ? 99998 - i : 0)],expect:false,label:'nums = [99998, 99997, …, 1, 0, 0] (todos param na penúltima casa)'},
          {args:[Array(100000).fill(1)],expect:true,label:'nums = [1, 1, …, 1] (100 000 uns)'} ],
  hints:['Testar todos os caminhos possíveis explode. Você não precisa saber o caminho, só até onde consegue chegar.','Guarde o alcance máximo visto até agora. Se a posição atual passar desse alcance, você ficou preso; senão, atualize com i + nums[i].'],
  solution:`function canJump(nums) {
  let reach = 0; // posição mais distante alcançável até agora
  for (let i = 0; i < nums.length; i++) {
    if (i > reach) return false;
    reach = Math.max(reach, i + nums[i]);
    if (reach >= nums.length - 1) return true;
  }
  return true;
}`, time:'O(n)', space:'O(1)',
  lesson:'Em vez de explorar caminhos, carregue um resumo: o alcance máximo. Greedy funciona quando uma variável só já diz tudo o que importa do passado. O chefe deste andar usa a mesma ideia para contar pulos.' },

{ id:'merge-intervals', lc:56, diff:'Medium', pattern:'Intervalos', fn:'merge', params:'intervals', title:'Merge Intervals',
  monster:'Aranha Costureira', sprite:'spider', pal:{k:'#170a1c',g:'#8a3fa0',L:'#c98be0',w:'#f3efe2',r:'#ffcf4a'},
  story:'A aranha costura fios que se cruzam até virarem um só. Mostre a ela como fica a teia depois da costura.',
  desc:`<p>Dado um array <code>intervals</code> em que cada item é <code>[inicio, fim]</code>, junte todos os intervalos que se sobrepõem e retorne os intervalos resultantes.</p><p>Intervalos que só se encostam, como <code>[1,4]</code> e <code>[4,5]</code>, também se juntam. A entrada pode vir fora de ordem, mas a saída precisa estar <b>ordenada pelo início</b>.</p>`,
  tests:[ {args:[[[1,3],[2,6],[8,10],[15,18]]],expect:[[1,6],[8,10],[15,18]]}, {args:[[[1,4],[4,5]]],expect:[[1,5]]},
          {args:[[[4,7],[1,4]]],expect:[[1,7]]}, {args:[[[1,4],[2,3]]],expect:[[1,4]]}, {args:[[[5,6]]],expect:[[5,6]]},
          {args:[[[8,10],[1,3],[2,6],[15,18],[17,20]]],expect:[[1,6],[8,10],[15,20]]},
          {args:[[[1,2],[3,4],[5,6]]],expect:[[1,2],[3,4],[5,6]]},
          {args:[[[2,3],[4,5],[6,7],[8,9],[1,10]]],expect:[[1,10]]},
          {args:[range(100000).map(i => [99999 - i, 100000 - i])],expect:[[0,100000]],label:'intervals = [[99999, 100000], [99998, 99999], …, [0, 1]]'} ],
  hints:['Se os intervalos estivessem em ordem de início, só precisaria comparar cada um com o último que você montou.','Ordene pelo início. Se o atual começa em ou antes do fim do último, estenda o fim do último para o maior dos dois fins; senão, comece um novo.'],
  solution:`function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [s, e] of intervals) {
    const last = out[out.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}`, time:'O(n log n)', space:'O(n)',
  lesson:'Quase todo problema de intervalos começa com uma ordenação: depois dela, só o vizinho importa. O cuidado clássico é usar o maior dos fins, porque um intervalo pode estar inteiro dentro do outro.' },

{ id:'insert-interval', lc:57, diff:'Medium', pattern:'Intervalos', fn:'insert', params:'intervals, newInterval', title:'Insert Interval',
  monster:'Serpente Intrusa', sprite:'snake', pal:{k:'#06161a',g:'#2a9d8f',L:'#8fe3d6',w:'#f3efe2',r:'#e76f51'},
  story:'A serpente quer se enfiar na fila de tochas acesas sem bagunçar a ordem. Abra espaço para ela.',
  desc:`<p><code>intervals</code> é uma lista de intervalos <code>[inicio, fim]</code> já <b>ordenada pelo início</b> e sem sobreposições. Insira <code>newInterval</code> nela.</p><p>Se o novo intervalo se sobrepuser ou encostar em outros, junte todos num só. Retorne a lista final, ainda ordenada e sem sobreposições.</p>`,
  tests:[ {args:[[[1,3],[6,9]],[2,5]],expect:[[1,5],[6,9]]}, {args:[[[1,2],[3,5],[6,7],[8,10],[12,16]],[4,8]],expect:[[1,2],[3,10],[12,16]]},
          {args:[[],[5,7]],expect:[[5,7]]}, {args:[[[1,5]],[2,3]],expect:[[1,5]]}, {args:[[[1,5]],[6,8]],expect:[[1,5],[6,8]]},
          {args:[[[3,5]],[0,1]],expect:[[0,1],[3,5]]}, {args:[[[1,2],[5,6]],[2,5]],expect:[[1,6]]},
          {args:[[[1,5],[6,8]],[5,6]],expect:[[1,8]]}, {args:[[[1,2],[4,5]],[0,9]],expect:[[0,9]]} ],
  hints:['A lista já está ordenada. Ela se divide em três partes: o que termina antes do novo, o que encosta nele e o que começa depois.','Copie os que terminam antes de newInterval[0]. Depois, enquanto o atual começar em ou antes do fim do novo, junte (menor início, maior fim). Por fim, copie o resto.'],
  solution:`function insert(intervals, newInterval) {
  const out = [];
  let [s, e] = newInterval;
  let i = 0;
  while (i < intervals.length && intervals[i][1] < s) out.push(intervals[i++]);
  while (i < intervals.length && intervals[i][0] <= e) {
    s = Math.min(s, intervals[i][0]);
    e = Math.max(e, intervals[i][1]);
    i++;
  }
  out.push([s, e]);
  while (i < intervals.length) out.push(intervals[i++]);
  return out;
}`, time:'O(n)', space:'O(n)',
  lesson:'Quando a entrada já vem ordenada, não ordene de novo: percorra em fases. Dividir a lista em "antes, durante e depois" é um molde que serve para qualquer inserção ou remoção em intervalos.' },

{ id:'non-overlapping-intervals', lc:435, diff:'Medium', pattern:'Greedy', fn:'eraseOverlapIntervals', params:'intervals', title:'Non-overlapping Intervals',
  monster:'Esqueleto Ceifador', sprite:'skeleton', pal:{k:'#1c1208',g:'#d9c9a3',r:'#9be36b'},
  story:'Os turnos de vigia se atropelam. O ceifador corta os que sobram, mas quer cortar o mínimo possível.',
  desc:`<p>Dado um array <code>intervals</code> de pares <code>[inicio, fim]</code>, retorne o <b>menor número</b> de intervalos que precisam ser removidos para que os restantes não se sobreponham.</p><p>Intervalos que só se encostam, como <code>[1,2]</code> e <code>[2,3]</code>, não contam como sobreposição.</p>`,
  tests:[ {args:[[[1,2],[2,3],[3,4],[1,3]]],expect:1}, {args:[[[1,2],[1,2],[1,2]]],expect:2}, {args:[[[1,2],[2,3]]],expect:0},
          {args:[[[1,10],[2,3],[4,5],[6,7]]],expect:1}, {args:[[[1,100],[11,22],[1,11],[2,12]]],expect:2},
          {args:[[[0,2],[1,3],[2,4],[3,5],[4,6]]],expect:2}, {args:[[[-5,-1]]],expect:0},
          {args:[range(100000).map(i => [99999 - i, 100001 - i])],expect:50000,label:'intervals = [[99999, 100001], [99998, 100000], …, [0, 2]]'} ],
  hints:['Pense ao contrário: qual é o maior número de intervalos que dá para manter? Qual intervalo você manteria primeiro?','Ordene pelo fim. Mantenha sempre o que termina mais cedo, porque ele deixa mais espaço livre. Quem começa antes do fim do último mantido é removido.'],
  solution:`function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let removed = 0, end = -Infinity;
  for (const [s, e] of intervals) {
    if (s < end) removed++;
    else end = e;
  }
  return removed;
}`, time:'O(n log n)', space:'O(1) extra, fora a ordenação',
  lesson:'Ordenar pelo fim e manter quem termina primeiro é o greedy clássico de agendamento de atividades. Ordenar pelo início e manter o primeiro cai na armadilha de [1,10] engolindo todos os outros.' },

{ id:'gas-station', lc:134, diff:'Medium', pattern:'Greedy', fn:'canCompleteCircuit', params:'gas, cost', title:'Gas Station',
  monster:'Espectro das Lamparinas', sprite:'ghost', pal:{k:'#2a1a04',g:'#f2c14e',w:'#fff6d6',r:'#d9480f'},
  story:'O corredor circular tem lamparinas com óleo. O espectro apaga a sua chama se o óleo acabar no meio da volta.',
  desc:`<p>Há <code>n</code> postos em círculo. No posto <code>i</code> você pega <code>gas[i]</code> de combustível, e ir dele até o posto <code>i + 1</code> gasta <code>cost[i]</code>. Do último posto você volta para o primeiro.</p><p>Começando com o tanque vazio, retorne o índice do posto de onde dá para dar a volta completa, ou <code>-1</code> se for impossível. Quando existe resposta, ela é única.</p>`,
  tests:[ {args:[[1,2,3,4,5],[3,4,5,1,2]],expect:3}, {args:[[2,3,4],[3,4,3]],expect:-1}, {args:[[5],[4]],expect:0}, {args:[[1],[2]],expect:-1},
          {args:[[5,1,2,3,4],[4,4,1,5,1]],expect:4}, {args:[[3,1,1],[1,2,2]],expect:0}, {args:[[2,0,0,4],[1,1,2,1]],expect:3},
          {args:[range(100000).map(i => i === 99999 ? 2 : 1), range(100000).map(i => i === 99998 ? 2 : 1)],expect:99999,label:'gas = [1, 1, …, 1, 2], cost = [1, 1, …, 2, 1] (n = 100 000)'} ],
  hints:['Se a soma de todo o combustível for menor que a soma de todos os custos, não tem jeito. E se não for menor, sempre existe um começo que funciona.','Ande somando gas[i] − cost[i]. Se o tanque ficar negativo no posto i, nenhum começo entre o atual e i serve: recomece em i + 1 com o tanque zerado.'],
  solution:`function canCompleteCircuit(gas, cost) {
  let total = 0, tank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const d = gas[i] - cost[i];
    total += d;
    tank += d;
    if (tank < 0) { start = i + 1; tank = 0; }
  }
  return total < 0 ? -1 : start;
}`, time:'O(n)', space:'O(1)',
  lesson:'Simular a volta a partir de cada posto custa O(n²). O pulo do gato é perceber que um trecho com saldo negativo descarta todos os começos dentro dele de uma vez. É o mesmo raciocínio de "recomeçar quando a soma fica negativa" do Kadane.' },

{ id:'jump-game-ii', lc:45, diff:'Medium', pattern:'Greedy', fn:'jump', params:'nums', title:'Jump Game II', boss:true,
  monster:'Titã do Último Portão', sprite:'golem', pal:{k:'#120a06',g:'#5b4a3f',L:'#9c8571',y:'#ff5a1f'},
  story:'O chefe final da masmorra. Atrás dele está o portão de saída, e ele só se afasta para quem cruzar o salão no menor número de pulos.',
  desc:`<p>Como em Jump Game, você começa na posição <code>0</code> e <code>nums[i]</code> é o tamanho máximo do pulo a partir da posição <code>i</code>.</p><p>Desta vez é garantido que dá para chegar ao fim. Retorne o <b>menor número de pulos</b> para alcançar a última posição.</p>`,
  tests:[ {args:[[2,3,1,1,4]],expect:2}, {args:[[2,3,0,1,4]],expect:2}, {args:[[0]],expect:0}, {args:[[1,2]],expect:1},
          {args:[[1,1,1,1]],expect:3}, {args:[[1,2,3]],expect:2}, {args:[[10,9,8,7,6,5,4,3,2,1,1,0]],expect:2},
          {args:[Array(100000).fill(1)],expect:99999,label:'nums = [1, 1, …, 1] (100 000 uns)'},
          {args:[Array(100000).fill(50000)],expect:2,label:'nums = [50000, 50000, …, 50000] (n = 100 000)'} ],
  hints:['Pense em camadas, como uma BFS: tudo o que dá para alcançar com 1 pulo, depois com 2 pulos, e assim por diante. Você não precisa de fila.','Guarde o fim da camada atual e o mais longe que a próxima camada alcança. Quando i chegar ao fim da camada atual, conte um pulo e avance o fim para o mais longe.'],
  solution:`function jump(nums) {
  let jumps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === curEnd) {
      jumps++;
      curEnd = farthest;
      if (curEnd >= nums.length - 1) break;
    }
  }
  return jumps;
}`, time:'O(n)', space:'O(1)',
  lesson:'É uma BFS em que cada camada é um trecho contínuo do array, então duas variáveis substituem a fila. A DP que tenta todos os pulos de cada posição é O(n²) e não passa nos testes grandes.' }
  ],
  /* modo guiado: [ferramenta que você já conhece, frase em português, código daquele passo] */
  guide: {
'jump-game': { think:'Com [2, 3, 1, 1, 4]: da posição 0 alcanço até a 2. Na posição 1 o valor é 3, então alcanço até a 4, que é o fim. Dá! Já com [3, 2, 1, 0, 4] todo mundo só alcança até a posição 3, que vale 0. A posição 4 fica fora do alcance.',
  plan:[
  ['variável','Guarde até onde dá para chegar por enquanto.','let alcance = 0;'],
  ['for','Ande por cada posição.','for (let i = 0; i < nums.length; i++) {'],
  ['if','Se esta posição está além do alcance, você ficou preso: devolva false.','if (i > alcance) return false;'],
  ['if','Se pular daqui leva mais longe, atualize o alcance. Feche o for.','if (i + nums[i] > alcance) alcance = i + nums[i];\n}'],
  ['return','Se o for terminou, toda posição era alcançável.','return true;']]},
'merge-intervals': { think:'Com [1,3], [2,6], [8,10], [15,18], já em ordem: o [2,6] começa no 2, antes do fim do [1,3], então junto e fica [1,6]. O [8,10] começa depois do 6, vira um novo. O [15,18] também. Resposta: [1,6], [8,10], [15,18].',
  plan:[
  ['array','Ordene os intervalos pelo começo.','intervals.sort((a, b) => a[0] - b[0]);'],
  ['array','Crie a resposta já com uma cópia do primeiro intervalo.','const resposta = [[intervals[0][0], intervals[0][1]]];'],
  ['for','Ande pelos intervalos a partir do segundo, olhando também o último da resposta.','for (let i = 1; i < intervals.length; i++) {\n  const atual = intervals[i];\n  const ultimo = resposta[resposta.length - 1];'],
  ['if / else','Se o atual começa antes ou no fim do último, eles se juntam: estenda o fim se o atual for mais longe. Senão, ele entra como novo. Feche o for.','if (atual[0] <= ultimo[1]) {\n  if (atual[1] > ultimo[1]) ultimo[1] = atual[1];\n} else {\n  resposta.push([atual[0], atual[1]]);\n}\n}'],
  ['return','Devolva a resposta.','return resposta;']]},
'insert-interval': { think:'Inserir [4,8] em [1,2], [3,5], [6,7], [8,10], [12,16]: o [1,2] termina antes do 4, copio. O [3,5], o [6,7] e o [8,10] encostam no novo, então junto tudo: começo 3, fim 10. O [12,16] começa depois, copio. Resposta: [1,2], [3,10], [12,16].',
  plan:[
  ['array','Crie a resposta vazia e um índice para andar pelos intervalos.','const resposta = [];\nlet i = 0;'],
  ['while','Copie os intervalos que terminam antes do novo começar.','while (i < intervals.length && intervals[i][1] < newInterval[0]) {\n  resposta.push(intervals[i]);\n  i++;\n}'],
  ['variável','Guarde o começo e o fim do novo intervalo, que ainda pode crescer.','let inicio = newInterval[0];\nlet fim = newInterval[1];'],
  ['while','Enquanto o intervalo atual começar antes ou no fim do novo, junte os dois: fique com o menor começo e o maior fim.','while (i < intervals.length && intervals[i][0] <= fim) {\n  if (intervals[i][0] < inicio) inicio = intervals[i][0];\n  if (intervals[i][1] > fim) fim = intervals[i][1];\n  i++;\n}'],
  ['array','Coloque o intervalo juntado na resposta.','resposta.push([inicio, fim]);'],
  ['while','Copie o resto, que começa depois do novo.','while (i < intervals.length) {\n  resposta.push(intervals[i]);\n  i++;\n}'],
  ['return','Devolva a resposta.','return resposta;']]},
'non-overlapping-intervals': { think:'Com [1,2], [2,3], [3,4], [1,3], ordeno pelo fim: [1,2], [2,3], [1,3], [3,4]. Mantenho o [1,2]. O [2,3] começa no 2, não bate, mantenho. O [1,3] começa antes do 3, bate: removo. O [3,4] não bate. Removi 1.',
  plan:[
  ['array','Ordene os intervalos pelo fim, do que termina antes para o que termina depois.','intervals.sort((a, b) => a[1] - b[1]);'],
  ['variável','Conte quantos removeu e guarde o fim do último intervalo mantido.','let removidos = 0;\nlet fimUltimo = -Infinity;'],
  ['for','Ande por cada intervalo, separando começo e fim.','for (let i = 0; i < intervals.length; i++) {\n  const inicio = intervals[i][0];\n  const fim = intervals[i][1];'],
  ['if / else','Se ele começa antes do fim do último mantido, bate: remova. Senão, mantenha e atualize o fim. Feche o for.','if (inicio < fimUltimo) {\n  removidos++;\n} else {\n  fimUltimo = fim;\n}\n}'],
  ['return','Devolva quantos foram removidos.','return removidos;']]},
'gas-station': { think:'gas [1,2,3,4,5], cost [3,4,5,1,2]. O que sobra em cada posto: -2, -2, -2, 3, 3. Começando no 0 o tanque já fica negativo; no 1 e no 2 também. Recomeço no 3: 3, depois 6. A soma total é 0, que não é negativa, então o posto 3 fecha a volta.',
  plan:[
  ['variável','Guarde o saldo da viagem inteira, o saldo do tanque desde o começo escolhido e o próprio começo.','let total = 0;\nlet tanque = 0;\nlet comeco = 0;'],
  ['for','Ande por cada posto e calcule quanto sobra (ou falta) para ir dele ao próximo.','for (let i = 0; i < gas.length; i++) {\n  const sobra = gas[i] - cost[i];\n  total += sobra;\n  tanque += sobra;'],
  ['if','Se o tanque ficou negativo, nenhum começo até aqui serve: comece no próximo posto com o tanque zerado. Feche o for.','if (tanque < 0) {\n  comeco = i + 1;\n  tanque = 0;\n}\n}'],
  ['if','Se o saldo total é negativo, não existe volta possível.','if (total < 0) return -1;'],
  ['return','Senão, o começo guardado é a resposta.','return comeco;']]},
'jump-game-ii': { think:'Com [2, 3, 1, 1, 4]: com 1 pulo alcanço as posições 1 e 2. Delas, o mais longe é 1 + 3 = 4, que já é o fim. Então com 2 pulos chego. Cada pulo é uma faixa de posições, e a próxima faixa vai até o mais longe que a atual alcança.',
  plan:[
  ['variável','Conte os pulos, guarde onde termina a faixa do pulo atual e o mais longe que o próximo pulo alcança.','let pulos = 0;\nlet fimDoPulo = 0;\nlet maisLonge = 0;'],
  ['for','Ande pelas posições, menos a última: chegar nela é o objetivo.','for (let i = 0; i < nums.length - 1; i++) {'],
  ['if','Se pular daqui vai mais longe, guarde esse alcance.','if (i + nums[i] > maisLonge) maisLonge = i + nums[i];'],
  ['if','Se chegou ao fim da faixa do pulo atual, é hora de pular: conte 1 e a nova faixa vai até o mais longe. Feche o for.','if (i === fimDoPulo) {\n  pulos++;\n  fimDoPulo = maisLonge;\n}\n}'],
  ['return','Devolva quantos pulos foram dados.','return pulos;']]}
  }
});
