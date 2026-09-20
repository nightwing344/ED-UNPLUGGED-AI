#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
ARCH="$BASE/Architecture"
RUNTIME="$BASE/Runtime"

ACTION="${1:-status}"

case "$ACTION" in

analyze)

PLAN="$ARCH/kernel-merge-plan.txt"
CORE="$ARCH/core-preservation-list.txt"
MERGE="$ARCH/merge-candidates.txt"
RETIRE="$ARCH/retirement-review.txt"

>"$PLAN"
>"$CORE"
>"$MERGE"
>"$RETIRE"


echo "================================" >> "$PLAN"
echo " ED KERNEL MERGE PLAN v1.0" >> "$PLAN"
echo "================================" >> "$PLAN"
echo >> "$PLAN"


{
echo "CORE PRESERVATION"
echo "================="
echo "ed-runtime"
echo "ed-executive-brain"
echo "ed-router"
echo "ed-agent-runtime"
echo "ed-memory"
echo "ed-knowledge"
echo "ed-learning"
echo "ed-security"
echo "ed-mission"
} >> "$CORE"


{
echo "MERGE CANDIDATES"
echo "================"

grep -E \
"v1|v2|v3|backup|old|legacy" \
"$ARCH/module-classification.txt" 2>/dev/null || \
echo "Run classification first"

} >> "$MERGE"


{
echo "RETIREMENT REVIEW"
echo "================="

echo "Modules requiring manual review:"
echo

grep -E \
"legacy|old|backup|test" \
"$ARCH/module-classification.txt" 2>/dev/null || \
echo "No obvious retirement candidates"

} >> "$RETIRE"


{
echo "CONSOLIDATION PHASES"
echo

echo "Phase 1:"
echo "Freeze kernel candidates"

echo

echo "Phase 2:"
echo "Merge duplicate services"

echo

echo "Phase 3:"
echo "Move optional systems to extensions"

echo

echo "Phase 4:"
echo "Create ED Kernel v1.0"

} >> "$PLAN"


echo
echo "✓ Kernel merge analysis complete"
echo
echo "Generated:"
echo "$PLAN"
echo "$CORE"
echo "$MERGE"
echo "$RETIRE"

;;

status)

echo "================================"
echo " ED KERNEL MERGE PLANNER"
echo "================================"

if [ -f "$ARCH/kernel-merge-plan.txt" ]; then
echo "Plan: READY"
else
echo "Plan: NOT GENERATED"
fi

;;

*)

echo "Commands:"
echo " analyze"
echo " status"

;;

esac

