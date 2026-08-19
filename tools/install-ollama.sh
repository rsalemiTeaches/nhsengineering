#!/bin/bash
# install-ollama.sh
#
# Full offline lab install, run from the USB drive as admin. Installs
# Ollama.app, copies the model data to a shared folder, and symlinks the
# 8 local per-period accounts to it — one command per lab Mac, no network
# needed. See OLLAMA-SETUP.md and DECISIONS #23 (nhsengineering).
#
# Expects Ollama.app and a models/ folder sitting next to this script on
# the drive (i.e. copied there per OLLAMA-SETUP.md step 1).
#
# Usage:
#   cd /Volumes/<drive name>
#   sudo ./install-ollama.sh   (or wherever you put it on the drive)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SHARED_MODELS="/Users/Shared/ollama-models"

# The 8 local per-period accounts on each lab Mac.
ACCOUNTS=(blue01 blue02 blue03 blue04 red01 red02 red03 red04)

if [[ $EUID -ne 0 ]]; then
  echo "Run this with sudo: sudo $0"
  exit 1
fi

# --- 1. Install Ollama.app ---
if [[ ! -d "$SCRIPT_DIR/Ollama.app" ]]; then
  echo "Error: Ollama.app not found next to this script ($SCRIPT_DIR)."
  echo "Put Ollama.app and the models/ folder alongside this script on the drive."
  exit 1
fi

echo "Installing Ollama.app..."
rm -rf /Applications/Ollama.app
cp -R "$SCRIPT_DIR/Ollama.app" /Applications/
# The app carried a quarantine flag from being downloaded on the machine that
# built the drive; strip it so Gatekeeper doesn't block it on lab Macs that
# never touched the network to get it.
xattr -dr com.apple.quarantine /Applications/Ollama.app 2>/dev/null || true

# --- 2. Copy the model data ---
if [[ ! -d "$SCRIPT_DIR/models" ]]; then
  echo "Error: models/ folder not found next to this script ($SCRIPT_DIR)."
  exit 1
fi

echo "Copying model data to $SHARED_MODELS..."
mkdir -p "$SHARED_MODELS"
cp -R "$SCRIPT_DIR/models/"* "$SHARED_MODELS/"
chmod -R a+rX "$SHARED_MODELS"

# --- 3. Wire up the 8 local accounts ---
for user in "${ACCOUNTS[@]}"; do
  home=$(dscl . -read "/Users/$user" NFSHomeDirectory 2>/dev/null | awk '{print $2}')

  if [[ -z "$home" || ! -d "$home" ]]; then
    echo "Skipping $user — account not found on this machine"
    continue
  fi

  echo "Wiring up $user ($home)..."

  mkdir -p "$home/.ollama"

  # A fresh Ollama launch sometimes creates a real (empty) models folder —
  # remove it, or any stale symlink, before relinking.
  if [[ -L "$home/.ollama/models" ]]; then
    rm -f "$home/.ollama/models"
  elif [[ -d "$home/.ollama/models" ]]; then
    rm -rf "$home/.ollama/models"
  fi

  ln -s "$SHARED_MODELS" "$home/.ollama/models"
  chown -R "$user":staff "$home/.ollama"

  echo "  done."
done

ln -sf /Applications/Ollama.app/Contents/Resources/ollama /usr/local/bin/ollama


echo ""
echo "Install complete. Verify per account by logging in and running: ollama list"
