#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

LESSON_TEXT="${*:-}"

if [ -z "$LESSON_TEXT" ]; then
  echo "Lesson text required"
  exit 1
fi

RUNTIME="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
MEMORY="${ED_MEMORY_ROOT:-/storage/emulated/0/ED/Memory}"

ED_MEMORY_ROOT="$MEMORY" \
python "$RUNTIME/ed-memory-propose.py" \
  --title "ED lesson proposal" \
  --content "$LESSON_TEXT" \
  --category "lesson" \
  --tags "lesson,user-interaction,approval-required"

echo "✓ Lesson waiting for user approval"
