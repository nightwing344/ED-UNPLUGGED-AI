#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
ARCH="$BASE/Architecture"

ACTION="${1:-status}"


case "$ACTION" in

analyze)

REPORT="$ARCH/dependency-intelligence.txt"
IMPACT="$ARCH/impact-analysis.txt"
ISOLATED="$ARCH/isolated-modules.txt"

>"$REPORT"
>"$IMPACT"
>"$ISOLATED"


{
echo "================================"
echo " ED DEPENDENCY INTELLIGENCE v1.0"
echo "================================"
echo

for FILE in "$RUNTIME"/*.sh
do

[ -e "$FILE" ] || continue

NAME=$(basename "$FILE")

COUNT=$(grep -rhoE "ed-[a-zA-Z0-9_-]+\.sh" "$FILE" 2>/dev/null | sort -u | wc -l)

echo "$NAME | REFERENCES: $COUNT"

done

} >> "$REPORT"


{
echo "================================"
echo " ED MODULE IMPACT ANALYSIS"
echo "================================"
echo

for FILE in "$RUNTIME"/*.sh
do

[ -e "$FILE" ] || continue

NAME=$(basename "$FILE")

HITS=$(grep -ril "$NAME" "$RUNTIME" 2>/dev/null | wc -l)

echo "$NAME | REFERENCED BY: $HITS MODULES"

done

} >> "$IMPACT"


{
echo "================================"
echo " POSSIBLY ISOLATED MODULES"
echo "================================"
echo

while read -r LINE
do

COUNT=$(echo "$LINE" | awk -F':' '{print $2}' | tr -d ' ')

if [ "${COUNT:-0}" -eq 0 ]; then
echo "$LINE"
fi

done < <(grep "REFERENCED BY" "$IMPACT")


} >> "$ISOLATED"


echo
echo "✓ Dependency intelligence complete"
echo
echo "Reports:"
echo "$REPORT"
echo "$IMPACT"
echo "$ISOLATED"


;;


status)

echo "================================"
echo " ED DEPENDENCY INTELLIGENCE"
echo "================================"

if [ -f "$ARCH/dependency-intelligence.txt" ]; then
echo "Analysis: READY"
else
echo "Analysis: NOT RUN"
fi

;;


*)

echo "Commands:"
echo " analyze"
echo " status"

;;

esac

