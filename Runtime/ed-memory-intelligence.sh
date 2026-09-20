#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

MEMORY="${ED_MEMORY_ROOT:-/storage/emulated/0/ED/Memory}"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


index)

SOURCE="${*:-General Memory}"

ID="INDEX-$(date +%Y%m%d-%H%M%S)"

echo "$(date)|$ID|$SOURCE" \
>> "$MEMORY/Graph/index.log"

echo "✓ Memory indexed"
echo "$ID"

;;


connect)

FROM="$1"
TO="$2"
RELATION="$3"

echo "$(date)|$FROM|$RELATION|$TO" \
>> "$MEMORY/Graph/relationships.log"

echo "✓ Relationship created"

;;


search)

TERM="$*"

echo "================================"
echo " ED MEMORY RETRIEVAL"
echo "================================"

grep -Rin "$TERM" "$MEMORY" 2>/dev/null \
|| echo "No related memory found"

;;


learn)

LESSON="$*"

if [ -z "$LESSON" ]; then
    echo "Lesson content required"
    exit 1
fi

RUNTIME="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

ED_MEMORY_ROOT="$MEMORY" \
python "$RUNTIME/ed-memory-propose.py" \
  --title "ED lesson proposal" \
  --content "$LESSON" \
  --category "lesson" \
  --tags "lesson,approval-required"

echo "✓ Lesson proposal created"
echo "Approval required"

;;


status)

echo "================================"
echo " ED MEMORY INTELLIGENCE STATUS"
echo "================================"

echo
echo "✓ Memory Indexing"
echo "✓ Relationship Mapping"
echo "✓ Retrieval"
echo "✓ Pattern Storage"
echo "✓ Lesson Proposals"

echo
echo "Status: ACTIVE"

;;

*)

echo "Commands:"
echo "index <source>"
echo "connect <from> <to> <relation>"
echo "search <term>"
echo "learn <lesson>"
echo "status"

;;

esac

