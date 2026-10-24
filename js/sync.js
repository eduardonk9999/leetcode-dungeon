/* Salvar no GitHub: cada lição ou batalha vencida vira um commit num repositório do jogador.
   O commit leva o código que a pessoa escreveu, o progresso (progresso.json) e um README com as estatísticas.
   Ao abrir o jogo, o progresso do repositório é baixado e juntado com o deste aparelho.
   O token fica só neste navegador e só é enviado para api.github.com. Carrega depois de js/licao.js. */

const SYNC_KEY = 'masmorra-sync-v1';
const GH_API = 'https://api.github.com';
const PROG_FILE = 'progresso.json';
const sync = (() => { try { return JSON.parse(localStorage.getItem(SYNC_KEY)) || {}; } catch (e){ return {}; } })();
const saveSync = () => { try { localStorage.setItem(SYNC_KEY, JSON.stringify(sync)); } catch (e){} };
let syncBusy = false, syncState = sync.repo ? 'idle' : 'off', syncError = '', syncErrStatus = 0;

/* ---------- base64 com UTF-8 (acentos e emoji) ---------- */
const b64encode = s => { const bytes = new TextEncoder().encode(s); let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(bin); };
const b64decode = b => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\s/g, '')), c => c.charCodeAt(0)));

/* ---------- API ---------- */
async function gh(pathname, opts = {}){
  const res = await fetch(GH_API + pathname, { ...opts, headers: {
    Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28',
    Authorization: `Bearer ${sync.token}`, ...(opts.body ? { 'Content-Type': 'application/json' } : {}) } });
  if (!res.ok){
    let msg = ''; try { msg = (await res.json()).message || ''; } catch (e){}
    const err = new Error(msg || `HTTP ${res.status}`); err.status = res.status; throw err;
  }
  return res.status === 204 ? null : res.json();
}
const repoPath = () => `/repos/${sync.repo}`;
function explain(e){
  syncErrStatus = e.status || 0;
  if (e.status === 401) return 'Token inválido ou expirado. Gere um novo e conecte de novo.';
  if (e.status === 403 && /not accessible|permission/i.test(e.message)) return 'O token só pode ler o repositório. No GitHub, abra o token e, em Repository permissions → Contents, troque Read-only por Read and write e tente de novo.';
  if (e.status === 403) return `O GitHub recusou a escrita (403: ${e.message}). Confira se o token tem Contents: Read and write nesse repositório.`;
  if (e.status === 404) return 'Repositório não encontrado, ou o token não tem acesso a ele (confira Repository access).';
  if (e instanceof TypeError) return 'Sem conexão com o GitHub agora. O progresso fica guardado aqui e sobe na próxima vez.';
  return `O GitHub respondeu: ${e.message}`;
}

/* ---------- juntar progresso de dois aparelhos ---------- */
// fica com a melhor nota de cada sala e com a ofensiva mais recente
function mergeProg(local, remote){
  const best = (a = {}, b = {}) => { const o = { ...a }; for (const k in b) o[k] = Math.max(o[k] ?? -1, b[k]); return o; };
  const s1 = local.streak, s2 = remote.streak;
  let streak = s1 || s2;
  if (s1 && s2) streak = s1.last > s2.last ? s1 : s2.last > s1.last ? s2 : (s1.count >= s2.count ? s1 : s2);
  if (streak) streak = { ...streak, best: Math.max(s1?.best || 0, s2?.best || 0, streak.count) };
  return { lessons: best(local.lessons, remote.lessons), cleared: best(local.cleared, remote.cleared), streak };
}
const progSnapshot = () => ({ versao: 1, atualizado: new Date().toISOString(), lessons: prog.lessons || {}, cleared: prog.cleared || {}, streak: prog.streak || null });
const sameProg = (a, b) => JSON.stringify([a.lessons, a.cleared, a.streak]) === JSON.stringify([b.lessons, b.cleared, b.streak]);

async function readRemote(){
  try {
    const f = await gh(`${repoPath()}/contents/${PROG_FILE}?ref=${encodeURIComponent(sync.branch)}`);
    return JSON.parse(b64decode(f.content));
  } catch (e){ if (e.status === 404) return null; throw e; }
}
// baixa o progresso do repositório e junta com o local.
// changed: algo mudou neste aparelho; behind: o repositório não tem tudo o que este aparelho tem
async function pull(){
  const remote = await readRemote();
  if (!remote) return { changed: false, behind: true };
  const merged = mergeProg(prog, remote);
  const changed = !sameProg(merged, prog);
  Object.assign(prog, merged); save();
  return { changed, behind: !sameProg(merged, remote) };
}

/* ---------- commit de vários arquivos de uma vez ---------- */
async function commitFiles(message, files){
  let base;
  try { base = (await gh(`${repoPath()}/git/ref/heads/${sync.branch}`)).object.sha; }
  catch (e){
    if (e.status !== 409 && e.status !== 404) throw e;
    // repositório vazio: o primeiro arquivo cria o branch, o resto vai no commit normal
    await gh(`${repoPath()}/contents/${PROG_FILE}`, { method: 'PUT', body: JSON.stringify({ message: '🗡️ Início da masmorra', content: b64encode(files[PROG_FILE]) }) });
    base = (await gh(`${repoPath()}/git/ref/heads/${sync.branch}`)).object.sha;
  }
  const baseTree = (await gh(`${repoPath()}/git/commits/${base}`)).tree.sha;
  const tree = await gh(`${repoPath()}/git/trees`, { method: 'POST', body: JSON.stringify({
    base_tree: baseTree, tree: Object.entries(files).map(([p, content]) => ({ path: p, mode: '100644', type: 'blob', content })) }) });
  const commit = await gh(`${repoPath()}/git/commits`, { method: 'POST', body: JSON.stringify({ message, tree: tree.sha, parents: [base] }) });
  await gh(`${repoPath()}/git/refs/heads/${sync.branch}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha }) });
  return commit;
}

/* ---------- conteúdo do commit ---------- */
const lcSlug = t => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const solutionPath = L => `solucoes/andar-${String(L.floor + 1).padStart(2, '0')}/${L.id}.js`;
const STARS = n => '★'.repeat(n) + '☆'.repeat(3 - n);
function solutionFile(w){
  const L = w.L;
  return `// ${L.title} · LeetCode #${L.lc} · https://leetcode.com/problems/${lcSlug(L.title)}/\n`
    + `// Masmorra do Algoritmo · Andar ${L.floor + 1} (${FLOORS[L.floor].name}) · ${w.kind === 'lesson' ? 'lição' : w.kind === 'boss' ? 'chefe' : 'batalha'} ${STARS(w.stars)} · ${dayKey()}\n`
    + `// Padrão: ${L.pattern} · Tempo ${L.time} · Espaço ${L.space}\n\n${w.code.trim()}\n`;
}
function readmeFile(){
  const t = totals(), s = prog.streak || { count: 0, best: 0 };
  const solved = LEVELS.filter(L => prog.lessons[L.id] !== undefined || prog.cleared[L.id] !== undefined);
  const rows = FLOORS.map((F, f) => {
    const ns = nodesOf(f), done = ns.filter(nodeDone).length, st = ns.reduce((a, n) => a + (nodeStars(n) || 0), 0);
    return `| ${String(f + 1).padStart(2, '0')} | ${F.name} | ${F.theme} | ${done}/${ns.length} | ${st}/${ns.length * 3} |`;
  }).join('\n');
  const list = solved.map(L => `- [${L.title}](${solutionPath(L)}) · #${L.lc} · ${L.pattern}`
    + (prog.lessons[L.id] !== undefined ? ` · lição ${STARS(prog.lessons[L.id])}` : '')
    + (prog.cleared[L.id] ? ` · problema completo ${STARS(prog.cleared[L.id])}` : '')).join('\n');
  return `# 🗡️ Minha jornada na Masmorra do Algoritmo

Treinando LeetCode em lições de 5 minutos na [Masmorra do Algoritmo](https://eduardonk9999.github.io/leetcode-dungeon/). Cada commit deste repositório é uma lição ou batalha vencida.

**🔥 Ofensiva: ${streakNow()} ${streakNow() === 1 ? 'dia' : 'dias'}** (recorde ${s.best || s.count || 0}) · **★ ${t.got}/${t.max}** · **${solved.length} problemas**

| Andar | Nome | Padrão | Feito | ★ |
|:---:|---|---|:---:|:---:|
${rows}

## Problemas resolvidos

${list || '_Nenhum ainda. A primeira lição está te esperando._'}

<sub>Atualizado automaticamente pelo jogo em ${dayKey()}.</sub>
`;
}

/* ---------- registrar vitória ---------- */
// chamado ao fim de uma lição ou batalha vencida; nunca bloqueia o jogo
async function syncWin(w){
  if (!sync.repo || !sync.token) return;
  (sync.queue = sync.queue || []).push({ id: w.L.id, kind: w.kind, stars: w.stars, code: w.code, at: dayKey() });
  saveSync();
  return flush();
}
async function flush(){
  if (syncBusy || !sync.repo || !sync.token) return;
  syncBusy = true; setSyncState('busy');
  try {
    const { behind } = await pull();
    const q = sync.queue || [];
    if (!q.length && !behind){ setSyncState('ok'); return; } // nada novo: sem commit vazio
    const files = { [PROG_FILE]: JSON.stringify(progSnapshot(), null, 2) + '\n' };
    q.forEach(w => { const L = LEVELS.find(x => x.id === w.id); if (L && w.code) files[solutionPath(L)] = solutionFile({ ...w, L }); });
    files['README.md'] = readmeFile();
    const last = q[q.length - 1], L = last && LEVELS.find(x => x.id === last.id);
    const msg = L
      ? `${last.kind === 'lesson' ? '✅' : '⚔️'} ${L.title} (${last.kind === 'lesson' ? 'lição' : last.kind === 'boss' ? 'chefe' : 'problema completo'} ${STARS(last.stars)}) · 🔥 ${streakNow()}`
        + (q.length > 1 ? `\n\nMais ${q.length - 1} vitória(s) que estavam esperando conexão.` : '')
      : '🔄 Sincroniza progresso';
    let commit;
    try { commit = await commitFiles(msg, files); }
    catch (e){ // outro aparelho commitou no meio: junta de novo e refaz progresso e README
      if (e.status !== 422) throw e;
      await pull(); files[PROG_FILE] = JSON.stringify(progSnapshot(), null, 2) + '\n'; files['README.md'] = readmeFile();
      commit = await commitFiles(msg, files);
    }
    sync.queue = []; sync.last = { at: new Date().toISOString(), url: commit.html_url, msg: msg.split('\n')[0] };
    saveSync(); setSyncState('ok');
  } catch (e){ syncError = explain(e); setSyncState('error'); }
  finally { syncBusy = false; renderMap(); renderHUD(); }
}

/* ---------- HUD e tela de conexão ---------- */
function setSyncState(s){
  syncState = s;
  const b = $('syncBtn'); if (!b) return;
  const label = { off: '☁ Salvar no GitHub', idle: '☁ GitHub', busy: '☁ salvando…', ok: '☁ ✓', error: '☁ !' }[s];
  b.innerHTML = `<span class="full">${label}</span><span class="short">${s === 'off' ? '☁' : label}</span>`;
  b.className = `btn-ghost sync s-${s}`;
  b.title = s === 'error' ? syncError : sync.last ? `Último commit: ${sync.last.msg}` : 'Salvar o progresso num repositório seu do GitHub';
  if (!modal.hidden && modal.querySelector('#syncPanel')) openSyncPanel();
  const t = $('today'); if (!t) return;
  let w = $('syncWarn');
  if (s === 'error' && sync.repo){
    if (!w){ w = document.createElement('button'); w.id = 'syncWarn'; w.className = 'syncwarn'; w.onclick = openSyncPanel; t.after(w); }
    w.innerHTML = `<b>☁ Não consegui salvar no GitHub.</b> ${esc(syncError)} <u>Ver detalhes</u>`;
  } else if (w) w.remove();
}
const ago = iso => { const m = Math.round((Date.now() - new Date(iso)) / 60000); return m < 1 ? 'agora' : m < 60 ? `há ${m} min` : m < 1440 ? `há ${Math.round(m / 60)} h` : `há ${Math.round(m / 1440)} d`; };
function openSyncPanel(){
  const pend = (sync.queue || []).length;
  if (sync.repo && sync.token){
    openModal(`<div id="syncPanel">
      <h2>${syncState === 'error' ? 'Não consegui salvar' : 'Salvo no GitHub'}</h2>
      <p>Conectado a <a href="https://github.com/${esc(sync.repo)}" target="_blank" rel="noopener"><b>${esc(sync.repo)}</b></a>. Cada lição ou batalha vencida vira um commit lá, com o seu código.</p>
      ${sync.last ? `<p class="label">ÚLTIMO COMMIT · ${esc(ago(sync.last.at).toUpperCase())}</p><p><a href="${esc(sync.last.url)}" target="_blank" rel="noopener">${esc(sync.last.msg)}</a></p>` : '<p style="color:var(--muted)">Nenhum commit ainda. Termine uma lição para fazer o primeiro.</p>'}
      ${pend ? `<p>⏳ ${pend} ${pend === 1 ? 'vitória esperando' : 'vitórias esperando'} para subir.</p>` : ''}
      ${syncState === 'error' ? `<p class="syncerr">${esc(syncError)}</p>` : ''}
      <div class="row">
        <button class="btn primary" data-act="sync-now" ${syncBusy ? 'disabled' : ''}>${syncBusy ? 'Sincronizando…' : syncState === 'error' ? 'Tentar de novo' : 'Sincronizar agora'}</button>
        <button class="btn" data-act="stay">Fechar</button>
        <button class="btn warn" data-act="sync-off">Desconectar</button>
      </div></div>`);
    return;
  }
  openModal(`<div id="syncPanel">
    <h2>Salvar no GitHub</h2>
    <p>Cada lição ou batalha vencida vira um <b>commit num repositório seu</b>, com o código que você escreveu. O progresso passa a sincronizar entre celular e computador, e o treino do dia aparece como quadradinho verde no seu perfil.</p>
    <ol class="ssteps">
      <li><b>Crie o repositório</b> público: <a href="https://github.com/new?name=leetcode-dungeon-progresso&description=Minha%20jornada%20na%20Masmorra%20do%20Algoritmo&visibility=public" target="_blank" rel="noopener">criar leetcode-dungeon-progresso</a>.</li>
      <li><b>Crie um token</b> <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">fine-grained</a>: em <i>Repository access</i>, escolha <i>Only select repositories</i> e marque o repositório; em <i>Permissions</i>, dê <i>Contents: Read and write</i>.</li>
      <li><b>Cole os dois aqui.</b></li>
    </ol>
    <label class="field">Repositório<input id="syncRepo" placeholder="seu-usuario/leetcode-dungeon-progresso" autocomplete="off" autocapitalize="off" spellcheck="false" value="${esc(sync.repo || '')}"></label>
    <label class="field">Token<input id="syncToken" type="password" placeholder="github_pat_…" autocomplete="off" spellcheck="false"></label>
    <p class="fine">O token fica só neste navegador e só vai para api.github.com. Use em aparelhos seus; você pode revogar quando quiser em Settings → Developer settings. O quadradinho verde conta em repositório público (ou privado, se você ativar <i>Private contributions</i> no perfil).</p>
    ${syncState === 'error' ? `<p class="syncerr">${esc(syncError)}</p>` : ''}
    <div class="row">
      <button class="btn primary" data-act="sync-connect" ${syncBusy ? 'disabled' : ''}>${syncBusy ? 'Conectando…' : 'Conectar'}</button>
      <button class="btn" data-act="stay">Agora não</button>
    </div></div>`);
}
async function connect(repoIn, tokenIn){
  const repo = repoIn.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/+$/, '');
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)){ syncError = 'Escreva o repositório como usuario/nome.'; setSyncState('error'); return openSyncPanel(); }
  if (!tokenIn.trim()){ syncError = 'Cole o token.'; setSyncState('error'); return openSyncPanel(); }
  Object.assign(sync, { repo, token: tokenIn.trim() });
  syncBusy = true; setSyncState('busy'); openSyncPanel();
  try {
    const info = await gh(repoPath());
    if (info.permissions && !info.permissions.push) throw Object.assign(new Error('sem escrita'), { status: 403 });
    sync.branch = info.default_branch || 'main';
    saveSync();
    syncBusy = false;
    await flush(); // baixa o que já existe, junta com este aparelho e faz o primeiro commit
    if (syncState === 'error' && (syncErrStatus === 401 || syncErrStatus === 403 || syncErrStatus === 404)){ delete sync.token; saveSync(); setSyncState('error'); }
  } catch (e){
    syncBusy = false; syncError = explain(e);
    delete sync.token; saveSync(); setSyncState('error');
  }
  openSyncPanel();
}
function disconnect(){ for (const k of Object.keys(sync)) delete sync[k]; saveSync(); syncError = ''; setSyncState('off'); closeModal(); }

modal.addEventListener('click', e => {
  const a = e.target.closest('[data-act]'); if (!a) return;
  if (a.dataset.act === 'sync-connect') connect($('syncRepo').value, $('syncToken').value);
  if (a.dataset.act === 'sync-now') flush().then(openSyncPanel);
  if (a.dataset.act === 'sync-off') disconnect();
});

// ao abrir: põe o botão no HUD, baixa o progresso do repositório e sobe o que ficou pendente
(function initSync(){
  const b = document.createElement('button'); b.id = 'syncBtn'; b.type = 'button';
  b.onclick = openSyncPanel;
  $('streak').before(b);
  setSyncState(syncState);
  if (!sync.repo || !sync.token) return;
  if ((sync.queue || []).length) { flush(); return; }
  syncBusy = true; setSyncState('busy');
  pull().then(r => { setSyncState('ok'); if (r.changed){ renderMap(); renderHUD(); } })
    .catch(e => { syncError = explain(e); setSyncState('error'); })
    .finally(() => { syncBusy = false; });
})();
