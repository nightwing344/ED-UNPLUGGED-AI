#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

LEARN="$HOME/ED-Core/Learning/Lessons"

ACTION="${1:-status}"
shift || true

case "$ACTION" in

extract)

SOURCE="$*"

FILE="$LEARN/lesson-$(date +%Y%m%d-%H%M%S).txt"

PROMPT="
You are ED Learning Engine.

Convert this experience into a reusable lesson.

Experience:
$SOURCE

Return:

LESSON:
SKILL:
IMPROVEMENT:
"

RESULT=$(ollama run llama3.2:3b "$PROMPT" 2>/dev/null || true)

echo "$RESULT" > "$FILE"

echo "✓ Lesson created"
echo "$FILE"

;;

search)

grep -ril "${1:-}" "$LEARN" 2>/dev/null || echo "No lessons found"

;;

status)

COUNT=$(find "$LEARN" -type f 2>/dev/null | wc -l)

echo "================================"
echo " ED LEARNING PIPELINE v1.0"
echo "================================"
echo
echo "Lessons: $COUNT"
echo "Status: ONLINE"

;;

*)

echo "Commands:"
echo " extract <experience>"
echo " search <term>"
echo " status"

;;

esac
