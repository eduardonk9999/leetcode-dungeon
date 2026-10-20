#!/usr/bin/env node
/* Gera docs/banner.png com os sprites e paletas do próprio jogo: node tools/banner.mjs
   Desenha numa cena lógica de 256x64 e amplia 5x sem suavizar, como o canvas do jogo. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const spriteSrc = html.slice(html.indexOf('const norm ='), html.indexOf('const HEART'));
const { SPR, HERO_PAL } = vm.runInNewContext(spriteSrc + ';({SPR, HERO_PAL})');

const LEVELS = [];
const range = n => Array.from({length: n}, (_, i) => i);
const ctx = vm.createContext({ range, BIG: range(100000), addFloor: F => LEVELS.push(...F.levels) });
for (const f of fs.readdirSync(path.join(ROOT, 'levels')).filter(f => /^andar-\d+\.js$/.test(f)).sort())
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'levels', f), 'utf8'), ctx);
const level = id => LEVELS.find(L => L.id === id);

const W = 256, H = 64, SCALE = 5;
const px = new Float32Array(W * H * 3);
const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const put = (x, y, rgb, a = 1) => {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  for (let k = 0; k < 3; k++) px[i + k] = px[i + k] * (1 - a) + rgb[k] * a;
};
const rect = (x, y, w, h, c, a = 1) => { const rgb = hex(c); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, rgb, a); };
const sprite = (rows, pal, x, y, s = 1, flip = false) => {
  for (let r = 0; r < 16; r++) for (let i = 0; i < 16; i++){
    const ch = rows[r][i]; if (ch === '.' || !pal[ch]) continue;
    rect(flip ? x + (15 - i) * s : x + i * s, y + r * s, s, s, pal[ch]);
  }
};

// parede de tijolos (mesma receita do fundo do jogo)
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
rect(0, 0, W, H, '#100c18');
for (let row = 0; row < 9; row++){
  const y = row * 6, off = (row % 2) * 6;
  for (let x = -off; x < W; x += 12){
    const v = rnd();
    rect(x + 1, y + 1, 10, 4, v < .12 ? '#342b4d' : v < .3 ? '#1c1729' : '#272038');
    if (v > .93) rect(x + 2 + ((rnd() * 6) | 0), y + 4, 2, 1, '#3a6b45');
  }
}
// chão
rect(0, 52, W, 12, '#1a1524');
for (let x = 0; x < W; x += 16) rect(x + 1, 53, 14, 8, rnd() < .3 ? '#2a2338' : '#221c2f');
rect(0, 52, W, 1, '#3d3459');
// tochas com brilho
const glow = hex('#f0a23b');
const torch = (x, y) => {
  for (let j = -34; j < 30; j++) for (let i = -32; i < 34; i++){
    const d = Math.hypot(i, j + 3) / 30; if (d < 1) put(x + i, y + j, glow, .3 * (1 - d) * (1 - d));
  }
  rect(x - 1, y, 4, 8, '#4a3b2c'); rect(x - 2, y, 6, 2, '#6b5640');
  rect(x - 1, y - 6, 4, 6, '#ec5d50'); rect(x, y - 5, 2, 5, '#f0a23b'); rect(x, y - 2, 2, 2, '#ffe28a');
};
torch(10, 20); torch(250, 20);
const shadow = (cx, w) => rect(cx - w, 52, w * 2, 2, '#000000', .45);

// herói atacando
shadow(30, 9); sprite(SPR.hero, HERO_PAL, 22, 36);
for (let i = -6; i <= 6; i += 2) rect(45 + i, 41 - i, 2, 2, '#ffffff');
// a primeira sala de cada sprite, na ordem do jogo, e o dragão chefe no fim
const seen = new Set(['dragon']);
const lineup = LEVELS.filter(L => !seen.has(L.sprite) && seen.add(L.sprite));
let x = 58;
for (const L of lineup){ shadow(x + 8, 6); sprite(SPR[L.sprite], L.pal, x, 36, 1, L.flip); x += 17; }
const boss = level('longest-substring');
shadow(x + 18, 14); sprite(SPR.dragon, boss.pal, x + 2, 20, 2, true);

// PNG RGB 8 bits, ampliado sem suavização
const OW = W * SCALE, OH = H * SCALE;
const raw = Buffer.alloc((OW * 3 + 1) * OH);
for (let y = 0; y < OH; y++){
  const o = y * (OW * 3 + 1);
  for (let x2 = 0; x2 < OW; x2++){
    const i = (((y / SCALE) | 0) * W + ((x2 / SCALE) | 0)) * 3;
    for (let k = 0; k < 3; k++) raw[o + 1 + x2 * 3 + k] = Math.round(px[i + k]);
  }
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(zlib.crc32(td));
  return Buffer.concat([len, td, crc]);
};
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(OW, 0); ihdr.writeUInt32BE(OH, 4); ihdr[8] = 8; ihdr[9] = 2;
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
fs.mkdirSync(path.join(ROOT, 'docs'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'docs/banner.png'), png);
console.log(`docs/banner.png ${OW}x${OH} · ${lineup.length} monstros + chefe · ${(png.length / 1024).toFixed(1)} KB`);
