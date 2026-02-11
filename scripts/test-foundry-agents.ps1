param(
  [string]$EnvFile = '.env.local',
  [int]$TimeoutSec = 20
)

if (!(Test-Path $EnvFile)) {
  Write-Error "Env file not found: $EnvFile"
  exit 1
}

$envMap = @{}
Get-Content $EnvFile | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -notmatch '=') { return }
  $parts = $_ -split '=', 2
  $k = $parts[0].Trim()
  $v = $parts[1].Trim()
  $envMap[$k] = $v
}

$baseUrl = if ($envMap['VITE_FOUNDRY_BASE_URL']) { $envMap['VITE_FOUNDRY_BASE_URL'] } elseif ($envMap['FOUNDRY_BASE_URL']) { $envMap['FOUNDRY_BASE_URL'] } else { $envMap['VITE_FOUNDRY_ENDPOINT'] }
$apiVersion = if ($envMap['VITE_FOUNDRY_API_VERSION']) { $envMap['VITE_FOUNDRY_API_VERSION'] } elseif ($envMap['FOUNDRY_API_VERSION']) { $envMap['FOUNDRY_API_VERSION'] } else { 'v1' }
$azResource = if ($envMap['FOUNDRY_AZ_RESOURCE']) { $envMap['FOUNDRY_AZ_RESOURCE'] } else { 'https://ai.azure.com' }
$authMode = if ($envMap['VITE_FOUNDRY_AUTH_MODE']) { $envMap['VITE_FOUNDRY_AUTH_MODE'] } else { 'bearer' }
$apiKeyHeader = if ($envMap['VITE_FOUNDRY_API_KEY_HEADER']) { $envMap['VITE_FOUNDRY_API_KEY_HEADER'] } else { 'api-key' }
$apiKey = if ($envMap['VITE_FOUNDRY_API_KEY']) { $envMap['VITE_FOUNDRY_API_KEY'] } else { $envMap['FOUNDRY_API_KEY'] }
$projectId = if ($envMap['VITE_FOUNDRY_PROJECT_ID']) { $envMap['VITE_FOUNDRY_PROJECT_ID'] } else { $envMap['FOUNDRY_PROJECT_ID'] }
$azCliPath = if ($envMap['FOUNDRY_AZ_CLI_PATH']) { $envMap['FOUNDRY_AZ_CLI_PATH'] } else { 'az' }

if (-not $baseUrl) {
  Write-Error 'VITE_FOUNDRY_BASE_URL / FOUNDRY_BASE_URL / VITE_FOUNDRY_ENDPOINT missing'
  exit 1
}

# Use curl.exe for HTTP calls to avoid sporadic Invoke-WebRequest null-response issues on some PowerShell setups.
function Invoke-CurlJson {
  param(
    [Parameter(Mandatory = $true)][string]$Method,
    [Parameter(Mandatory = $true)][string]$Url,
    [Parameter(Mandatory = $true)][hashtable]$Headers,
    [string]$Body = ""
  )

  $tmpHeaders = [System.IO.Path]::GetTempFileName()
  $tmpBody = [System.IO.Path]::GetTempFileName()
  $tmpPayload = $null

  try {
    $args = @('-sS', '-D', $tmpHeaders, '-o', $tmpBody, '-X', $Method.ToUpperInvariant())
    foreach ($k in $Headers.Keys) {
      $args += @('-H', "$k`: $($Headers[$k])")
    }

    if ($Body) {
      $tmpPayload = [System.IO.Path]::GetTempFileName()
      [System.IO.File]::WriteAllText($tmpPayload, $Body, (New-Object System.Text.UTF8Encoding($false)))
      $args += @('--data-binary', "@$tmpPayload")
    }

    $args += $Url
    & curl.exe @args | Out-Null

    $statusLine = (Get-Content $tmpHeaders | Where-Object { $_ -match '^HTTP/' } | Select-Object -Last 1)
    $statusCode = 0
    if ($statusLine -match 'HTTP/\S+\s+(\d{3})') {
      $statusCode = [int]$Matches[1]
    }

    $content = ""
    if (Test-Path $tmpBody) {
      $content = Get-Content $tmpBody -Raw
    }

    return [PSCustomObject]@{
      StatusCode = $statusCode
      Content = $content
    }
  } finally {
    if ($tmpPayload -and (Test-Path $tmpPayload)) { Remove-Item $tmpPayload -Force -ErrorAction SilentlyContinue }
    if (Test-Path $tmpHeaders) { Remove-Item $tmpHeaders -Force -ErrorAction SilentlyContinue }
    if (Test-Path $tmpBody) { Remove-Item $tmpBody -Force -ErrorAction SilentlyContinue }
  }
}

# --- helpers ---

function Convert-FromBase64Url {
  param([string]$Value)
  $padded = $Value.Replace('-', '+').Replace('_', '/')
  switch ($padded.Length % 4) {
    2 { $padded += '==' }
    3 { $padded += '=' }
  }
  return [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($padded))
}

function Get-JwtExpUtc {
  param([string]$Token)
  try {
    $parts = $Token.Split('.')
    if ($parts.Length -lt 2) { return $null }
    $payloadJson = Convert-FromBase64Url $parts[1]
    $payload = $payloadJson | ConvertFrom-Json
    if ($payload.exp) { return [DateTimeOffset]::FromUnixTimeSeconds([int64]$payload.exp).UtcDateTime }
    return $null
  } catch {
    return $null
  }
}

function Get-BearerToken {
  param([string]$ConfiguredToken)
  $configuredExp = Get-JwtExpUtc $ConfiguredToken
  $nowUtc = [DateTime]::UtcNow
  if ($ConfiguredToken -and $configuredExp -and $configuredExp -gt $nowUtc.AddMinutes(2)) {
    return $ConfiguredToken
  }
  if ($ConfiguredToken -and -not $configuredExp) {
    return $ConfiguredToken
  }
  Write-Host "  [token] Refreshing via Azure CLI..." -ForegroundColor Yellow
  return (& $azCliPath account get-access-token --resource $azResource --query accessToken -o tsv)
}

# --- auth ---

$headers = @{ 'Content-Type' = 'application/json' }
if ($authMode -eq 'api-key') {
  $headers[$apiKeyHeader] = $apiKey
} else {
  $bearer = Get-BearerToken $apiKey
  $headers['Authorization'] = "Bearer $bearer"
}

# --- pre-check: list agents ---

$threadsRunsUrl = "$($baseUrl.TrimEnd('/'))/threads/runs?api-version=$apiVersion"
$listUrl = "$($baseUrl.TrimEnd('/'))/assistants?api-version=$apiVersion"

Write-Host "`n=== Pre-check: listing agents ===" -ForegroundColor Cyan
Write-Host "  GET $listUrl" -ForegroundColor DarkGray
try {
  $listResp = Invoke-CurlJson -Method GET -Url $listUrl -Headers $headers
  if ($listResp.StatusCode -lt 200 -or $listResp.StatusCode -ge 300) {
    throw "HTTP $($listResp.StatusCode) - $($listResp.Content)"
  }
  Write-Host "  OK ($($listResp.StatusCode)) - Agents API reachable" -ForegroundColor Green
  $listJson = $listResp.Content | ConvertFrom-Json
  $agentList = if ($listJson.data) { $listJson.data } else { @() }
  Write-Host "  Found $($agentList.Count) agent(s):" -ForegroundColor Green
  foreach ($ag in $agentList) {
    Write-Host "    - $($ag.id) : $($ag.name)" -ForegroundColor White
  }
} catch {
  $errMsg = $_.Exception.Message
  Write-Host "  FAILED: $errMsg" -ForegroundColor Red
  Write-Host "  (This may mean the Agent Service is not enabled on this project)" -ForegroundColor Yellow
}

# --- agents ---

$agents = @(
  @{ key = 'VITE_FOUNDRY_AGENT_CONTEXT_INGESTOR_ID'; type = 'context-ingestor' },
  @{ key = 'VITE_FOUNDRY_AGENT_QUESTIONNAIRE_DISCOVERY_ID'; type = 'questionnaire-discovery' },
  @{ key = 'VITE_FOUNDRY_AGENT_REQUIREMENTS_GENERATOR_ID'; type = 'requirements-generator' },
  @{ key = 'VITE_FOUNDRY_AGENT_ACCEPTANCE_CRITERIA_ID'; type = 'acceptance-criteria' },
  @{ key = 'VITE_FOUNDRY_AGENT_TEST_DESIGN_ID'; type = 'test-design' },
  @{ key = 'VITE_FOUNDRY_AGENT_QUALITY_GATE_ID'; type = 'quality-gate' },
  @{ key = 'VITE_FOUNDRY_AGENT_VERSIONING_DIFF_ID'; type = 'versioning-diff' },
  @{ key = 'VITE_FOUNDRY_AGENT_EXPORT_ID'; type = 'export' },
  @{ key = 'VITE_FOUNDRY_AGENT_AUDIT_LOGGING_ID'; type = 'audit-logging' }
)

Write-Host "`n=== Testing agents via POST $threadsRunsUrl ===" -ForegroundColor Cyan

$results = @()
foreach ($a in $agents) {
  $id = $envMap[$a.key]
  if (-not $id) {
    $results += [PSCustomObject]@{ Agent = $a.type; Id = '(missing)'; Status = 'SKIP'; Note = 'ID missing in env' }
    continue
  }

  # Build the documented "Create Thread and Run" body
  $inputText = (@{
    source = 'storyforge'
    projectId = $projectId
    agentType = $a.type
    payload = @{ ping = 'StoryForge connectivity test' }
  } | ConvertTo-Json -Depth 20 -Compress)

  $body = (@{
    assistant_id = $id
    thread = @{
      messages = @(@{
        role = 'user'
        content = $inputText
      })
    }
  } | ConvertTo-Json -Depth 20 -Compress)

  Write-Host "`n  [$($a.type)] POST threads/runs with assistant_id=$id" -ForegroundColor DarkGray

  try {
    $resp = Invoke-CurlJson -Method POST -Url $threadsRunsUrl -Headers $headers -Body $body
    $statusCode = $resp.StatusCode
    if ($statusCode -lt 200 -or $statusCode -ge 300) {
      throw "HTTP $statusCode - $($resp.Content)"
    }
    $respJson = $resp.Content | ConvertFrom-Json
    $runStatus = $respJson.status
    $threadId = $respJson.thread_id
    $runId = $respJson.id

    $results += [PSCustomObject]@{
      Agent = $a.type
      Id = $id
      Status = "OK($statusCode)"
      Note = "run=$runId thread=$threadId status=$runStatus"
    }
    Write-Host "    OK($statusCode) run=$runId status=$runStatus" -ForegroundColor Green
  } catch {
    $status = 'ERR'
    $note = $_.Exception.Message
    if ($note -match '^HTTP\s+(\d{3})\s+-\s+(.*)$') {
      $status = "ERR($($Matches[1]))"
      $note = $Matches[2]
      if ($note.Length -gt 250) { $note = $note.Substring(0, 250) + '...' }
    }
    $results += [PSCustomObject]@{ Agent = $a.type; Id = $id; Status = $status; Note = $note }
    Write-Host "    $status :: $note" -ForegroundColor Red
  }
}

Write-Host "`n=== Results ===" -ForegroundColor Cyan
$results | Format-Table -AutoSize
