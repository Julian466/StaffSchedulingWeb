@echo off
REM Workflow-Starter für TimeOffice Integration
REM Parameter: %1 = Startdatum (DD.MM.YYYY)
REM            %2 = Enddatum (DD.MM.YYYY)
REM            %3 = Case-Nummer

REM Pfad zur Anwendung (verwendet das Verzeichnis, in dem das Script liegt)
set APP_PATH=%~dp0

echo ========================================
echo Dienstplan-Workflow wird gestartet
echo ========================================
echo Planungseinheit: %3
echo Von: %1
echo Bis: %2
echo ========================================
echo.

REM Starte PowerShell-Script für besseres Cleanup
cd /d %APP_PATH%
powershell -ExecutionPolicy Bypass -File "start-workflow.ps1" -StartDate "%1" -EndDate "%2" -CaseId "%3"
