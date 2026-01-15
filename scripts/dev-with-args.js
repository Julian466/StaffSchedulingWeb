#!/usr/bin/env node

/**
 * Script to parse command line arguments and start Next.js dev server
 * with environment variables set from CLI arguments
 * 
 * Usage:
 * npm run dev -- --WORKFLOW_MODE=true --WORKFLOW_CASE=77 --WORKFLOW_START=01.11.2024 --WORKFLOW_END=30.11.2024
 */

const { spawn } = require('child_process');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const env = { ...process.env };

// Parse --KEY=VALUE arguments
args.forEach(arg => {
  if (arg.startsWith('--')) {
    const match = arg.match(/^--([^=]+)=(.+)$/);
    if (match) {
      const [, key, value] = match;
      env[key] = value;
      console.log(`Setting ${key}=${value}`);
    }
  }
});

// Print workflow info if in workflow mode
if (env.WORKFLOW_MODE === 'true') {
  console.log('========================================');
  console.log('Dienstplan-Workflow wird gestartet');
  console.log('========================================');
  console.log(`Planungseinheit: ${env.WORKFLOW_CASE || 'nicht gesetzt'}`);
  console.log(`Von: ${env.WORKFLOW_START || 'nicht gesetzt'}`);
  console.log(`Bis: ${env.WORKFLOW_END || 'nicht gesetzt'}`);
  console.log('========================================');
  console.log('');
}

// Start Next.js dev server
const isWindows = process.platform === 'win32';
const nextCommand = isWindows ? 'next.cmd' : 'next';

console.log('Server wird gestartet...');
console.log('');

const nextProcess = spawn(nextCommand, ['dev'], {
  env,
  stdio: 'inherit',
  shell: isWindows
});

nextProcess.on('close', (code) => {
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
});
