param(
  [string]$SubscriptionId = "",
  [string]$ProjectEndpoint = "",
  [string]$ProjectId = "",
  [string]$ApiVersion = "2025-05-01"
)

$ErrorActionPreference = "Stop"

function Ensure-AzCli {
  $az = Get-Command az -ErrorAction SilentlyContinue
  if (-not $az) {
    throw "Azure CLI (az) not found. Install from https://learn.microsoft.com/cli/azure/install-azure-cli"
  }
}

function Ensure-AzLogin {
  try {
    $null = az account show 2>$null
  } catch {
    Write-Host "Azure login required. Opening az login..." -ForegroundColor Yellow
    az login | Out-Null
  }
}

function Get-JsonValueArray($obj) {
  if ($null -eq $obj) { return @() }
  if ($obj.value) { return @($obj.value) }
  if ($obj.data) { return @($obj.data) }
  if ($obj.agents) { return @($obj.agents) }
  if ($obj -is [System.Array]) { return @($obj) }
  return @()
}

function Get-AgentName($agent) {
  if ($agent.name) { return [string]$agent.name }
  if ($agent.displayName) { return [string]$agent.displayName }
  if ($agent.title) { return [string]$agent.title }
  return ""
}

function Get-AgentId($agent) {
  if ($agent.id) { return [string]$agent.id }
  if ($agent.agentId) { return [string]$agent.agentId }
  if ($agent.identifier) { return [string]$agent.identifier }
  return ""
}

function Find-AgentIdByKeywords($agents, $keywords) {
  foreach ($agent in $agents) {
    $name = (Get-AgentName $agent).ToLowerInvariant()
    if (-not $name) { continue }
    $allMatch = $true
    foreach ($k in $keywords) {
      if (-not $name.Contains($k)) {
        $allMatch = $false
        break
      }
    }
    if ($allMatch) {
      return Get-AgentId $agent
    }
  }
  return ""
}

Ensure-AzCli
Ensure-AzLogin

if ($SubscriptionId) {
  az account set --subscription $SubscriptionId
}

if (-not $ProjectEndpoint) {
  $ProjectEndpoint = Read-Host "Foundry Project Endpoint (ex: https://<resource>.services.ai.azure.com/api/projects/<project>)"
}

if (-not $ProjectEndpoint) {
  throw "Project endpoint is required."
}

if (-not $ProjectId) {
  if ($ProjectEndpoint -match "/api/projects/([^/?]+)") {
    $ProjectId = $Matches[1]
  } else {
    $ProjectId = Read-Host "Foundry Project ID"
  }
}

$token = az account get-access-token --resource "https://ai.azure.com" --query accessToken -o tsv
if (-not $token) {
  throw "Failed to acquire Azure token for https://ai.azure.com"
}

$agents = @()
$raw = ""
$discoveryWarning = $null
try {
  $agentsUrl = "$ProjectEndpoint/agents?api-version=$ApiVersion"
  $raw = az rest --method get --url $agentsUrl --headers "Authorization=Bearer $token" 2>$null
  if ($LASTEXITCODE -eq 0 -and $raw) {
    $json = $raw | ConvertFrom-Json
    $agents = Get-JsonValueArray $json
  } else {
    $discoveryWarning = "Agent discovery failed (az rest)."
  }
} catch {
  $discoveryWarning = "Agent discovery failed: $($_.Exception.Message)"
}

$map = [ordered]@{
  "VITE_FOUNDRY_AGENT_CONTEXT_INGESTOR_ID"          = @("context","ingestor");
  "VITE_FOUNDRY_AGENT_QUESTIONNAIRE_DISCOVERY_ID"   = @("questionnaire","discovery");
  "VITE_FOUNDRY_AGENT_REQUIREMENTS_GENERATOR_ID"    = @("requirements","generator");
  "VITE_FOUNDRY_AGENT_ACCEPTANCE_CRITERIA_ID"       = @("acceptance","criteria");
  "VITE_FOUNDRY_AGENT_TEST_DESIGN_ID"               = @("test","design");
  "VITE_FOUNDRY_AGENT_QUALITY_GATE_ID"              = @("quality","gate");
  "VITE_FOUNDRY_AGENT_VERSIONING_DIFF_ID"           = @("versioning","diff");
  "VITE_FOUNDRY_AGENT_EXPORT_ID"                    = @("export");
  "VITE_FOUNDRY_AGENT_AUDIT_LOGGING_ID"             = @("audit","logging");
}

$resolved = [ordered]@{}
foreach ($key in $map.Keys) {
  $resolved[$key] = if ($agents.Count -gt 0) { Find-AgentIdByKeywords $agents $map[$key] } else { "" }
}

$envPath = Join-Path (Get-Location) ".env.local"
$agentUrlTemplate = "$ProjectEndpoint/agents/{agentId}/runs?api-version=$ApiVersion"

$lines = @()
$lines += "VITE_AGENT_PROVIDER=foundry"
$lines += ""
$lines += "VITE_FOUNDRY_MODE=agent-id"
$lines += "VITE_FOUNDRY_ENDPOINT=$ProjectEndpoint"
$lines += "VITE_FOUNDRY_PROJECT_ID=$ProjectId"
$lines += "VITE_FOUNDRY_AUTH_MODE=bearer"
$lines += "VITE_FOUNDRY_API_KEY_HEADER=api-key"
$lines += "VITE_FOUNDRY_API_KEY=$token"
$lines += "VITE_FOUNDRY_AGENT_URL_TEMPLATE=$agentUrlTemplate"
$lines += ""
$lines += "# Auto-resolved Agent IDs (verify and adjust if needed)"
foreach ($k in $resolved.Keys) {
  $lines += "$k=$($resolved[$k])"
}

[System.IO.File]::WriteAllLines($envPath, $lines, (New-Object System.Text.UTF8Encoding($false)))

$exportDir = Join-Path (Get-Location) "docs\\_export"
if (-not (Test-Path $exportDir)) {
  New-Item -Path $exportDir -ItemType Directory | Out-Null
}
$agentsDumpPath = Join-Path $exportDir "foundry-agents-latest.json"
if ($raw) {
  [System.IO.File]::WriteAllText($agentsDumpPath, ($raw | Out-String), (New-Object System.Text.UTF8Encoding($false)))
}

Write-Host ""
Write-Host "Foundry setup completed." -ForegroundColor Green
Write-Host ".env.local updated: $envPath"
if ($raw) {
  Write-Host "Agents dump: $agentsDumpPath"
}
Write-Host ""
if ($agents.Count -gt 0) {
  Write-Host "Detected agents:"
  foreach ($agent in $agents) {
    $id = Get-AgentId $agent
    $name = Get-AgentName $agent
    Write-Host ("- {0} => {1}" -f $name, $id)
  }
} else {
  Write-Host "Detected agents: none (auto-discovery unavailable)" -ForegroundColor Yellow
  if ($discoveryWarning) {
    Write-Host $discoveryWarning -ForegroundColor Yellow
  }
}
Write-Host ""
Write-Host "Resolved mapping:"
foreach ($k in $resolved.Keys) {
  $v = $resolved[$k]
  if ($v) {
    Write-Host ("OK   {0} = {1}" -f $k, $v) -ForegroundColor Green
  } else {
    Write-Host ("MISS {0} = <fill manually>" -f $k) -ForegroundColor Yellow
  }
}
Write-Host ""
Write-Host "Note: token in VITE_FOUNDRY_API_KEY expires. Re-run this script when needed." -ForegroundColor Yellow
