#!/bin/bash
# stage-model.sh
#
# Copy ONE Ollama model — its manifest and only the blobs that manifest
# names — into a destination models/ folder for the lab drive.
#
#   ./stage-model.sh qwen2.5-coder:7b /Volumes/Lexar/models
#
# Why this exists: `cp -R ~/.ollama/models` copies every model you have ever
# pulled. On 2026-08-19 that made a lab drive carry 22.7GB when the class
# needs 4.7GB, and every one of 20 machines paid for the difference. See
# DECISIONS #43 (nhsengineering).
#
# Blobs are content-addressed and shared between models, so the only safe way
# to pick one model's worth is to read its manifest and take the digests it
# names. Deleting blobs by eye leaves a model that Ollama lists but cannot
# run.
#
# Reads only. Never touches ~/.ollama.

set -euo pipefail

MODEL="${1:-}"
DEST="${2:-}"
SRC="${OLLAMA_MODELS:-$HOME/.ollama/models}"

if [[ -z "$MODEL" || -z "$DEST" ]]; then
  cat >&2 <<EOF
usage: $(basename "$0") <model:tag> <destination models folder>

  $(basename "$0") qwen2.5-coder:7b /Volumes/Lexar/models

Set OLLAMA_MODELS if your models live somewhere other than
~/.ollama/models.
EOF
  exit 1
fi

# A model reference is name:tag, and the name may carry a namespace. Ollama
# stores official models under library/, which is what a bare name means.
name="${MODEL%%:*}"
tag="${MODEL#*:}"
[[ "$tag" == "$MODEL" ]] && tag=latest
[[ "$name" == */* ]] || name="library/$name"

manifest="$SRC/manifests/registry.ollama.ai/$name/$tag"

if [[ ! -f "$manifest" ]]; then
  echo "No manifest for $MODEL at:" >&2
  echo "  $manifest" >&2
  echo "" >&2
  echo "Models found here:" >&2
  find "$SRC/manifests" -type f 2>/dev/null \
    | sed "s|$SRC/manifests/registry.ollama.ai/||; s|library/||; s|/|:|" \
    | sort | sed 's/^/  /' >&2
  exit 1
fi

# Every digest the manifest names: the config blob and each layer. Pulled with
# grep rather than jq, which is not on a stock macOS.
digests=$(grep -o '"sha256:[0-9a-f]\{64\}"' "$manifest" | tr -d '"' | sort -u)

if [[ -z "$digests" ]]; then
  echo "Manifest at $manifest names no blobs. Refusing to stage nothing." >&2
  exit 1
fi

echo "Staging $MODEL"
echo "  from $SRC"
echo "  to   $DEST"
echo ""

mkdir -p "$DEST/blobs" "$DEST/manifests/registry.ollama.ai/$name"
cp "$manifest" "$DEST/manifests/registry.ollama.ai/$name/$tag"

total=0
count=0
missing=0
while IFS= read -r d; do
  blob="$SRC/blobs/${d/:/-}"          # sha256:abc -> sha256-abc
  if [[ ! -f "$blob" ]]; then
    echo "  MISSING $d" >&2
    missing=$((missing + 1))
    continue
  fi
  size=$(stat -f%z "$blob" 2>/dev/null || stat -c%s "$blob")
  # Announce before copying, then confirm after. The big blob takes minutes
  # and a line that appears only on completion looks like a hang; a line that
  # appears only on start looks like a hang too, once it stops advancing.
  printf '  %-9s %s ... ' "$(( size / 1048576 ))MB" "${d:0:19}"
  cp "$blob" "$DEST/blobs/"
  printf 'done\n'
  total=$((total + size))
  count=$((count + 1))
done <<< "$digests"

if [[ $missing -ne 0 ]]; then
  echo "" >&2
  echo "$missing blob(s) named by the manifest are not on disk." >&2
  echo "Re-pull the model before staging it:  ollama pull $MODEL" >&2
  exit 1
fi

echo ""
echo "Staged $count blobs, $(( total / 1048576 ))MB total."
echo ""
echo "If $DEST already held another model, its blobs are still there."
echo "To be sure the drive carries only this one, empty the folder first"
echo "and re-run:"
echo "  rm -rf \"$DEST\" && $(basename "$0") $MODEL \"$DEST\""
