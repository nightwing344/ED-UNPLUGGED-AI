#!/data/data/com.termux/files/usr/bin/bash

ED="/storage/emulated/0/ED"
MEM="$ED/Memory"

ACTION="${1:-}"

case "$ACTION" in

save)

TYPE="${2:-Sessions}"
NAME="${3:-memory-note}"

FILE="$MEM/$TYPE/$NAME.md"

mkdir -p "$(dirname "$FILE")"

echo "# ED Memory Entry" > "$FILE"
echo "" >> "$FILE"
echo "Created: $(date)" >> "$FILE"
echo "" >> "$FILE"

echo "[OK] Created $FILE"

;;

search)

TERM="${2:-}"

echo "Searching:"
echo "$TERM"

grep -Rni "$TERM" "$MEM" 2>/dev/null || echo "No matches."

;;

list)

find "$MEM" -type f

;;

*)

echo "ED Memory Commands"
echo
echo "Save:"
echo "ed-memory.sh save Projects name"
echo
echo "Search:"
echo "ed-memory.sh search keyword"
echo
echo "List:"
echo "ed-memory.sh list"

;;

esac
