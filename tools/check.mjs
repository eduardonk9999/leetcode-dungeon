#!/usr/bin/env node
/* Validador dos andares: node tools/check.mjs [levels/andar-05.js ...]
   Sem argumentos, valida todos os arquivos levels/andar-*.js na ordem.
   Para cada sala: confere os campos, roda a solução de referência e o código do modo guiado
   contra todos os testes (com o mesmo runtime do jogo) e garante que o código inicial vazio falha. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const MASMORRA_RUNTIME = require(path.join(ROOT, 'js/runtime.js'));
const RT = MASMORRA_RUNTIME();

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const SPRITES = new Set([...html.matchAll(/^  (\w+): norm\(/gm)].map(m => m[1]));
const DIFFS = new Set(['Easy', 'Medium', 'Hard']);
const IN_T = new Set([null, 'list', 'cycle', 'lists', 'tree', 'node']);
const OUT_T = new Set([undefined, null, 'list', 'tree', 'val']);
const CMPS = new Set([undefined, 'unordered', 'nested', 'groups', 'outer', 'float']);
const SLOW_MS = 800, TIMEOUT_MS = 2500; // aviso com 3x de folga sobre o limite do jogo

const files = process.argv.slice(2).length ? process.argv.slice(2)
  : fs.readdirSync(path.join(ROOT, 'levels')).filter(f => /^andar-\d+\.js$/.test(f)).sort().map(f => path.join('levels', f));

const FLOORS = [], LEVELS = [], GUIDE = {};
const range = n => Array.from({length: n}, (_, i) => i);
const loadCtx = vm.createContext({ range, BIG: range(100000),
  addFloor(F){ const f = FLOORS.length; FLOORS.push({...F, file: cur}); F.levels.forEach((L, i) => { L.floor = f; L.inFloor = i; L.boss = i === F.levels.length - 1; L.file = cur; LEVELS.push(L); }); Object.assign(GUIDE, F.guide); } });
let cur = null;
let errors = 0, warns = 0;
const err = (where, msg) => { errors++; console.log(`  ✗ ${where}: ${msg}`); };
const warn = (where, msg) => { warns++; console.log(`  ! ${where}: ${msg}`); };

for (const f of files){
  cur = f;
  try { vm.runInContext(fs.readFileSync(path.resolve(ROOT, f), 'utf8'), loadCtx, { filename: f }); }
  catch (e){ errors++; console.log(`✗ ${f} não carregou: ${e.message}`); }
}

// executa o código do jogador como o Worker faria, mas com timeout síncrono do vm
function run(code, L){
  const ctx = vm.createContext({ ListNode: RT.ListNode, TreeNode: RT.TreeNode, console: { log(){}, info(){}, warn(){}, error(){} } });
  let f;
  try { f = vm.runInContext(code + `\n;typeof ${L.fn} === 'function' ? ${L.fn} : null`, ctx, { timeout: TIMEOUT_MS }); }
  catch (e){ return { compile: e.message }; }
  if (!f) return { compile: `função ${L.fn} não encontrada` };
  return { results: L.tests.map(t => {
    const raw = structuredClone(t.args);
    try {
      ctx.__f = f; ctx.__args = RT.prepArgs(raw, L.inT || null);
      const t0 = performance.now();
      const res = vm.runInContext('__f(...__args)', ctx, { timeout: TIMEOUT_MS });
      const ms = performance.now() - t0;
      const out = RT.packOut(res, L.outT || null);
      const got = out === undefined ? undefined : JSON.parse(JSON.stringify(out));
      return { ok: RT.same(got, t.expect, L.cmp || (L.unordered ? 'unordered' : undefined)), got, ms };
    } catch (e){ return { ok: false, error: e.message }; }
  }) };
}
const show = v => { const s = JSON.stringify(v); return s && s.length > 90 ? s.slice(0, 87) + '…' : s; };
const callOf = (L, t) => t.label || `${L.fn}(${t.args.map(show).join(', ')})`;

const ids = new Set();
let lastFile = null;
for (const L of LEVELS){
  if (L.file !== lastFile){ lastFile = L.file; console.log(`\n${L.file} · Andar ${L.floor + 1}: ${FLOORS[L.floor].name}`); }
  const where = `${L.id || '(sem id)'}`;
  const before = errors;
  if (ids.has(L.id)) err(where, 'id repetido'); ids.add(L.id);
  for (const k of ['id', 'lc', 'diff', 'pattern', 'fn', 'params', 'title', 'monster', 'sprite', 'pal', 'story', 'desc', 'tests', 'hints', 'solution', 'time', 'space', 'lesson'])
    if (L[k] === undefined || L[k] === '') err(where, `falta o campo ${k}`);
  if (!DIFFS.has(L.diff)) err(where, `diff inválido: ${L.diff}`);
  if (!SPRITES.has(L.sprite)) err(where, `sprite desconhecido: ${L.sprite} (existem: ${[...SPRITES].join(', ')})`);
  if (L.inT && (!Array.isArray(L.inT) || L.inT.some(t => !IN_T.has(t)))) err(where, `inT inválido: ${JSON.stringify(L.inT)}`);
  if (L.inT && L.inT.length !== L.params.split(',').length) err(where, 'inT precisa ter um item por parâmetro');
  if (!OUT_T.has(L.outT)) err(where, `outT inválido: ${L.outT}`);
  if (!CMPS.has(L.cmp)) err(where, `cmp inválido: ${L.cmp}`);
  if (!Array.isArray(L.tests) || L.tests.length < 4) err(where, 'precisa de pelo menos 4 testes');
  (L.tests || []).forEach((t, i) => { if (!Array.isArray(t.args) || t.args.length !== L.params.split(',').length) err(where, `teste ${i + 1}: args não bate com params`); if (!('expect' in t)) err(where, `teste ${i + 1}: falta expect`); });
  if (!Array.isArray(L.hints) || L.hints.length < 2) err(where, 'precisa de pelo menos 2 dicas');
  if (L.solution && !new RegExp(`function\\s+${L.fn}\\s*\\(`).test(L.solution)) err(where, `a solução não define function ${L.fn}(...)`);
  const G = GUIDE[L.id];
  if (!G || !G.think || !Array.isArray(G.plan) || G.plan.length < 3) err(where, 'modo guiado ausente ou com menos de 3 passos');
  else G.plan.forEach((p, i) => { if (!Array.isArray(p) || p.length !== 3 || p.some(x => typeof x !== 'string' || !x)) err(where, `passo ${i + 1} do guia precisa ser [ferramenta, frase, código]`); });
  if (errors > before) continue;

  const check = (label, code, mustPass) => {
    const r = run(code, L);
    if (r.compile){ err(where, `${label} não compilou: ${r.compile}`); return; }
    r.results.forEach((x, i) => {
      if (mustPass && !x.ok) err(where, `${label} falhou em ${callOf(L, L.tests[i])}: esperado ${show(L.tests[i].expect)}, recebeu ${x.error ? 'erro ' + x.error : show(x.got)}`);
      if (mustPass && x.ok && x.ms > SLOW_MS) warn(where, `${label} levou ${x.ms.toFixed(0)} ms em ${callOf(L, L.tests[i])}`);
    });
    return r;
  };
  check('solução', L.solution, true);
  const guideCode = `function ${L.fn}(${L.params}) {\n` + G.plan.map(p => p[2]).join('\n') + `\n}`;
  check('código do guia', guideCode, true);
  const empty = run(`function ${L.fn}(${L.params}) {\n}`, L);
  if (empty.results && empty.results.every(x => x.ok)) err(where, 'o código inicial vazio passa em todos os testes; os testes não provam nada');
  if (errors === before) console.log(`  ✓ ${L.id} (#${L.lc}, ${L.tests.length} testes)${L.boss ? ' · chefe' : ''}`);
}

console.log(`\n${LEVELS.length} salas em ${FLOORS.length} andares · ${errors} erro(s) · ${warns} aviso(s)`);
process.exit(errors ? 1 : 0);
