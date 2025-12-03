import { spawn } from 'node:child_process';
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import process from 'node:process';

const { env, argv } = process;

const required = (name) => {
  const value = env[name];
  if (!value || !value.trim()) {
    console.error(`[deploy] Missing required environment variable: ${name}`);
    process.exit(1);
  }

  return value.trim();
};

const getGitConfig = (key) => {
  try {
    return execSync(`git config --get ${key}`, { encoding: 'utf8' }).trim();
  } catch (error) {
    return '';
  }
};

const ensureSshAvailable = () => {
  try {
    execSync('ssh -V', { stdio: 'pipe' });
  } catch (error) {
    console.error('[deploy] ssh command is not available in PATH.');
    process.exit(1);
  }
};

const getCurrentBranch = () => {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'main';
  }
};

const json = (value) => JSON.stringify(value ?? '');

const host = required('CPANEL_HOST');
const user = required('CPANEL_USER');
const remotePath = required('CPANEL_REMOTE_PATH');
const port = (env.CPANEL_PORT || '22').trim();
const branch = (env.CPANEL_BRANCH || getCurrentBranch() || 'main').trim();
const repoUrl = (env.CPANEL_REPO || getGitConfig('remote.origin.url')).trim();

if (!repoUrl) {
  console.error('[deploy] Unable to determine repository URL. Set CPANEL_REPO or configure git remote origin.');
  process.exit(1);
}

const keyPath = env.CPANEL_KEY_PATH ? env.CPANEL_KEY_PATH.trim() : '';
if (keyPath && !existsSync(keyPath)) {
  console.error(`[deploy] Private key not found at path: ${keyPath}`);
  process.exit(1);
}

const preCommands = (env.CPANEL_PRE_COMMANDS || '').trim();
const installCommand = (env.CPANEL_INSTALL_COMMAND || '').trim();
const buildCommand = (env.CPANEL_BUILD_COMMAND || '').trim();
const postCommands = (env.CPANEL_POST_COMMANDS || '').trim();

const remoteScript = [
  '#!/bin/bash',
  'set -euo pipefail',
  `REMOTE_DIR=${json(remotePath)}`,
  `REPO_URL=${json(repoUrl)}`,
  `BRANCH=${json(branch)}`,
  `PRE_COMMANDS=${json(preCommands)}`,
  `INSTALL_COMMAND=${json(installCommand)}`,
  `BUILD_COMMAND=${json(buildCommand)}`,
  `POST_COMMANDS=${json(postCommands)}`,
  'echo "[deploy] Using branch: ${BRANCH}"',
  'echo "[deploy] Target directory: ${REMOTE_DIR}"',
  'mkdir -p "$REMOTE_DIR"',
  'cd "$REMOTE_DIR"',
  'if [ ! -d .git ]; then',
  '  echo "[deploy] Cloning repository for the first time"',
  '  git clone --branch "$BRANCH" --single-branch "$REPO_URL" .',
  'else',
  '  echo "[deploy] Updating existing repository"',
  '  git remote set-url origin "$REPO_URL"',
  '  git fetch origin "$BRANCH"',
  '  git reset --hard "origin/$BRANCH"',
  'fi',
  'if [ -n "$PRE_COMMANDS" ]; then',
  '  echo "[deploy] Running pre-deploy commands"',
  '  eval "$PRE_COMMANDS"',
  'fi',
  'if [ -n "$INSTALL_COMMAND" ]; then',
  '  echo "[deploy] Running install command"',
  '  eval "$INSTALL_COMMAND"',
  'fi',
  'if [ -n "$BUILD_COMMAND" ]; then',
  '  echo "[deploy] Running build command"',
  '  eval "$BUILD_COMMAND"',
  'fi',
  'if [ -n "$POST_COMMANDS" ]; then',
  '  echo "[deploy] Running post-deploy commands"',
  '  eval "$POST_COMMANDS"',
  'fi',
  'echo "[deploy] Deployment completed"'
].join('\n');

const isDryRun = argv.includes('--dry-run');

if (isDryRun) {
  console.log('--- remote script preview ---');
  console.log(remoteScript);
  process.exit(0);
}

ensureSshAvailable();

const sshArgs = [];

if (keyPath) {
  sshArgs.push('-i', keyPath);
}

if (port) {
  sshArgs.push('-p', port);
}

const extraOptions = (env.CPANEL_SSH_OPTIONS || '').trim();
if (extraOptions) {
  sshArgs.push(...extraOptions.split(/\s+/).filter(Boolean));
}

sshArgs.push(`${user}@${host}`, 'bash', '-se');

console.log(`[deploy] Connecting to ${user}@${host}:${port}`);

const run = async () => {
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn('ssh', sshArgs, { stdio: ['pipe', 'inherit', 'inherit'] });

    child.on('error', (error) => {
      reject(error);
    });

    child.stdin.write(`${remoteScript}\n`);
    child.stdin.end();

    child.on('close', resolve);
  }).catch((error) => {
    console.error(`[deploy] Failed to start ssh session: ${error.message}`);
    process.exit(1);
  });

  if (exitCode !== 0) {
    console.error(`[deploy] Remote deployment failed with exit code ${exitCode}`);
    process.exit(exitCode || 1);
  }

  console.log('[deploy] Remote deployment finished successfully');
};

await run();
