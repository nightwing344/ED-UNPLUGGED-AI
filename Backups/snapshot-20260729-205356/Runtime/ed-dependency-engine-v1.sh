#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
REGISTRY="$BASE/Registry"
GRAPH="$BASE/Architecture"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


build)

INPUT="$REGISTRY/module-registry.db"
OUTPUT="$GRAPH/dependency-graph.db"

if [ ! -f "$INPUT" ]; then
    echo "Module registry missing"
    exit 1
fi


echo "MODULE|DEPENDS_ON|RELATION" > "$OUTPUT"


while IFS='|' read -r MODULE CATEGORY HASH STATUS CREATED
do

[ "$MODULE" = "MODULE" ] && continue


for OTHER in \
memory \
knowledge \
learning \
agent \
mission \
security \
economic \
governance \
skill \
router

do

if echo "$MODULE" | grep -qi "$OTHER"; then

echo "$MODULE|$OTHER|category-link" >> "$OUTPUT"

fi

done


done < "$INPUT"


echo "✓ Dependency graph created"
echo "$OUTPUT"

;;


show)

cat "$GRAPH/dependency-graph.db" 2>/dev/null || echo "Graph empty"

;;


find)

TARGET="$1"

echo "================================"
echo " DEPENDENCY IMPACT CHECK"
echo "================================"

echo
echo "Modules connected to:"
echo "$TARGET"

grep -i "$TARGET" "$GRAPH/dependency-graph.db" 2>/dev/null || echo "No connections"

;;


category)

TARGET="$1"

grep "|$TARGET|" "$GRAPH/dependency-graph.db" 2>/dev/null || echo "No category links"

;;


status)

LINES=$(wc -l < "$GRAPH/dependency-graph.db" 2>/dev/null || echo 0)

echo "================================"
echo " ED DEPENDENCY ENGINE v1.0"
echo "================================"

echo
echo "Relationships: $((LINES-1))"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " build"
echo " show"
echo " find <module>"
echo " category <name>"
echo " status"

;;

esac

