# PowerShell Script für Workflow mit automatischem Cleanup
param(
    [string]$StartDate,
    [string]$EndDate,
    [string]$CaseId
)

# Verwende das Verzeichnis, in dem das Script liegt
$AppPath = $PSScriptRoot

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Dienstplan-Workflow wird gestartet" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Planungseinheit: $CaseId"
Write-Host "Von: $StartDate"
Write-Host "Bis: $EndDate"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Wechsle zum App-Verzeichnis
Set-Location $AppPath

# Erstelle .env.local mit Workflow-Parametern
$envContent = @"
WORKFLOW_MODE=true
WORKFLOW_CASE=$CaseId
WORKFLOW_START=$StartDate
WORKFLOW_END=$EndDate
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "Workflow-Konfiguration in .env.local gespeichert" -ForegroundColor Green
Write-Host ""

# Registriere Cleanup-Handler
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    $envFile = Join-Path $AppPath ".env.local"
    if (Test-Path $envFile) {
        Remove-Item $envFile -Force
        Write-Host "`n.env.local wurde automatisch geloescht" -ForegroundColor Yellow
    }
}

Write-Host "Server wird gestartet..." -ForegroundColor Cyan
Write-Host "Druecken Sie Ctrl+C zum Beenden (Cleanup erfolgt automatisch)" -ForegroundColor Yellow
Write-Host ""

# Starte npm dev und warte
try {
    # Starte npm dev über cmd (da npm.cmd ein Batch-Script ist)
    $process = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm", "run", "dev" -NoNewWindow -PassThru
    
    # Warte kurz und öffne Browser
    Start-Sleep -Seconds 8
    Start-Process "http://localhost:3000/workflow"
    
    Write-Host "`nBrowser wurde geoeffnet" -ForegroundColor Green
    Write-Host "Druecken Sie Ctrl+C um Server und Workflow zu beenden`n" -ForegroundColor Yellow
    
    # Warte auf Prozess-Ende
    $process.WaitForExit()
}
catch {
    Write-Host "Fehler beim Starten des Servers: $_" -ForegroundColor Red
}
finally {
    # Cleanup garantiert beim Beenden
    if (Test-Path ".env.local") {
        Remove-Item ".env.local" -Force
        Write-Host "`n========================================" -ForegroundColor Cyan
        Write-Host "Cleanup: .env.local wurde geloescht" -ForegroundColor Green
        Write-Host "Workflow-Modus beendet" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
    }
}

Write-Host "`nDruecken Sie eine Taste zum Schliessen..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
