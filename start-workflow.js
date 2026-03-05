/* eslint-disable */
const { exec, spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Kommandozeilen-Argumente auslesen
// node start-workflow.js <START> <END> <CASE>
const args = process.argv.slice(2);

if (args.length < 3) {
    console.error('Usage: node start-workflow.js <START> <END> <CASE>');
    console.error('Example: node start-workflow.js 01.08.2024 31.08.2024 77');
    process.exit(1);
}

const startDate = args[0];
const endDate = args[1];
const caseId = args[2];

// Die Ziel-URL für deinen neuen Cookie-Endpoint
const url = `http://localhost:3000/api/workflow/start?caseId=${caseId}&start=${startDate}&end=${endDate}`;

// Plattformunabhängiger npm-Befehl
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// Plattformunabhängiger Befehl zum Öffnen des Browsers
function openBrowser(targetUrl) {
    const platform = process.platform;
    let command;

    if (platform === 'win32') {
        command = `start "" "${targetUrl}"`; // Windows
    } else if (platform === 'darwin') {
        command = `open "${targetUrl}"`;     // Mac
    } else {
        command = `xdg-open "${targetUrl}"`; // Linux
    }

    exec(command);
}

// helper to run shell commands and return promise
function runCommand(cmd, args, options = {}) {
    return new Promise((resolve, reject) => {
        const proc = spawn(cmd, args, Object.assign({stdio: 'inherit', shell: true}, options));
        proc.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
        });
    });
}

async function ensurePrerequisites() {
    // install dependencies if necessary
    if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
        console.log('node_modules fehlt - führe "npm install" aus...');
        await runCommand(npmCmd, ['install']);
    }

    // run build if no successful build output exists (check for BUILD_ID file)
    const buildIdPath = path.join(__dirname, '.next', 'BUILD_ID');
    if (!fs.existsSync(buildIdPath)) {
        console.log('Kein gültiger Build gefunden - führe "npm run build" aus...');
        await runCommand(npmCmd, ['run', 'build']);
    }
}

// Prüfen, ob der Server schon läuft (Port 3000)
(async () => {
    try {
        await ensurePrerequisites();
    } catch (err) {
        console.error('Fehler bei der Vorbereitung der Umgebung:', err);
        process.exit(1);
    }

    http.get('http://localhost:3000', (res) => {
        // Server läuft bereits! Einfach nur den Browser öffnen.
        console.log(`Server läuft bereits. Öffne Browser für Case ${caseId}...`);
        openBrowser(url);
    }).on('error', (e) => {
        // Server läuft noch nicht. Wir müssen ihn starten!
        console.log('Server läuft noch nicht. Starte Next.js...');

        const nextProcess = spawn(npmCmd, ['run', 'start'], {
            stdio: 'inherit',
            shell: true
        });

        console.log('Warte auf Server-Start...');

        // Polling: Warte, bis der Server erreichbar ist, und öffne dann den Browser
        const checkServer = setInterval(() => {
            http.get('http://localhost:3000', (res) => {
                clearInterval(checkServer);
                console.log(`Server ist online! Öffne Browser für Case ${caseId}...`);
                openBrowser(url);
            }).on('error', () => {
                // Noch nicht bereit, warte weiter...
            });
        }, 1000);
    });
})();
