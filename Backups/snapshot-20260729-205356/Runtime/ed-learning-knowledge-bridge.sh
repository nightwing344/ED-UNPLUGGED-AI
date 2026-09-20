#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

LESSONS="$HOME/ED-Core/Learning/Lessons"
GRAPH="$HOME/ED-Core/KnowledgeGraph"

ACTION="${1:-status}"
shift || true

case "$ACTION" in

sync)

LATEST=$(ls -t "$LESSONS"/*.txt 2>/dev/null | head -1 || true)

if [ -z "$LATEST" ]; then
    echo "No lessons found."
    exit 0
fi

echo "Processing lesson:"
echo "$LATEST"
echo

NAME=$(basename "$LATEST" .txt)

NODE="Lesson-$NAME"

cat > "$GRAPH/$NODE.node" <<EOF2
NODE=$NODE
TYPE=lesson
SOURCE=$LATEST
CREATED=$(date)
EOF2

echo "LearningEngine --> $NODE [created]" >> "$GRAPH/relationships.graph"

echo "✓ Lesson connected to Knowledge Graph"

;;

list)

echo "================================"
echo " ED LEARNING GRAPH CONNECTIONS"
echo "================================"

grep "LearningEngine" "$GRAPH/relationships.graph" 2>/dev/null || echo "No connections"

;;

status)

COUNT=$(grep -c "LearningEngine" "$GRAPH/relationships.graph" 2>/dev/null || echo 0)

echo "================================"
echo " ED LEARNING KNOWLEDGE BRIDGE"
echo "================================"
echo
echo "Connected Lessons: $COUNT"
echo "Status: ONLINE"

;;

*)

echo "Commands:"
echo " sync"
echo " list"
echo " status"

;;

esac

