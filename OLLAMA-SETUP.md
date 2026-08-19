# Ollama Lab Deployment — Thumb Drive Install

For 20 lab Macs (Apple Silicon, 16GB RAM), 8 local accounts each. No network
pull on any lab machine — everything comes off the drive. Model: **qwen2.5-coder:7b**
(fits comfortably in 16GB unified memory, leaves headroom for pygame/VS Code
running alongside it; the larger MoE options need more RAM than these machines have).

## 1. Prepare the thumb drive (on your Mac, with internet)

```bash
# Install Ollama if you haven't already: https://ollama.com/download

# Pull the model once
ollama pull qwen2.5-coder:7b

# Quit Ollama fully (menu bar icon → Quit) before copying —
# don't copy while a blob might still be writing
```

Copy these three things to the thumb drive, all in the same folder:

- `/Applications/Ollama.app` → drive
- `~/.ollama/models` (the whole folder — `blobs/` and `manifests/` together,
  never just one) → drive, renamed/placed as `models/` alongside `Ollama.app`
- `tools/install-ollama.sh` (in this repo) → drive, same folder

## 2. Install on each lab Mac (offline, no network needed)

One command per machine, run as admin from the drive:

```bash
cd /Volumes/<drive name>
sudo ./install-ollama.sh
```

The script installs `Ollama.app` to `/Applications`, copies the model data to
`/Users/Shared/ollama-models` (per DECISIONS #23 — one copy per machine, not
one per account), then symlinks each of the 8 local accounts'
`~/.ollama/models` to that shared copy and fixes ownership. It also strips
the app's quarantine flag, since it never touched the network on this
machine to earn Gatekeeper's trust otherwise. Safe to re-run. No need to log
into each of the 8 accounts by hand.

## 3. Verify

In each account, launch Ollama once, then in Terminal:

```bash
ollama list
```

Should show `qwen2.5-coder:7b` immediately — no download. Then:

```bash
ollama run qwen2.5-coder:7b "print hello world in python"
```

confirms it actually runs.

## Notes

- Model weights are read-only at inference time, so all 8 accounts sharing
  one copy via symlink is safe — no write conflicts.
- If a machine has less free disk than expected, `qwen2.5-coder:7b` is
  roughly 4.7GB on disk (Q4 quantization, Ollama's default pull).
- This whole process avoids the network/content-filter risk of pulling a
  multi-gigabyte model on the school network — see DECISIONS #23. The
  difference from #23's original plan is *how* the bits get onto each
  machine (thumb drive vs. whatever was assumed before); the shared-folder/
  symlink architecture for the 8 accounts is unchanged.
