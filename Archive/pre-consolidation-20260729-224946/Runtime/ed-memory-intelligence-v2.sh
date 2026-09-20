#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

MEMORY="$HOME/ED-Core/Memory"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


store)

TITLE="$1"
CATEGORY="${2:-general}"
IMPORTANCE="${3:-1}"

ID="memory-$(date +%Y%m%d-%H%M%S)"

FILE="$MEMORY/$ID.mem"

cat > "$FILE" <<EOF2
ID=$ID
TITLE=$TITLE
CATEGORY=$CATEGORY
IMPORTANCE=$IMPORTANCE
CREATED=$(date)

EOF2

echo "✓ Memory stored"
echo "$FILE"

;;


append)

ID="$1"
shift

FILE="$MEMORY/$ID.mem"

if [ -f "$FILE" ]; then

echo "$*" >> "$FILE"

echo "✓ Memory updated"

else

echo "Memory not found"

fi

;;


search)

TERM="$*"

echo "================================"
echo " ED MEMORY RECALL"
echo "================================"

grep -ril "$TERM" "$MEMORY" 2>/dev/null || echo "No memories found"

;;


show)

cat "$MEMORY/$1.mem" 2>/dev/null || echo "Memory not found"

;;


rank)

echo "================================"
echo " MEMORY IMPORTANCE RANKING"
echo "================================"

for FILE in "$MEMORY"/*.mem
do

[ -e "$FILE" ] || continue

IMPORTANCE=$(grep IMPORTANCE "$FILE" | cut -d= -f2)

echo "$IMPORTANCE - $FILE"

done | sort -nr


;;


link)

FROM="$1"
TO="$2"
RELATION="${3:-related}"

echo "$FROM --> $TO [$RELATION]" >> "$MEMORY/memory-links.graph"

echo "✓ Memory relationship created"

;;


status)

COUNT=$(find "$MEMORY" -name "*.mem" 2>/dev/null | wc -l)

LINKS=$(wc -l < "$MEMORY/memory-links.graph" 2>/dev/null || echo 0)

echo "================================"
echo " ED MEMORY INTELLIGENCE v2.0"
echo "================================"

echo
echo "Memories: $COUNT"
echo "Links: $LINKS"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " store <title> <category> <importance>"
echo " append <id> <text>"
echo " search <term>"
echo " show <id>"
echo " rank"
echo " link <from> <to> <relation>"
echo " status"

;;

esac

