#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

TYPE="${1:-}"
TEXT="${2:-}"

if [ -z "$TYPE" ] || [ -z "$TEXT" ]; then
  echo "Usage:"
  echo "ed-memory-write.sh <folder> <text>"
  exit 1
fi

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
MEMORY="${ED_MEMORY_ROOT:-/storage/emulated/0/ED/Memory}"

python "$ROOT/Runtime/ed-memory-propose.py" \
  --title "Legacy $TYPE memory proposal" \
  --content "$TEXT" \
  --category "$TYPE" \
  --tags "legacy-write,approval-required"
