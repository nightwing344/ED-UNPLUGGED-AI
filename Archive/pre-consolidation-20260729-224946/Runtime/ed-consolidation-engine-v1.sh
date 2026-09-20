#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
ARCH="$BASE/Architecture"

ACTION="${1:-status}"


case "$ACTION" in


analyze)

PLAN="$ARCH/consolidation-plan.txt"
CORE="$ARCH/core-map.txt"
DUP="$ARCH/duplicate-analysis.txt"


echo "Generating consolidation analysis..."


{
echo "================================"
echo " ED CORE MODULE MAP"
echo "================================"
echo

for FILE in "$RUNTIME"/*.sh
do

[ -e "$FILE" ] || continue

NAME=$(basename "$FILE")


case "$NAME" in

ed-executive-brain*)
echo "$NAME | CORE | Executive Layer"
;;

ed-runtime*)
echo "$NAME | CORE | Runtime Layer"
;;

ed-router*|ed-adaptive-router*)
echo "$NAME | CORE | Routing Layer"
;;

ed-agent*)
echo "$NAME | CORE | Agent Layer"
;;

ed-memory*)
echo "$NAME | CORE | Memory Layer"
;;

ed-knowledge*)
echo "$NAME | CORE | Knowledge Layer"
;;

ed-learning*)
echo "$NAME | CORE | Learning Layer"
;;

ed-security*)
echo "$NAME | CORE | Security Layer"
;;

ed-mission*)
echo "$NAME | ACTIVE | Mission Layer"
;;

*)
echo "$NAME | REVIEW | Needs Classification"
;;

esac


done

} > "$CORE"



{
echo "================================"
echo " ED CONSOLIDATION PLAN"
echo "================================"
echo

echo "Phase 1:"
echo "Preserve core systems"

echo
echo "Phase 2:"
echo "Merge duplicate versions"

echo
echo "Phase 3:"
echo "Retire obsolete modules"

echo
echo "Phase 4:"
echo "Create ED Kernel"

echo
echo "Recommended Core Layers:"
echo

echo "1. Executive Brain"
echo "2. Runtime"
echo "3. Router"
echo "4. Agents"
echo "5. Memory"
echo "6. Knowledge"
echo "7. Learning"
echo "8. Security"
echo "9. Mission"

} > "$PLAN"



{
echo "================================"
echo " DUPLICATE VERSION REVIEW"
echo "================================"
echo

find "$RUNTIME" -name "*.sh" \
| sed 's/.*\///' \
| sed 's/-v[0-9].*//' \
| sort \
| uniq -c \
| awk '$1>1 {print "Possible duplicate family:",$0}'

} > "$DUP"



echo
echo "✓ Consolidation analysis complete"
echo
echo "Core Map:"
echo "$CORE"

echo
echo "Plan:"
echo "$PLAN"

echo
echo "Duplicates:"
echo "$DUP"


;;


status)

echo "================================"
echo " ED CONSOLIDATION ENGINE v1.0"
echo "================================"

echo

if [ -f "$ARCH/consolidation-plan.txt" ]; then
echo "Analysis: COMPLETE"
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

