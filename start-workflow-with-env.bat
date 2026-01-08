@echo off
REM Execute npm run dev -- --WORKFLOW_MODE=true --WORKFLOW_CASE=120 --WORKFLOW_START=01.02.2024 --WORKFLOW_END=30.02.2024
npm run dev -- --WORKFLOW_MODE=true --WORKFLOW_CASE=%3 --WORKFLOW_START=%1 --WORKFLOW_END=%2

REM Open the browser to view the application
start http://localhost:3000/workflow
