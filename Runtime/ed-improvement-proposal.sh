#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REQUEST="${*:-}"

if [ -z "$REQUEST" ]; then
  echo "Improvement proposal required"
  exit 1
fi

RUNTIME="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
MEMORY="${ED_MEMORY_ROOT:-/storage/emulated/0/ED/Memory}"

ED_MEMORY_ROOT="$MEMORY" \
python "$RUNTIME/ed-memory-propose.py" \
  --title "ED improvement proposal" \
  --content "$REQUEST" \
  --category "decision" \
  --tags "improvement,approval-required"

echo "✓ Improvement proposal waiting for user approval"
