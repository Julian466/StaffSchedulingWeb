import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import http from 'http';

function loadConfig() {
    const root = process.cwd();
    const configPath = join(root, 'config.json');
    const templatePath = join(root, 'config.template.json');
    const pathToUse = existsSync(configPath) ? configPath : templatePath;

    const raw = readFileSync(pathToUse, 'utf-8');
    return JSON.parse(raw);
}

function checkApiRunning() {
    return new Promise((resolve) => {
        const req = http.get('http://127.0.0.1:8000/status', (res) => {
            resolve(res.statusCode === 200);
        });

        req.on('error', () => resolve(false));
        req.setTimeout(1500, () => {
            req.destroy();
            resolve(false);
        });
    });
}

function run() {
    const mode = process.argv[2] === 'start' ? 'start' : 'dev';
    const config = loadConfig();

    const solverMode = config.solverMode ?? 'cli';
    const pythonConfig = config.staffSchedulingProject ?? {};
    const pythonExecutable = pythonConfig.pythonExecutable || 'uv';
    const pythonProjectPath = pythonConfig.path;

    const nextProcess = spawn('next', [mode], {
        stdio: 'inherit',
        shell: process.platform === 'win32',
        env: process.env,
    });

    let apiProcess = null;
    let shuttingDown = false;

    const shutdown = (signal) => {
        if (shuttingDown) return;
        shuttingDown = true;

        if (apiProcess && !apiProcess.killed) {
            apiProcess.kill('SIGTERM');
        }

        if (!nextProcess.killed) {
            nextProcess.kill(signal || 'SIGTERM');
        }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    nextProcess.on('exit', (code) => {
        if (apiProcess && !apiProcess.killed) {
            apiProcess.kill('SIGTERM');
        }
        process.exit(code ?? 0);
    });

    if (solverMode !== 'api') {
        return;
    }

    checkApiRunning().then((alreadyRunning) => {
        if (alreadyRunning) {
            console.log('[solver] API server already running on http://127.0.0.1:8000');
            return;
        }

        if (!pythonProjectPath || pythonProjectPath === '-') {
            console.warn('[solver] solverMode="api" but staffSchedulingProject.path is not configured.');
            return;
        }

        console.log('[solver] Starting API server:', `${pythonExecutable} run staff-scheduling-api`);

        apiProcess = spawn(
            pythonExecutable,
            ['run', 'staff-scheduling-api'],
            {
                cwd: pythonProjectPath,
                stdio: 'inherit',
                shell: process.platform === 'win32',
                env: {
                    ...process.env,
                    PYTHONUNBUFFERED: '1',
                },
            }
        );

        apiProcess.on('exit', (code) => {
            if (!shuttingDown) {
                console.warn(`[solver] API server exited with code ${code ?? 'unknown'}`);
            }
        });
    });
}

run();
