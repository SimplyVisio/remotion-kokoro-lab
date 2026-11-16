#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

say() {
  printf '\n==> %s\n' "$1"
}

confirm() {
  local answer
  read -r -p "$1 [y/N] " answer
  [[ "$answer" =~ ^[Yy]$ ]]
}

say "Remotion + Kokoro + Whisper setup"
printf 'Project: %s\n' "$ROOT"

if [[ -r /etc/os-release ]]; then
  # shellcheck disable=SC1091
  . /etc/os-release
fi

DISTRO_ID="${ID:-unknown}"
DISTRO_VERSION="${VERSION_ID:-unknown}"
printf 'Detected: %s %s\n' "$DISTRO_ID" "$DISTRO_VERSION"

if command -v apt-get >/dev/null 2>&1; then
  if [[ "$DISTRO_ID" == "ubuntu" && "$DISTRO_VERSION" == "24.04" ]]; then
    CHROME_DEPS=(
      libnss3
      libdbus-1-3
      libatk1.0-0t64
      libasound2t64
      libxrandr2
      libxkbcommon-dev
      libxfixes3
      libxcomposite1
      libxdamage1
      libgbm-dev
      libcups2t64
      libcairo2
      libpango-1.0-0
      libatk-bridge2.0-0t64
    )
  else
    CHROME_DEPS=(
      libnss3
      libdbus-1-3
      libatk1.0-0
      libasound2
      libxrandr2
      libxkbcommon-dev
      libxfixes3
      libxcomposite1
      libxdamage1
      libgbm-dev
      libcups2
      libcairo2
      libpango-1.0-0
      libatk-bridge2.0-0
    )
  fi

  say "System packages"
  printf 'The following command will be proposed, not run automatically:\n\n'
  printf '  sudo apt-get update\n'
  printf '  sudo apt-get install -y ffmpeg build-essential cmake espeak-ng python3 python3-venv %s\n\n' "${CHROME_DEPS[*]}"
  if confirm "Install these system packages now?"; then
    sudo apt-get update
    sudo apt-get install -y \
      ffmpeg \
      build-essential \
      cmake \
      espeak-ng \
      python3 \
      python3-venv \
      "${CHROME_DEPS[@]}"
  else
    printf 'Skipped. Install them manually before rendering or building Whisper.\n'
  fi
else
  say "System packages"
  printf 'Automatic apt setup is only available on Debian/Ubuntu.\n'
  printf 'On macOS, install ffmpeg, cmake and espeak-ng with Homebrew:\n\n'
  printf '  brew install ffmpeg cmake espeak-ng\n\n'
fi

say "Node.js"
if ! command -v node >/dev/null 2>&1; then
  printf 'Node.js is not installed. Install nvm, then Node LTS:\n\n'
  printf '  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash\n'
  printf '  export NVM_DIR="$HOME/.nvm"\n'
  printf '  . "$NVM_DIR/nvm.sh"\n'
  printf '  nvm install --lts\n\n'
  printf 'Open a new shell and run this script again.\n'
  exit 1
fi

node -e '
const [major, minor] = process.versions.node.split(".").map(Number);
if (!((major === 20 && minor >= 19) || (major === 22 && minor >= 13) || major >= 24)) {
  console.error(`Unsupported Node.js ${process.versions.node}. Use ^20.19, ^22.13 or >=24.`);
  process.exit(1);
}
'
printf 'Node.js %s\n' "$(node --version)"

say "Python"
PYTHON_BIN="${PYTHON_BIN:-python3}"
if ! command -v "$PYTHON_BIN" >/dev/null 2>&1; then
  printf 'Python 3 is required. Install Python 3.10-3.12 and run this script again.\n'
  exit 1
fi

"$PYTHON_BIN" - <<'PY'
import sys
if not ((3, 10) <= sys.version_info[:2] <= (3, 12)):
    raise SystemExit(f"Python {sys.version.split()[0]} is not supported. Use 3.10-3.12.")
print(f"Python {sys.version.split()[0]}")
PY

if [[ ! -d .venv-tts ]]; then
  say "Creating .venv-tts"
  "$PYTHON_BIN" -m venv .venv-tts
fi

say "Installing Python dependencies"
# shellcheck disable=SC1091
. .venv-tts/bin/activate
python -m pip install --upgrade pip wheel
python -m pip install -r requirements.txt

say "Installing npm dependencies"
npm ci

say "Downloading Chrome Headless Shell for Remotion"
npx remotion browser ensure

say "Setup complete"
printf 'Next steps:\n\n'
printf '  npm run dev          # open Remotion Studio\n'
printf '  npm run build:audio  # generate narration and captions\n'
printf '  npm run render       # write out/langgraph.mp4\n\n'
printf 'The first audio build downloads the Kokoro and Whisper models and can take several minutes.\n'
