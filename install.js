/* eslint-disable */
const {execSync} = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");

const IS_WIN = process.platform === "win32";
const HOME = os.homedir();

let INSTALL = IS_WIN ? "C:\\StaffScheduling" : `${HOME}/StaffScheduling`;
let WEB_DIR = path.join(INSTALL, "StaffSchedulingWeb");
let CLI_DIR = path.join(INSTALL, "StaffScheduling");
let CASES_DIR = path.join(CLI_DIR, "cases");

const run = (cmd, cwd) => execSync(cmd, {cwd, stdio: "inherit"});

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

// ── Hilfsfunktionen ──────────────────────────────────────────────────────────

function checkTool(name) {
    try {
        execSync(`${name} --version`, {stdio: "pipe"});
        return true;
    } catch {
        return false;
    }
}

function pickFolder(title, defaultPath = "") {
    try {
        if (IS_WIN) {
            const tmpScript = path.join(os.tmpdir(), "_pick_folder.ps1");
            fs.writeFileSync(tmpScript, `
Add-Type -AssemblyName System.Windows.Forms
$d = New-Object System.Windows.Forms.FolderBrowserDialog
$d.Description = '${title}'
$d.ShowNewFolderButton = $true
$d.SelectedPath = '${defaultPath}'
[void][System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms')
if ($d.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
    Write-Output $d.SelectedPath
}
            `.trim(), "utf8");

            const result = execSync(
                `powershell -STA -ExecutionPolicy Bypass -File "${tmpScript}"`,
                {stdio: "pipe"}
            ).toString().trim();

            fs.unlinkSync(tmpScript);
            return result || null;

        } else if (process.platform === "darwin") {
            // ✅ "default location" setzt den Startordner im Finder
            const defaultClause = defaultPath
                ? `default location (POSIX file "${defaultPath}")`
                : "";
            return execSync(
                `osascript -e 'POSIX path of (choose folder with prompt "${title}" ${defaultClause})'`,
                {stdio: "pipe"}
            ).toString().trim().replace(/\/$/, "") || null;

        } else {
            if (!process.env.DISPLAY && !process.env.WAYLAND_DISPLAY) return null;

            if (checkTool("zenity"))
                // ✅ --filename setzt Startverzeichnis bei zenity
                return execSync(
                    `zenity --file-selection --directory --title="${title}" --filename="${defaultPath}/"`,
                    {stdio: "pipe"}
                ).toString().trim() || null;

            if (checkTool("kdialog"))
                // ✅ Pfad direkt als Argument
                return execSync(
                    `kdialog --getexistingdirectory "${defaultPath}" --title "${title}"`,
                    {stdio: "pipe"}
                ).toString().trim() || null;
        }
    } catch {
    }
    return null;
}


async function askPath(prompt, defaultVal, openFolder) {
    // ✅ defaultVal wird jetzt an den Picker weitergegeben
    const picked = pickFolder(prompt, openFolder);
    if (picked) {
        console.log(`  Ausgewählt: ${picked}`);
        return picked;
    }
    const input = await ask(`  ${prompt} [${defaultVal}]: `);
    return input.trim() || defaultVal;
}

function syncRepo(dir, url, branch) {
    if (fs.existsSync(dir)) {
        if (fs.existsSync(path.join(dir, ".git"))) {
            console.log(`  Aktualisiere ${dir}...`);
            // Switch to the target branch before pulling updates.
            if (branch) run(`git checkout ${branch}`, dir);
            run(`git pull origin ${branch ?? "main"}`, dir);
        } else {
            // Check if Folder is empty
            const files = fs.readdirSync(dir);
            if (files.length === 0) {
                console.log(`  Klone ${url} nach ${dir}...`);
                run(`git clone ${url} ${dir}`);
                if (branch) run(`git checkout ${branch}`, dir);
            } else {
                // Ask before cloning into a non-empty directory that is not a Git repository.
                console.log(`  Ordner ${dir} existiert bereits und ist kein Git-Repo.`);
                console.log(`  Inhalt: ${files.join(", ")}`);
                const doClone = ask(`  Trotzdem klonen und vorhandene Dateien überschreiben? (j/n): `);
                if (doClone.trim().toLowerCase() === "j") {
                    fs.rmSync(dir, {recursive: true, force: true});
                    console.log(`  Klone ${url} nach ${dir}...`);
                    run(`git clone ${url} ${dir}`);
                    if (branch) run(`git checkout ${branch}`, dir);
                }
            }
        }
    } else {
        console.log(`  Klone ${url} nach ${dir}...`);
        run(`git clone ${url} ${dir}`);
        if (branch) run(`git checkout ${branch}`, dir);
    }
}

function isRepo(dir, url) {
    try {
        const remote = execSync("git config --get remote.origin.url", {cwd: dir, stdio: "pipe"})
            .toString().trim();
        return remote === url;
    } catch {
        return false;
    }
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {

    // ── 1. Prerequisites ──────────────────────────────────────────────────────
    console.log("\n==> Prüfe Voraussetzungen...");

    if (!checkTool("git")) throw new Error("Git fehlt. Bitte installieren: https://git-scm.com");
    if (!checkTool("node")) throw new Error("Node.js fehlt. Bitte installieren: https://nodejs.org");

    if (!checkTool("uv")) {
        console.log("  uv nicht gefunden, installiere...");
        if (IS_WIN) run(`powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`);
        else run(`curl -LsSf https://astral.sh/uv/install.sh | sh`);
        // Refresh PATH in the current process after installing uv.
        process.env.PATH += IS_WIN
            ? `;${HOME}\\.local\\bin`
            : `:${HOME}/.local/bin`;
        if (!checkTool("uv")) throw new Error("uv konnte nicht installiert werden. Bitte manuell installieren: https://docs.astral.sh/uv");
    }

    console.log("  ✓ Alle Voraussetzungen erfüllt");

    // ── 2. Define installation paths ──────────────────────────────────────────
    console.log("\n==> Installationspfade festlegen...");
    console.log("  (Es öffnen sich Ordner-Dialoge. Einfach Abbrechen drücken für den Standardpfad)\n");

    // Allow the user to override the default installation paths.
    WEB_DIR = await askPath("Ordner für Web-GUI waehlen", WEB_DIR, INSTALL);
    CLI_DIR = await askPath("Ordner für Python Solver waehlen", CLI_DIR, WEB_DIR);
    CASES_DIR = path.join(CLI_DIR, "cases");

    fs.mkdirSync(WEB_DIR, {recursive: true});
    fs.mkdirSync(CLI_DIR, {recursive: true});

    // ── 3. Web-GUI klonen / updaten ───────────────────────────────────────────
    console.log("\n==> Web-GUI synchronisieren...");
    syncRepo(WEB_DIR, "https://github.com/Julian466/StaffSchedulingWeb.git");

    // ── 4. Solver klonen / updaten ────────────────────────────────────────────
    console.log("\n==> Solver synchronisieren...");
    let solverPath = CLI_DIR;

    const solverAlreadyValid =
        (fs.existsSync(path.join(CLI_DIR, "pyproject.toml")) ||
            fs.existsSync(path.join(CLI_DIR, "uv.lock"))) &&
        isRepo(CLI_DIR, "https://github.com/CombiRWTH/StaffScheduling.git");

    if (solverAlreadyValid) {
        // The solver is already installed, so only offer an update.
        console.log(`  ✓ Solver gefunden: ${CLI_DIR}`);
        const doUpdate = await ask("  Auf neueste Version aktualisieren? (j/n): ");
        if (doUpdate.trim().toLowerCase() === "j") {
            run("git checkout feature/add_api_interface", CLI_DIR);
            run("git pull origin feature/add_api_interface", CLI_DIR);
        }
    } else {
        console.log("  Solver wird installiert...");
        syncRepo(CLI_DIR, "https://github.com/CombiRWTH/StaffScheduling.git", "feature/add_api_interface");
    }

    rl.close();

    // ── 5. Dependencies installieren ─────────────────────────────────────────
    console.log("\n==> Installiere Web-Abhängigkeiten...");
    run("npm ci", WEB_DIR);

    console.log("\n==> Installiere Solver-Abhängigkeiten...");
    run("uv sync", solverPath);

    // ── 6. Build ──────────────────────────────────────────────────────────────
    console.log("\n==> Baue Web-Applikation... (das kann einige Minuten dauern)");
    run("npm run build", WEB_DIR);
    console.log("  ✓ Build erfolgreich");

    // ── 7. config.json ────────────────────────────────────────────────────────
    console.log("\n==> config.json...");
    const configPath = path.join(WEB_DIR, "config.json");

    let writeConfig = true;
    if (fs.existsSync(configPath)) {
        const rl2 = readline.createInterface({input: process.stdin, output: process.stdout});
        const ask2 = (q) => new Promise((resolve) => rl2.question(q, resolve));
        const overwrite = await ask2("  config.json existiert bereits. Überschreiben? (j/n): ");
        rl2.close();
        writeConfig = overwrite.trim().toLowerCase() === "j";
    }

    if (writeConfig) {
        const config = {
            casesDirectory: CASES_DIR,
            staffSchedulingProject: {
                include: true,
                path: solverPath,
                pythonExecutable: "uv",
            },
            solverApi: {
                url: "http://127.0.0.1:8000"
            },
        };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
        console.log("  ✓ config.json geschrieben:", configPath);
    } else {
        console.log("  config.json nicht verändert");
    }

    // ── 8. Zusammenfassung ────────────────────────────────────────────────────
    const webHash = execSync("git rev-parse --short HEAD", {cwd: WEB_DIR}).toString().trim();
    let solverHash = "n/a";
    if (fs.existsSync(path.join(solverPath, ".git"))) {
        try {
            solverHash = execSync("git rev-parse --short HEAD", {cwd: solverPath}).toString().trim();
        } catch { /* not a Git repository */
        }
    }

    // Write a compact version log for troubleshooting.
    const log = [
        `Installiert: ${new Date().toISOString()}`,
        `Web-GUI:     ${WEB_DIR} [${webHash}]`,
        `Solver:      ${solverPath} [${solverHash}]`,
        `Cases:       ${CASES_DIR}`,
        `Node:        ${execSync("node --version").toString().trim()}`,
        `uv:          ${execSync("uv --version").toString().trim()}`,
    ].join("\n");
    fs.writeFileSync(path.join(WEB_DIR, "version.log"), log, "utf8");

    console.log(`
╔══════════════════════════════════════════╗
║   Installation erfolgreich abgeschlossen  ║
╚══════════════════════════════════════════╝
Web-GUI:  ${WEB_DIR}  [${webHash}]
Solver:   ${solverPath}  [${solverHash}]
Cases:    ${CASES_DIR}

Support: ${path.join(WEB_DIR, "version.log")}
    `);
}

main().catch((err) => {
    console.error("\n[FEHLER] Installation fehlgeschlagen:", err.message);
    process.exit(1);
});
