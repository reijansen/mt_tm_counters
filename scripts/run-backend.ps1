$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $repoRoot "backend"
$venvPython = Join-Path $backendPath ".venv\Scripts\python.exe"

if (Test-Path $venvPython) {
    $pythonCmd = $venvPython
} else {
    $pythonCmd = "python"
}

Push-Location $backendPath
try {
    & $pythonCmd -m uvicorn app.main:app --reload
} finally {
    Pop-Location
}

