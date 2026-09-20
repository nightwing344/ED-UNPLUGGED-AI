#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

GRAPH="$HOME/ED-Core/KnowledgeGraph"

ACTION="${1:-status}"
shift || true

case "$ACTION" in

add)

NODE="$1"
TYPE="${2:-concept}"

FILE="$GRAPH/$NODE.node"

cat > "$FILE" <<EOF2
NODE=$NODE
TYPE=$TYPE
CREATED=$(date)
EOF2

echo "✓ Knowledge node created"
;;

connect)

FROM="$1"
TO="$2"
RELATION="${3:-related}"

FILE="$GRAPH/relationships.graph"

echo "$FROM --> $TO [$RELATION]" >> "$FILE"

echo "✓ Relationship created"
;;

search)

TERM="${1:-}"

grep -ril "$TERM" "$GRAPH" 2>/dev/null || echo "No matches"

;;

show)

NODE="$1"

echo "================================"
echo " KNOWLEDGE NODE"
echo "================================"

cat "$GRAPH/$NODE.node" 2>/dev/null || echo "Node not found"

echo
echo "Connections:"
grep "$NODE" "$GRAPH/relationships.graph" 2>/dev/null || echo "None"

;;

status)

NODES=$(find "$GRAPH" -name "*.node" 2>/dev/null | wc -l)
LINKS=$(wc -l < "$GRAPH/relationships.graph" 2>/dev/null || echo 0)

echo "================================"
echo " ED KNOWLEDGE GRAPH v2.0"
echo "================================"
echo
echo "Nodes: $NODES"
echo "Relationships: $LINKS"
echo "Status: ONLINE"

;;

*)

echo "Commands:"
echo " add <node> <type>"
echo " connect <from> <to> <relation>"
echo " search <term>"
echo " show <node>"
echo " status"

;;

esac
