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
  $listResp = Invoke-WebRequest -Method GET -Uri $listUrl -Headers $headers -TimeoutSec $TimeoutSec
  Write-Host "  OK ($($listResp.StatusCode)) - Agents API reachable" -ForegroundColor Green
  $listJson = $listResp.Content | ConvertFrom-Json
  $agentList = if ($listJson.data) { $listJson.data } else { @() }
  Write-Host "  Found $($agentList.Count) agent(s):" -ForegroundColor Green
  foreach ($ag in $agentList) {
    Write-Host "    - $($ag.id) : $($ag.name)" -ForegroundColor White
  }
} catch {
  $errMsg = $_.Exception.Message
  if ($_.Exception.Response) {
    $errMsg = "HTTP $($_.Exception.Response.StatusCode.value__)"
    try {
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      $errMsg += " - $($reader.ReadToEnd().Substring(0, [Math]::Min(200, $reader.ReadToEnd().Length)))"
    } catch { }
  }
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
    $resp = Invoke-WebRequest -Method POST -Uri $threadsRunsUrl -Headers $headers -Body $body -TimeoutSec $TimeoutSec
    $statusCode = $resp.StatusCode
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
    if ($_.Exception.Response) {
      $httpCode = $_.Exception.Response.StatusCode.value__
      $status = "ERR($httpCode)"
      try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $txt = $reader.ReadToEnd()
        if ($txt.Length -gt 250) { $txt = $txt.Substring(0, 250) + '...' }
        $note = $txt
      } catch {}
    }
    $results += [PSCustomObject]@{ Agent = $a.type; Id = $id; Status = $status; Note = $note }
    Write-Host "    $status :: $note" -ForegroundColor Red
  }
}

Write-Host "`n=== Results ===" -ForegroundColor Cyan
$results | Format-Table -AutoSize
