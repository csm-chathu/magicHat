# cPanel Deployment via SSH

This project ships with a helper script that connects to a cPanel host over SSH and refreshes the git working copy that serves the site. The script is located at `scripts/deploy-cpanel.mjs` and is exposed through the npm script `deploy:cpanel`.

## Prerequisites

1. **SSH access** to the cPanel account. Enable SSH in cPanel and note the hostname (often matches the server name or `your-domain.com`).
2. **Deployment key** with read access to the Git repository. Upload the public key to cPanel (`~/.ssh/authorized_keys`) and add the matching private key locally.
3. **Remote git repository** cloned (or clonable) inside the directory that serves your site. The script will create the directory if it does not exist.
4. **Node.js 18+** locally so the deployment helper can run.

## Required environment variables

Set the following variables in your shell before running `pnpm deploy:cpanel` (or `npm run deploy:cpanel` depending on your package manager):

- `CPANEL_HOST` – SSH host name or IP.
- `CPANEL_USER` – SSH username.
- `CPANEL_REMOTE_PATH` – Absolute path on the server where the repo should live (for example `/home/username/public_html`).

Optional overrides:

- `CPANEL_PORT` – SSH port (defaults to `22`).
- `CPANEL_KEY_PATH` – Absolute path to the private key if it is not already loaded in your SSH agent.
- `CPANEL_BRANCH` – Branch to deploy. Defaults to the current local branch (`git rev-parse --abbrev-ref HEAD`) or `main` if this cannot be detected.
- `CPANEL_REPO` – Repository URL that the server should clone/pull from. Defaults to the local `origin` remote.
- `CPANEL_PRE_COMMANDS` – Commands to run on the server after resetting the repo but before install/build (for example `cp config/.env.production .env`).
- `CPANEL_INSTALL_COMMAND` – Install command to run remotely (for example `pnpm install --frozen-lockfile`).
- `CPANEL_BUILD_COMMAND` – Build command to run remotely (for example `pnpm build`).
- `CPANEL_POST_COMMANDS` – Commands to run on the server after everything else (for example `php artisan migrate`).
- `CPANEL_SSH_OPTIONS` – Extra options to append to the `ssh` command (for example `-o StrictHostKeyChecking=no`).

You can place these values in a shell script or use a `.envrc`/`.env.deploy` file that you manually source before deploying.

## Running a deployment

```bash
# Example using PowerShell
$env:CPANEL_HOST = "server.example.com"
$env:CPANEL_USER = "username"
$env:CPANEL_REMOTE_PATH = "/home/username/public_html"
$env:CPANEL_KEY_PATH = "C:\\Users\\me\\.ssh\\cpanel"
$env:CPANEL_BRANCH = "develop"
$env:CPANEL_INSTALL_COMMAND = "pnpm install --frozen-lockfile"
$env:CPANEL_BUILD_COMMAND = "pnpm build"

pnpm deploy:cpanel
```

Add `--dry-run` to preview the generated remote script without executing it:

```bash
pnpm deploy:cpanel -- --dry-run
```

The deploy script will:

1. Connect to the given host over SSH.
2. Ensure the target directory exists.
3. Clone the repository if it does not exist, or fetch/reset the requested branch.
4. Run any optional pre/install/build/post commands you defined.

If any step fails, the script exits with the SSH exit code so your terminal tooling can detect the failure.

## Automating with GitHub Actions

The repository includes `.github/workflows/deploy-cpanel.yml`, which runs the same helper script from a GitHub Actions runner. Configure the following repository secrets (Settings > Secrets and variables > Actions):

- `CPANEL_HOST`, `CPANEL_USER`, `CPANEL_REMOTE_PATH`
- `CPANEL_SSH_KEY` (the private key text, optional if you rely on another auth mechanism)
- Optional overrides that mirror the environment variables listed earlier (`CPANEL_PORT`, `CPANEL_REPO`, `CPANEL_PRE_COMMANDS`, `CPANEL_INSTALL_COMMAND`, `CPANEL_BUILD_COMMAND`, `CPANEL_POST_COMMANDS`, `CPANEL_SSH_OPTIONS`)

The workflow triggers on pushes to `develop` and can be started manually with **Run workflow**. Manual runs accept an optional `branch` input that overrides the branch resolved from the workflow context. The job writes the SSH key to `~/.ssh/cpanel_key`, primes `known_hosts` with `ssh-keyscan`, then executes `node scripts/deploy-cpanel.mjs` so the remote behavior matches a local deployment.

## First-time setup tips

- On the server, make sure `git` is available (`which git`). If not, enable it through cPanel or install via the hosting provider.
- When cloning from GitHub, add the cPanel server’s public key as a deploy key in the GitHub repository (or use a machine user with the appropriate access).
- If the target directory already contains your site, back it up before letting the script manage it the first time.
- Consider whitelisting your local IP/keys in cPanel’s firewall to avoid connection drops during deployment.
