/* Trilha estilo Duolingo, lições de 5 minutos e ofensiva diária.
   Carrega depois do script principal do index.html e usa o que ele define:
   LEVELS, FLOORS, GUIDE, LESSONS, prog/save, a cena (S, useCanvas, heroStrike…), runTests e o modal. */

/* ---------- OFENSIVA ---------- */
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); };
function streakNow(){
  const s = prog.streak; if (!s) return 0;
  return s.last === dayKey() || s.last === yesterday() ? s.count : 0;
}
const doneToday = () => !!prog.streak && prog.streak.last === dayKey();
// conta o dia de hoje; devolve true quando a ofensiva subiu agora
function bumpStreak(){
  const t = dayKey(), s = prog.streak || { last: null, count: 0, best: 0 };
  if (s.last === t) return false;
  s.count = s.last === yesterday() ? s.count + 1 : 1;
  s.best = Math.max(s.best || 0, s.count);
  s.last = t; prog.streak = s; save();
  return true;
}

/* ---------- TRILHA ---------- */
prog.lessons = prog.lessons || {};
const hasLessons = f => floorLevels(f).some(L => LESSONS[L.id]);
// nós de um andar: uma lição por sala que já tem lição, e no fim a batalha completa do chefe.
// andar ainda sem lições continua com uma batalha por sala.
function nodesOf(f){
  const ls = floorLevels(f);
  if (!hasLessons(f)) return ls.map(L => ({ kind: L.boss ? 'boss' : 'battle', L }));
  return ls.filter(L => LESSONS[L.id]).map(L => ({ kind: 'lesson', L })).concat({ kind: 'boss', L: ls[ls.length - 1] });
}
const nodeStars = n => n.kind === 'lesson' ? prog.lessons[n.L.id] : prog.cleared[n.L.id];
const nodeDone = n => nodeStars(n) !== undefined;
function nodeOpen(nodes, k, f){
  if (k > 0) return nodeDone(nodes[k - 1]);
  if (f === 0) return true;
  const first = nodesOf(0); return nodeDone(first[first.length - 1]);
}
function totals(){
  let got = 0, max = 0;
  FLOORS.forEach((F, f) => nodesOf(f).forEach(n => { got += nodeStars(n) || 0; max += 3; }));
  return { got, max };
}
// o próximo nó a jogar: o primeiro aberto e ainda não feito
function nextNode(){
  for (let f = 0; f < FLOORS.length; f++){
    const ns = nodesOf(f);
    for (let k = 0; k < ns.length; k++) if (nodeOpen(ns, k, f) && !nodeDone(ns[k])) return { f, k, n: ns[k] };
  }
  return null;
}
const ZIG = [0, 56, 84, 56, 0, -56, -84, -56];
function renderMap(){
  const root = $('rooms'); root.innerHTML = '';
  const nx = nextNode();
  renderToday(nx);
  FLOORS.forEach((F, f) => {
    const ns = nodesOf(f), done = ns.filter(nodeDone).length;
    const stars = ns.reduce((a, n) => a + (nodeStars(n) || 0), 0);
    const head = document.createElement('div'); head.className = 'floor';
    head.innerHTML = `<h2><small>ANDAR ${String(f + 1).padStart(2, '0')}</small>${esc(F.name)}</h2>
      <span class="fmeta">${esc(F.theme)} · <b>${done}/${ns.length}</b> ${hasLessons(f) ? 'lições' : 'salas'} · <b>★ ${stars}/${ns.length * 3}</b></span>`;
    const path = document.createElement('ol'); path.className = 'path';
    ns.forEach((n, k) => {
      const open = nodeOpen(ns, k, f), st = nodeStars(n), here = nx && nx.f === f && nx.k === k;
      const li = document.createElement('li');
      li.className = `node k-${n.kind}${st !== undefined ? ' done' : ''}${here ? ' current' : ''}${open ? '' : ' locked'}`;
      li.style.setProperty('--dx', ZIG[k % ZIG.length] + 'px');
      const what = n.kind === 'lesson' ? 'LIÇÃO' : n.kind === 'boss' ? 'CHEFE · PROBLEMA COMPLETO' : 'BATALHA';
      li.innerHTML = `${here ? `<span class="bubble">${n.kind === 'lesson' ? 'COMEÇAR' : 'LUTAR'}</span>` : ''}
        <button ${open ? '' : 'disabled'} data-f="${f}" data-k="${k}" aria-label="${esc(what + ': ' + n.L.title)}${open ? '' : ' (trancada)'}"><canvas width="16" height="16"></canvas></button>
        <span class="lbl"><span class="kind">${what}</span>${esc(n.L.title)}</span>
        ${st !== undefined ? `<span class="st">${starsHTML(st)}</span>` : ''}`;
      path.appendChild(li);
      const c = li.querySelector('canvas').getContext('2d');
      drawSprite(c, SPR[n.L.sprite], n.L.pal, 0, 0, 1, n.L.flip, open ? null : '#2b2440');
    });
    root.append(head, path);
  });
}
function renderToday(nx){
  const s = streakNow(), today = doneToday();
  $('today').innerHTML = `
    <div class="flame ${today ? 'lit' : ''}"><b>${s}</b><span>${s === 1 ? 'dia' : 'dias'}</span></div>
    <div class="tmsg">
      <p class="t1">${today ? 'Ofensiva garantida hoje. 🔥' : s ? 'Faça uma lição hoje para não perder a ofensiva.' : 'Uma lição por dia, uns 5 minutos.'}</p>
      ${nx ? `<p class="t2">Próxima: <b>${esc(nx.n.L.title)}</b> · ${nx.n.kind === 'lesson' ? 'lição' : 'batalha completa'}</p>` : '<p class="t2">Você limpou a masmorra inteira.</p>'}
    </div>
    ${nx ? `<button class="btn primary" id="goNext">${nx.n.kind === 'lesson' ? 'Começar' : 'Lutar'} ▸</button>` : ''}`;
  const b = $('goNext'); if (b) b.onclick = () => openNode(nx.f, nx.k);
}
function openNode(f, k){
  const n = nodesOf(f)[k];
  if (n.kind === 'lesson') startLesson(n.L.index); else enterRoom(n.L.index);
}
$('rooms').addEventListener('click', e => { const b = e.target.closest('.node button'); if (b && !b.disabled) openNode(+b.dataset.f, +b.dataset.k); });

/* ---------- LIÇÃO ---------- */
let lesson = null;
const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
// embaralha garantindo que não saia já na ordem certa
const shuffleOff = a => { if (a.length < 2) return a.slice(); let r; do r = shuffle(a); while (r.every((x, i) => x === a[i])); return r; };
const MARK = '/*>>*/';

function prepCard(c, L){
  const card = { ...c, src: c };
  if (c.type === 'order'){ card.steps = c.steps || GUIDE[L.id].plan.map(p => p[1]); card.deck = shuffleOff(card.steps.map((_, i) => i)); }
  if (c.type === 'output') card.call = `${L.fn}(${c.args.map(fmt).join(', ')})`;
  if (c.type === 'blank') card.deck = shuffle(c.bank.map((_, i) => i));
  if (c.type === 'choice' || c.type === 'output'){ const order = shuffle(c.opts.map((_, i) => i)); card.optOrder = order; }
  return card;
}
function startLesson(i){
  const L = LEVELS[i]; cur = L; busy = false;
  const cards = LESSONS[L.id].cards.map(c => prepCard(c, L));
  lesson = { L, queue: cards, total: cards.length, right: 0, errors: 0, card: null, state: 'ask', sel: null };
  $('mapView').hidden = true; $('battleView').hidden = true; $('lessonView').hidden = false; $('toMap').hidden = true;
  $('lessonTitle').textContent = L.title;
  useCanvas($('lessonScene')); resetScene(); S.mon.hp = S.mon.max = cards.length;
  renderHUD(); scrollTo(0, 0);
  nextCard();
}
function nextCard(){
  lesson.card = lesson.queue.shift(); lesson.state = 'ask'; lesson.sel = null;
  const c = lesson.card;
  if (c.type === 'order') lesson.sel = [];
  if (c.type === 'blank') lesson.sel = Array(c.a.length).fill(null);
  renderProgress(); renderCard(); setCheck('Verificar', false); $('fb').className = 'fb'; $('fb').innerHTML = '';
  $('checkbar').className = 'checkbar';
}
function renderProgress(){
  const p = lesson.right / lesson.total;
  $('lessonProg').style.setProperty('--p', p);
  $('lessonCount').textContent = `${lesson.right}/${lesson.total}`;
}
const KIND = { choice: 'Escolha', order: 'Monte o plano', blank: 'Complete o código', output: 'Qual a saída?', bug: 'Ache o bug', code: 'Escreva o código' };
function renderCard(){
  const c = lesson.card, el = $('card');
  let h = `<p class="ckind">${KIND[c.type]}</p><h3 class="cq">${c.q}</h3>`;
  if (c.code && c.type !== 'blank') h += `<pre class="ccode">${esc(c.code)}</pre>`;
  if (c.type === 'choice' || c.type === 'output'){
    if (c.type === 'output') h += `<pre class="ccode">${esc(c.call)}</pre>`;
    h += `<div class="opts">${c.optOrder.map(i => `<button class="opt${c.type === 'output' ? ' mono' : ''}" data-v="${i}">${c.type === 'output' ? esc(c.opts[i]) : c.opts[i]}</button>`).join('')}</div>`;
  }
  if (c.type === 'bug'){
    h += `<div class="lines">${c.lines.map((l, i) => `<button class="line" data-v="${i}"><span class="ln">${i + 1}</span><code>${esc(l)}</code></button>`).join('')}</div>`;
  }
  if (c.type === 'order'){
    h += `<ol class="slots" id="slots"></ol><div class="bank" id="bank"></div>`;
  }
  if (c.type === 'blank'){
    let k = 0;
    h += `<pre class="ccode blankcode">${esc(c.code).replace(/___/g, () => `<button class="gap" data-g="${k++}"></button>`)}</pre><div class="bank tokens" id="bank"></div>`;
  }
  if (c.type === 'code'){
    const [before, after] = c.template.split(MARK);
    h += `<div class="codecard"><pre class="ccode pre">${esc(before.replace(/\n$/, ''))}</pre>
      <textarea id="snip" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Seu código" placeholder="${esc(c.placeholder || '    // escreva aqui')}"></textarea>
      <pre class="ccode post">${esc(after.replace(/^\n/, ''))}</pre></div>`;
    if (c.hint) h += `<details class="chint"><summary>Dica</summary><p>${c.hint}</p></details>`;
  }
  el.innerHTML = h;
  if (c.type === 'order' || c.type === 'blank') renderPieces();
  if (c.type === 'code'){
    const ta = $('snip'); ta.value = lesson.draft || ''; lesson.draft = '';
    const fit = () => { ta.style.height = 'auto'; ta.style.height = Math.max(64, ta.scrollHeight) + 'px'; };
    ta.addEventListener('input', () => { setCheck('Verificar', ta.value.trim() !== ''); fit(); });
    ta.addEventListener('keydown', e => {
      if (e.key === 'Tab'){ e.preventDefault(); ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end'); }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)){ e.preventDefault(); $('checkBtn').click(); }
    });
    fit(); setCheck('Verificar', ta.value.trim() !== '');
    if (!matchMedia('(pointer: coarse)').matches) ta.focus();
  }
}
function renderPieces(){
  const c = lesson.card;
  if (c.type === 'order'){
    $('slots').innerHTML = lesson.sel.map((i, k) => `<li><button class="piece in" data-k="${k}">${esc(c.steps[i])}</button></li>`).join('')
      + (lesson.sel.length < c.steps.length ? `<li class="ghost">toque nos passos abaixo, na ordem</li>` : '');
    $('bank').innerHTML = c.deck.map(i => `<button class="piece" data-i="${i}" ${lesson.sel.includes(i) ? 'disabled' : ''}>${esc(c.steps[i])}</button>`).join('');
    setCheck('Verificar', lesson.sel.length === c.steps.length);
  } else {
    document.querySelectorAll('.gap').forEach(g => { const v = lesson.sel[+g.dataset.g]; g.textContent = v === null ? '' : c.bank[v]; g.classList.toggle('filled', v !== null); });
    $('bank').innerHTML = c.deck.map(i => `<button class="piece tok" data-i="${i}" ${lesson.sel.includes(i) ? 'disabled' : ''}>${esc(c.bank[i])}</button>`).join('');
    setCheck('Verificar', lesson.sel.every(v => v !== null));
  }
}
$('card').addEventListener('click', e => {
  if (!lesson || lesson.state !== 'ask') return;
  const c = lesson.card, t = e.target.closest('button'); if (!t) return;
  if (t.classList.contains('opt') || t.classList.contains('line')){
    lesson.sel = +t.dataset.v;
    document.querySelectorAll('#card .opt, #card .line').forEach(b => b.classList.toggle('sel', b === t));
    setCheck('Verificar', true);
  } else if (c.type === 'order'){
    if (t.dataset.k !== undefined) lesson.sel.splice(+t.dataset.k, 1);
    else if (t.dataset.i !== undefined) lesson.sel.push(+t.dataset.i);
    renderPieces();
  } else if (c.type === 'blank'){
    if (t.classList.contains('gap')) lesson.sel[+t.dataset.g] = null;
    else if (t.dataset.i !== undefined){ const k = lesson.sel.indexOf(null); if (k >= 0) lesson.sel[k] = +t.dataset.i; }
    renderPieces();
  }
});
function setCheck(text, enabled){ const b = $('checkBtn'); b.textContent = text; b.disabled = !enabled; }

async function check(){
  if (lesson.state === 'end') return; // duplo toque no último "Continuar"
  const c = lesson.card;
  if (lesson.state === 'ask'){
    let ok, answer = '', extra = '';
    if (c.type === 'choice' || c.type === 'output' || c.type === 'bug'){
      ok = lesson.sel === c.a;
      answer = c.type === 'bug' ? `linha ${c.a + 1}` : c.type === 'output' ? `<code>${esc(c.opts[c.a])}</code>` : c.opts[c.a];
      document.querySelectorAll('#card .opt, #card .line').forEach(b => { const v = +b.dataset.v; b.classList.toggle('right', v === c.a); b.classList.toggle('wrong', v === lesson.sel && !ok); });
    } else if (c.type === 'order'){
      ok = lesson.sel.every((v, i) => v === i);
      answer = `<ol class="fbol">${c.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>`;
    } else if (c.type === 'blank'){
      ok = lesson.sel.every((v, k) => c.bank[v] === c.a[k]);
      answer = c.a.map(a => `<code>${esc(a)}</code>`).join(' · ');
    } else if (c.type === 'code'){
      setCheck('Testando…', false); busy = true;
      const code = c.template.replace(MARK, $('snip').value);
      const res = await runTests(code, lesson.L); busy = false;
      if (!lesson || lesson.card !== c) return;
      const fails = lesson.L.tests.map((t, i) => [t, res.results[i]]).filter(([t, r]) => !r || !judge(lesson.L, t, r));
      ok = !res.compileError && fails.length === 0;
      if (!ok){
        if (res.compileError) extra = `O código não compilou: <code>${esc(res.compileError)}</code>`;
        else { const [t, r] = fails[0]; extra = `${fails.length} de ${lesson.L.tests.length} testes falharam. Em <code>${esc(callStr(t))}</code>: esperado <code>${esc(fmt(t.expect))}</code>, ${r && r.timeout ? 'tempo esgotado' : r && r.error ? `erro <code>${esc(r.error)}</code>` : `recebido <code>${esc(fmt(r && r.got))}</code>`}.`; }
        return codeWrong(c, extra);
      }
    }
    lesson.state = 'done';
    if (ok){
      lesson.right++; renderProgress(); heroStrike();
      $('fb').className = 'fb ok'; $('fb').innerHTML = `<b>${['Mandou bem!', 'Isso!', 'Certinho.', 'Golpe certeiro!'][Math.floor(Math.random() * 4)]}</b>${c.why ? `<p>${c.why}</p>` : ''}`;
    } else {
      lesson.errors++; monStrike(); lesson.queue.push(prepCard(c.src, lesson.L));
      $('fb').className = 'fb bad'; $('fb').innerHTML = `<b>Resposta certa:</b> ${answer}${c.why ? `<p>${c.why}</p>` : ''}<p class="again">Esse card volta no fim da lição.</p>`;
    }
    $('checkbar').className = 'checkbar ' + (ok ? 'ok' : 'bad');
    setCheck('Continuar', true);
  } else {
    if (lesson.queue.length) nextCard(); else { lesson.state = 'end'; finishLesson(); }
  }
}
function codeWrong(c, extra){
  if (!lesson.codeMissed){ lesson.codeMissed = true; lesson.errors++; }
  monStrike();
  $('fb').className = 'fb bad';
  $('fb').innerHTML = `<b>Ainda não.</b><p>${extra}</p><p><button class="linkbtn" id="showAns">Ver a resposta</button></p>`;
  $('checkbar').className = 'checkbar bad';
  setCheck('Verificar de novo', true);
  $('showAns').onclick = () => { $('snip').value = c.answer; $('snip').dispatchEvent(new Event('input')); };
}
$('checkBtn').onclick = () => { if (lesson && !busy) check(); };
document.addEventListener('keydown', e => {
  if ($('lessonView').hidden || !lesson || !modal.hidden) return;
  if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && document.activeElement !== $('snip') && !$('checkBtn').disabled){ e.preventDefault(); $('checkBtn').click(); }
  if (lesson.state === 'ask' && /^[1-9]$/.test(e.key) && document.activeElement !== $('snip')){
    const bs = [...document.querySelectorAll('#card .opt, #card .line, #bank .piece:not(:disabled)')]; const b = bs[+e.key - 1]; if (b) b.click();
  }
});

async function finishLesson(){
  const ls = lesson, L = ls.L, st = ls.errors === 0 ? 3 : ls.errors <= 2 ? 2 : 1;
  prog.lessons[L.id] = Math.max(prog.lessons[L.id] || 0, st);
  const up = bumpStreak(); save(); renderHUD();
  setCheck('…', false);
  killMonster(); await sleep(RM ? 200 : 900);
  const s = streakNow();
  openModal(`
    <h2>Lição completa!</h2>
    <div class="bigstars">${starsHTML(st)}</div>
    ${up ? `<p class="streakup">🔥 <b>${s} ${s === 1 ? 'dia' : 'dias'}</b> de ofensiva${s > 1 ? '. Continue amanhã!' : '. Volte amanhã para aumentar.'}</p>` : `<p style="color:var(--muted)">Ofensiva de hoje já garantida: 🔥 ${s} ${s === 1 ? 'dia' : 'dias'}.</p>`}
    <p>${ls.errors === 0 ? 'Sem nenhum erro.' : `${ls.errors} ${ls.errors === 1 ? 'erro' : 'erros'} no caminho; os cards errados voltaram até você acertar.`}</p>
    <p class="label">PADRÃO · ${esc(L.pattern.toUpperCase())}</p>
    <p>${L.lesson}</p>
    <div class="row">
      <button class="btn primary" data-act="map">Continuar ▸</button>
      <button class="btn" data-act="full">⚔ Problema completo</button>
    </div>`);
  if (lesson === ls) lesson = null;
}

$('lessonClose').onclick = () => {
  const b = $('lessonClose');
  if (lesson && lesson.right > 0 && !b.dataset.armed){ b.dataset.armed = '1'; b.textContent = 'Sair?'; setTimeout(() => { delete b.dataset.armed; b.textContent = '✕'; }, 2500); return; }
  delete b.dataset.armed; b.textContent = '✕'; lesson = null; toMap();
};

renderMap(); renderHUD();
