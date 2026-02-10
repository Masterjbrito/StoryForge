import fs from 'node:fs';
import path from 'node:path';

function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(s) {
  let out = esc(s);
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="shot"><img src="$2" alt="$1" /><figcaption>$1</figcaption></figure>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return out;
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function renderTable(lines, i) {
  const rows = [];
  while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
    rows.push(lines[i]);
    i += 1;
  }
  if (rows.length < 2 || !/^\|?\s*[-:| ]+\|\s*$/.test(rows[1])) {
    return { html: `<p>${inline(rows[0] || '')}</p>`, next: i };
  }
  const headers = rows[0].split('|').slice(1, -1).map(c => inline(c.trim()));
  const body = rows.slice(2).map(r => r.split('|').slice(1, -1).map(c => inline(c.trim())));
  const thead = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${body.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
  return { html: `<table>${thead}${tbody}</table>`, next: i };
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  let html = '';
  let inCode = false;
  let code = [];
  const toc = [];

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {
      if (inCode) {
        html += `<pre><code>${esc(code.join('\n'))}</code></pre>`;
        code = [];
        inCode = false;
      } else {
        inCode = true;
      }
      i += 1;
      continue;
    }

    if (inCode) {
      code.push(line);
      i += 1;
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (/^\|.*\|\s*$/.test(line)) {
      const t = renderTable(lines, i);
      html += t.html;
      i = t.next;
      continue;
    }

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const text = h[2].trim();
      const id = slugify(text);
      if (lvl <= 3) {
        toc.push({ level: lvl, text, id });
      }
      html += `<h${lvl} id="${id}">${inline(text)}</h${lvl}>`;
      i += 1;
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      html += `<ol>${items.map(x => `<li>${inline(x)}</li>`).join('')}</ol>`;
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s+/, ''));
        i += 1;
      }
      html += `<ul>${items.map(x => `<li>${inline(x)}</li>`).join('')}</ul>`;
      continue;
    }

    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6})\s+/.test(lines[i]) && !/^```/.test(lines[i]) && !/^\|.*\|\s*$/.test(lines[i]) && !/^\d+\.\s+/.test(lines[i]) && !/^-\s+/.test(lines[i])) {
      para.push(lines[i]);
      i += 1;
    }
    html += `<p>${inline(para.join(' '))}</p>`;
  }

  return { html, toc };
}

const root = process.cwd();
const mdPath = path.join(root, 'docs', 'FUNCTIONAL_SPECIFICATION.md');
const outPath = path.join(root, 'docs', 'FUNCTIONAL_SPECIFICATION.html');
const md = fs.readFileSync(mdPath, 'utf8');
const { html: body, toc } = mdToHtml(md);
const tocHtml = `<nav class="toc"><h2>Indice</h2><ul>${toc
  .map((x) => `<li class="lv${x.level}"><a href="#${x.id}">${esc(x.text)}</a></li>`)
  .join('')}</ul></nav>`;

const html = `<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>StoryForge - Especificacao Funcional</title>
<style>
:root { --ink:#0f172a; --muted:#475569; --line:#cbd5e1; --accent:#0b2a4a; --soft:#f8fafc; --brand:#0e7490; }
* { box-sizing: border-box; }
body { margin:0; font-family: "Segoe UI", Arial, sans-serif; color:var(--ink); background:#e2e8f0; }
.layout { max-width: 1360px; margin: 28px auto; display:grid; grid-template-columns: 300px minmax(0,1fr); gap:20px; }
.toc { background:#fff; border-radius:12px; box-shadow:0 10px 40px rgba(15,23,42,.12); padding:20px; height: fit-content; position: sticky; top: 16px; max-height: calc(100vh - 32px); overflow:auto; }
.toc h2 { margin:0 0 12px; border:none; padding:0; font-size:18px; color:#0b3b66; }
.toc ul { list-style:none; margin:0; padding:0; }
.toc li { margin:6px 0; }
.toc li.lv1 a { font-weight:700; }
.toc li.lv2 { padding-left:10px; }
.toc li.lv3 { padding-left:20px; }
.toc a { text-decoration:none; color:#1e293b; font-size:13px; }
.toc a:hover { color:#0e7490; text-decoration:underline; }
.page { background:#fff; padding: 44px 52px; border-radius: 12px; box-shadow: 0 10px 40px rgba(15,23,42,.15); }
h1,h2,h3,h4 { page-break-after: avoid; break-after: avoid-page; margin: 22px 0 10px; }
h1 { margin-top:0; font-size: 30px; color: var(--accent); }
h2 { font-size:22px; border-top:1px solid var(--line); padding-top:14px; color:#0b3b66; }
h3 { font-size:17px; color:#1e293b; }
p,li,td,th { font-size: 13px; line-height: 1.5; }
p { margin: 8px 0; color:#1e293b; }
ul,ol { margin: 8px 0 12px 20px; }
code { background:#eef2ff; padding: 1px 5px; border-radius: 4px; font-family: Consolas, monospace; font-size: 12px; }
pre { background:#0b1220; color:#e2e8f0; padding:14px; border-radius:8px; overflow:auto; page-break-inside: avoid; }
table { width:100%; border-collapse: collapse; margin: 12px 0 16px; page-break-inside: avoid; }
th,td { border:1px solid var(--line); padding:8px 9px; vertical-align: top; }
th { background:var(--soft); text-align:left; }
hr { border:none; border-top:1px solid var(--line); margin:16px 0; }
.shot { margin: 14px 0 22px; page-break-inside: avoid; break-inside: avoid; }
.shot img { width: 100%; border:1px solid #cbd5e1; border-radius:10px; display:block; box-shadow:0 8px 26px rgba(2,6,23,.12); }
.shot figcaption { font-size: 12px; color: var(--muted); margin-top: 8px; text-align: center; }
@media print {
  @page { size: A4; margin: 16mm 12mm 16mm 12mm; }
  body { background:#fff; }
  .layout { display:block; max-width:none; margin:0; }
  .toc { display:none; }
  .page { margin:0; max-width:none; box-shadow:none; border-radius:0; padding:0; }
  table, pre, blockquote, ul, ol, .shot { break-inside: avoid; page-break-inside: avoid; }
  h1,h2,h3 { break-after: avoid-page; }
  .shot img { max-height: 232mm; object-fit: contain; }
}
</style>
</head>
<body>
  <div class="layout">
    ${tocHtml}
    <main class="page">${body}</main>
  </div>
</body>
</html>`;

fs.writeFileSync(outPath, html, 'utf8');
console.log(`Generated ${outPath}`);
