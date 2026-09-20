#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

MEMORY="$HOME/ED-Core/Memory"

ACTION="${1:-status}"
shift || true


case "$ACTION" in

store)

TYPE="${1:-fact}"
shift

CONTENT="$*"

ID="memory-$(date +%Y%m%d-%H%M%S)"

FILE="$MEMORY/$ID.mem"


cat > "$FILE" <<EOF2
ID=$ID
TYPE=$TYPE
IMPORTANCE=1
CREATED=$(date)

CONTENT:
$CONTENT
EOF2


echo "✓ Memory stored"
echo "$FILE"

;;


classify)

TEXT="$*"

echo "================================"
echo " ED MEMORY CLASSIFIER"
echo "================================"

LOWER=$(echo "$TEXT" | tr '[:upper:]' '[:lower:]')


if echo "$LOWER" | grep -Eq "learn|lesson|discovered|improve"; then
    echo "TYPE=lesson"

elif echo "$LOWER" | grep -Eq "project|build|create"; then
    echo "TYPE=project"

elif echo "$LOWER" | grep -Eq "remember|important|always"; then
    echo "TYPE=long-term"

else
    echo "TYPE=fact"

fi

;;


search)

TERM="$1"

echo "================================"
echo " ED MEMORY SEARCH"
echo "================================"

grep -ril "$TERM" "$MEMORY" 2>/dev/null || echo "No memories found"

;;


show)

ID="$1"

cat "$MEMORY/$ID.mem" 2>/dev/null || echo "Memory not found"

;;


backup)

DEST="$HOME/ED-Core/Backups/memory-$(date +%Y%m%d-%H%M%S)"

mkdir -p "$DEST"

cp -r "$MEMORY"/* "$DEST/" 2>/dev/null || true

echo "✓ Memory backup created"
echo "$DEST"

;;


status)

COUNT=$(find "$MEMORY" -name "*.mem" 2>/dev/null | wc -l)

echo "================================"
echo " ED MEMORY INTELLIGENCE v3.0"
echo "================================"
echo
echo "Memories: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " store <type> <content>"
echo " classify <text>"
echo " search <term>"
echo " show <id>"
echo " backup"
echo " status"

;;

esac

