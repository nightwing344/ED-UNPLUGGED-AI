#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

QUERY="${*:-}"

if [ -z "$QUERY" ]; then
    read -r -p "Memory query: " QUERY
fi

MEMORY="/storage/emulated/0/ED/Memory"
OUTPUT="/storage/emulated/0/ED/Memory/Context/Active/retrieved-memory.txt"
LOG="/storage/emulated/0/ED/Logs/Memory/retrieval.log"

mkdir -p "$(dirname "$LOG")"

echo "[$(date)] Retrieval: $QUERY" >> "$LOG"

echo
echo "================================"
echo " ED MEMORY RETRIEVAL"
echo "================================"

echo
echo "Query:"
echo "$QUERY"

echo
echo "Searching approved memory..."

{
echo "# ED Retrieved Memory Context"
echo
echo "Query:"
echo "$QUERY"
echo
echo "Matches:"
echo

FOUND=0

while IFS= read -r FILE; do
    if grep -qi "$QUERY" "$FILE" 2>/dev/null; then
        echo "---"
        echo "Source:"
        echo "$FILE"
        grep -i "$QUERY" "$FILE" 2>/dev/null | head -5
        FOUND=1
    fi
done < <(find "$MEMORY/Approved" "$MEMORY/Projects" "$MEMORY/Decisions" "$MEMORY/Lessons" -type f 2>/dev/null)

if [ "$FOUND" -eq 0 ]; then
    echo "No approved memory match found."
fi

echo
echo "Rules:"
echo "- Retrieval only"
echo "- No memory changes"
echo "- User authority maintained"

} > "$OUTPUT"

echo
echo "Retrieved context created:"
echo "$OUTPUT"

echo
echo "================================"
echo " RETRIEVAL COMPLETE"
echo "================================"

