/* Runtime compartilhado: roda dentro do Web Worker do jogo e no validador (tools/check.mjs).
   Converte os argumentos dos testes (arrays) em ListNode/TreeNode, converte a saída de volta
   e compara com o esperado. A função inteira é serializada com toString() para virar o Worker,
   então ela não pode depender de nada de fora. */
function MASMORRA_RUNTIME(){
  class ListNode { constructor(val = 0, next = null){ this.val = val; this.next = next; } }
  class TreeNode { constructor(val = 0, left = null, right = null){ this.val = val; this.left = left; this.right = right; } }
  const LIMIT = 200000;

  const toList = arr => { let head = null; for (let i = arr.length - 1; i >= 0; i--) head = new ListNode(arr[i], head); return head; };
  const fromList = head => {
    const out = [];
    for (let n = head; n; n = n.next){ out.push(n.val); if (out.length > LIMIT) throw new Error('A lista devolvida tem um ciclo (ou é grande demais).'); }
    return out;
  };
  // {vals:[3,2,0,-4], pos:1} -> lista cujo último nó aponta para o nó de índice pos (-1 = sem ciclo)
  const toCycle = ({vals, pos}) => {
    const nodes = vals.map(v => new ListNode(v));
    nodes.forEach((n, i) => { n.next = nodes[i + 1] || null; });
    if (pos >= 0 && nodes.length) nodes[nodes.length - 1].next = nodes[pos];
    return nodes[0] || null;
  };
  // ordem por nível no formato do LeetCode: [3,9,20,null,null,15,7]
  const toTree = arr => {
    if (!arr.length || arr[0] === null) return null;
    // fila com índice de leitura: shift() é O(n) e deixaria a montagem O(n²) em árvores grandes
    const root = new TreeNode(arr[0]), q = [root]; let i = 1, h = 0;
    while (h < q.length && i < arr.length){
      const n = q[h++];
      if (i < arr.length && arr[i] !== null){ n.left = new TreeNode(arr[i]); q.push(n.left); } i++;
      if (i < arr.length && arr[i] !== null){ n.right = new TreeNode(arr[i]); q.push(n.right); } i++;
    }
    return root;
  };
  const fromTree = root => {
    const out = [], q = [root]; let h = 0;
    while (h < q.length){
      const n = q[h++];
      if (out.length > LIMIT) throw new Error('A árvore devolvida é grande demais (ou tem um ciclo).');
      if (n){ out.push(n.val); q.push(n.left, n.right); } else out.push(null);
    }
    while (out.length && out[out.length - 1] === null) out.pop();
    return out;
  };
  const findNode = (root, val) => {
    const st = [root];
    while (st.length){ const n = st.pop(); if (!n) continue; if (n.val === val) return n; st.push(n.left, n.right); }
    return null;
  };

  // inT: tipo de cada argumento. null = como está | 'list' | 'cycle' | 'lists' | 'tree' | 'node' (valor de um nó da 1ª árvore)
  function prepArgs(args, inT){
    if (!inT) return args;
    const out = args.map((a, i) => {
      const t = inT[i];
      if (t === 'list') return toList(a);
      if (t === 'cycle') return toCycle(a);
      if (t === 'lists') return a.map(toList);
      if (t === 'tree') return toTree(a);
      return a;
    });
    const tree = out[inT.indexOf('tree')];
    inT.forEach((t, i) => { if (t === 'node') out[i] = findNode(tree, args[i]); });
    return out;
  }
  // outT: null | 'list' | 'tree' | 'val' (nó -> valor, ou null)
  // duck typing de propósito: quem colar "class ListNode" do LeetCode no editor cria nós de outra classe
  const isNode = v => v !== null && typeof v === 'object' && !Array.isArray(v) && 'val' in v;
  function packOut(out, outT){
    if (outT === 'list') return isNode(out) || out === null || out === undefined ? fromList(out) : out;
    if (outT === 'tree') return isNode(out) || out === null || out === undefined ? fromTree(out || null) : out;
    if (outT === 'val') return isNode(out) ? out.val : out;
    return out;
  }

  const byJSON = (a, b) => { const x = JSON.stringify(a), y = JSON.stringify(b); return x < y ? -1 : x > y ? 1 : 0; };
  const sortFlat = a => [...a].sort((x, y) => typeof x === 'number' && typeof y === 'number' ? x - y : byJSON(x, y));
  // cmp: undefined = exato | 'unordered' = ordem do array não importa | 'nested' = nem a ordem externa nem a das listas internas
  //      'groups' = igual a 'nested' (agrupar anagramas) | 'outer' = só a ordem externa não importa | 'float' = número com tolerância
  function same(got, exp, cmp){
    if (cmp === 'float') return typeof got === 'number' && Math.abs(got - exp) < 1e-5;
    if (Array.isArray(got) && Array.isArray(exp)){
      if (cmp === 'unordered'){ got = sortFlat(got); exp = sortFlat(exp); }
      else if (cmp === 'nested' || cmp === 'groups'){
        const norm = a => a.map(x => Array.isArray(x) ? sortFlat(x) : x).sort(byJSON);
        got = norm(got); exp = norm(exp);
      }
      else if (cmp === 'outer'){ got = [...got].sort(byJSON); exp = [...exp].sort(byJSON); }
    }
    return JSON.stringify(got) === JSON.stringify(exp);
  }

  return { ListNode, TreeNode, toList, fromList, toTree, fromTree, prepArgs, packOut, same };
}
if (typeof module !== 'undefined') module.exports = MASMORRA_RUNTIME;
