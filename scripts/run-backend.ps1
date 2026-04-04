$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $repoRoot "backend"
$venvPython = Join-Path $backendPath ".venv\Scripts\python.exe"
$backendEnvFile = Join-Path $backendPath ".env"

if (Test-Path $venvPython) {
    $pythonCmd = $venvPython
} else {
    $pythonCmd = "python"
}

Push-Location $backendPath
try {
    if (Test-Path $backendEnvFile) {
        Get-Content $backendEnvFile | ForEach-Object {
            $line = $_.Trim()
            if (-not $line -or $line.StartsWith("#")) {
                return
            }

            $parts = $line -split "=", 2
            if ($parts.Length -eq 2) {
                [System.Environment]::SetEnvironmentVariable($parts[0], $parts[1])
            }
        }
    }

    $apiHost = if ($env:API_HOST) { $env:API_HOST } else { "127.0.0.1" }
    $apiPort = if ($env:API_PORT) { $env:API_PORT } else { "8000" }

    & $pythonCmd -m uvicorn app.main:app --reload --host $apiHost --port $apiPort
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
} finally {
    Pop-Location
}
