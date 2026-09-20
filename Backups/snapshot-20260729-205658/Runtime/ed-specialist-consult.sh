#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REQUEST="${*:-}"

if [ -z "$REQUEST" ]; then
    read -r -p "Request: " REQUEST
fi

OUTPUT="/storage/emulated/0/ED/Memory/Context/Active/specialist-consultation.txt"

echo
echo "================================"
echo " SPECIALIST CONSULTATION"
echo "================================"

echo
echo "Request:"
echo "$REQUEST"

LOWER=$(echo "$REQUEST" | tr '[:upper:]' '[:lower:]')

{
echo "# ED Specialist Consultation Package"
echo
echo "Request:"
echo "$REQUEST"
echo
echo "Consulted Specialists:"
echo

if echo "$LOWER" | grep -Eq "legal|court|law|motion|custody|case|filing"; then
echo "- Legal-ED"
echo "  Role: Legal framework and organization"
echo
fi

if echo "$LOWER" | grep -Eq "app|software|code|program|ai|database"; then
echo "- Developer-ED"
echo "  Role: Software architecture and implementation"
echo
fi

if echo "$LOWER" | grep -Eq "build|hardware|repair|machine|electrical"; then
echo "- Builder-ED"
echo "  Role: Practical systems implementation"
echo
fi

if echo "$LOWER" | grep -Eq "research|analyze|study|investigate"; then
echo "- Research-ED"
echo "  Role: Information gathering and verification"
echo
fi

echo "Rules:"
echo "- Specialists provide recommendations only."
echo "- ED remains coordinator."
echo "- User retains final authority."

} > "$OUTPUT"

echo
echo "Consultation Package Created:"
echo "$OUTPUT"

echo
echo "================================"
echo " CONSULTATION COMPLETE"
echo "================================"

