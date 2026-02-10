param()
$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$docs = Join-Path $root 'docs'
$edgeCandidates = @(
  'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
  'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
)
$edge = $edgeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

node scripts\render-functional-html.mjs

if ($edge) {
  $docIn='file:///' + (Join-Path $root 'docs\FUNCTIONAL_SPECIFICATION.html').Replace('\\','/')
  $docOut=Join-Path $root 'docs\FUNCTIONAL_SPECIFICATION.pdf'
  $pptIn='file:///' + (Join-Path $root 'docs\StoryForge_Executive_Presentation.html').Replace('\\','/')
  $pptOut=Join-Path $root 'docs\StoryForge_Executive_Presentation.pdf'
  & $edge --headless --disable-gpu --print-to-pdf="$docOut" "$docIn" | Out-Null
  & $edge --headless --disable-gpu --print-to-pdf="$pptOut" "$pptIn" | Out-Null
} else {
  Write-Warning 'Edge not found. PDF generation skipped.'
}

$stamp=Get-Date -Format 'yyyyMMdd_HHmmss'
$hist=Join-Path $docs ("history\\$stamp")
New-Item -ItemType Directory -Force -Path $hist | Out-Null
$files=@('FUNCTIONAL_SPECIFICATION.md','FUNCTIONAL_SPECIFICATION.html','FUNCTIONAL_SPECIFICATION.pdf','StoryForge_Executive_Presentation.html','StoryForge_Executive_Presentation.pdf')
foreach($f in $files){
  $src=Join-Path $docs $f
  if(Test-Path $src){ Copy-Item $src (Join-Path $hist $f) -Force }
}
if (Test-Path (Join-Path $docs 'screenshots')) {
  Copy-Item (Join-Path $docs 'screenshots') (Join-Path $hist 'screenshots') -Recurse -Force
}
$idx=Join-Path $docs 'history\HISTORY_INDEX.md'
if(-not (Test-Path $idx)){
  "# Document History`n`n| Timestamp | Snapshot Path | Files |`n|---|---|---|" | Set-Content -Encoding UTF8 $idx
}
Add-Content -Encoding UTF8 $idx "| $stamp | `docs/history/$stamp` | 5 docs + screenshots |"
Write-Output "DOCS_UPDATED=$stamp"
