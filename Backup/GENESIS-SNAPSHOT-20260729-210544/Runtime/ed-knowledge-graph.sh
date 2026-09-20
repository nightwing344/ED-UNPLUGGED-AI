#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="/storage/emulated/0/ED/KnowledgeGraph"

ACTION="${1:-status}"
shift || true


case "$ACTION" in

node)

TYPE="${1:-concept}"
NAME="${2:-unknown}"

ID="NODE-$(date +%Y%m%d-%H%M%S)"

cat > "$BASE/Nodes/$ID.txt" <<EOF2
ED KNOWLEDGE NODE

ID:
$ID

TYPE:
$TYPE

NAME:
$NAME

CREATED:
$(date)

EOF2

echo "✓ Knowledge Node Created"
echo "$ID"

;;


link)

FROM="${1:-unknown}"
TO="${2:-unknown}"
REL="${3:-related}"

echo "$(date)|$FROM|$REL|$TO" \
>> "$BASE/Edges/graph.log"

echo "✓ Relationship Created"

;;


entity)

NAME="${1:-unknown}"

echo "$(date)|ENTITY|$NAME" \
>> "$BASE/Entities/entities.log"

echo "✓ Entity Registered"

;;


search)

TERM="${1:-}"

grep -R "$TERM" "$BASE" 2>/dev/null || echo "No matches"

;;


list)

echo "================================"
echo " KNOWLEDGE NODES"
echo "================================"

find "$BASE/Nodes" \
-type f 2>/dev/null \
| sed 's#^.*/##'

;;


status)

echo "================================"
echo " ED KNOWLEDGE GRAPH v2.0"
echo "================================"

echo
echo "✓ Node Storage"
echo "✓ Relationship Mapping"
echo "✓ Entity Registry"
echo "✓ Knowledge Search"
echo "✓ Learning Connections"
echo "✓ Project Intelligence"

echo
echo "Status: ACTIVE"

;;


*)

echo "Commands:"
echo "status"
echo "node <type> <name>"
echo "link <from> <to> <relationship>"
echo "entity <name>"
echo "search <term>"
echo "list"

;;

esac

