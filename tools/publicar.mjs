// Publica a apresentação: gera o site estático e espelha out/ em site/, que é um clone deste mesmo
// repositório no branch gh-pages (servido pelo GitHub Pages). O branch main guarda a fonte.
// uso: node tools/publicar.mjs "mensagem do commit"
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const AQUI = resolve(import.meta.dirname, '..');
const SITE = resolve(AQUI, 'site');
const mensagem = process.argv[2];
if (!mensagem) throw new Error('faltou a mensagem do commit');
if (!existsSync(resolve(SITE, '.git'))) throw new Error('site/ não é um clone do branch gh-pages');

const roda = (cmd, args, cwd = AQUI) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });

roda(process.execPath, ['node_modules/next/dist/bin/next', 'build', '--webpack']);

// espelho: tudo que não é do repositório sai e entra o build novo
for (const nome of readdirSync(SITE)) {
  if (nome !== '.git') rmSync(resolve(SITE, nome), { recursive: true, force: true });
}
cpSync(resolve(AQUI, 'out'), SITE, { recursive: true });
// sem isto o GitHub Pages ignora a pasta _next
writeFileSync(resolve(SITE, '.nojekyll'), '');

roda('git', ['add', '-A'], SITE);
const mudou = execFileSync('git', ['status', '--porcelain'], { cwd: SITE, encoding: 'utf8' }).trim();
if (!mudou) {
  console.log('nada mudou no site, nada a publicar');
} else {
  roda('git', ['commit', '-m', mensagem], SITE);
  roda('git', ['push', 'origin', 'gh-pages'], SITE);
  console.log('publicado: https://cauelimsia.github.io/fabrica-proximos-passos-apresentacao/');
}
