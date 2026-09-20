#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REQUEST="${*:-}"

OUTPUT="/storage/emulated/0/ED/Memory/Context/Active/skill-routing-package.txt"

if [ -z "$REQUEST" ]; then
    read -r -p "Request: " REQUEST
fi

LOWER=$(echo "$REQUEST" | tr '[:upper:]' '[:lower:]')

echo
echo "================================"
echo " DIRECTOR SKILL ROUTING"
echo "================================"

echo
echo "Request:"
echo "$REQUEST"

echo
echo "Selected Skills:"
echo

{
echo "# ED Skill Routing Package"
echo
echo "Request:"
echo "$REQUEST"
echo
echo "Skills:"
} > "$OUTPUT"


if echo "$LOWER" | grep -Eq "legal|court|law|motion|custody|case|filing"; then
    echo "✓ Legal-ED"
    echo "- Legal-ED" >> "$OUTPUT"
fi

if echo "$LOWER" | grep -Eq "app|software|code|program|ai|database"; then
    echo "✓ Developer-ED"
    echo "- Developer-ED" >> "$OUTPUT"
fi

if echo "$LOWER" | grep -Eq "build|hardware|repair|machine|electrical"; then
    echo "✓ Builder-ED"
    echo "- Builder-ED" >> "$OUTPUT"
fi

if echo "$LOWER" | grep -Eq "research|analyze|study|investigate"; then
    echo "✓ Research-ED"
    echo "- Research-ED" >> "$OUTPUT"
fi

echo
echo "Skill Routing Package:"
echo "$OUTPUT"

echo
echo "================================"
echo " SKILL ROUTING COMPLETE"
echo "================================"

