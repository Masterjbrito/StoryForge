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
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return out;
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
      html += `<h${lvl}>${inline(h[2])}</h${lvl}>`;
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

  return html;
}

const root = process.cwd();
const mdPath = path.join(root, 'docs', 'FUNCTIONAL_SPECIFICATION.md');
const outPath = path.join(root, 'docs', 'FUNCTIONAL_SPECIFICATION.html');
const md = fs.readFileSync(mdPath, 'utf8');
const body = mdToHtml(md);

const html = `<!doctype html>
<html lang="pt-PT">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>StoryForge - Especificacao Funcional</title>
<style>
:root { --ink:#0f172a; --muted:#475569; --line:#cbd5e1; --accent:#0b2a4a; --soft:#f8fafc; }
* { box-sizing: border-box; }
body { margin:0; font-family: "Segoe UI", Arial, sans-serif; color:var(--ink); background:#e2e8f0; }
.page { max-width: 1024px; margin: 28px auto; background:#fff; padding: 44px 52px; border-radius: 12px; box-shadow: 0 10px 40px rgba(15,23,42,.15); }
h1,h2,h3,h4 { page-break-after: avoid; break-after: avoid-page; margin: 22px 0 10px; }
h1 { margin-top:0; font-size: 30px; color: var(--accent); }
h2 { font-size:22px; border-top:1px solid var(--line); padding-top:14px; }
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
@media print {
  @page { size: A4; margin: 16mm 12mm 16mm 12mm; }
  body { background:#fff; }
  .page { margin:0; max-width:none; box-shadow:none; border-radius:0; padding:0; }
  table, pre, blockquote, ul, ol { break-inside: avoid; page-break-inside: avoid; }
  h1,h2,h3 { break-after: avoid-page; }
}
</style>
</head>
<body>
  <main class="page">${body}</main>
</body>
</html>`;

fs.writeFileSync(outPath, html, 'utf8');
console.log(`Generated ${outPath}`);
