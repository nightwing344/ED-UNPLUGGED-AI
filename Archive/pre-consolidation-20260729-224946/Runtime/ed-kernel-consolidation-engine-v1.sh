#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
ARCH="$BASE/Architecture"
RUNTIME="$BASE/Runtime"

ACTION="${1:-status}"

case "$ACTION" in

analyze)

REPORT="$ARCH/consolidation-report.txt"
MERGE="$ARCH/merge-recommendations.txt"
PLUGINS="$ARCH/plugin-candidates.txt"
KERNEL="$ARCH/kernel-final-candidates.txt"

>"$REPORT"
>"$MERGE"
>"$PLUGINS"
>"$KERNEL"


{
echo "================================"
echo " ED KERNEL CONSOLIDATION v1.0"
echo "================================"
echo
echo "Generated: $(date)"
echo
echo "Runtime Modules:"
find "$RUNTIME" -name "*.sh" | wc -l
echo

} >> "$REPORT"


{
echo "================================"
echo " MERGE RECOMMENDATIONS"
echo "================================"
echo

echo "Version families detected:"
echo

find "$RUNTIME" -name "*.sh" | \
grep -E "v[0-9]+|backup|old|legacy" || \
echo "No obvious version duplicates detected"

echo
echo "Review required before merging."

} >> "$MERGE"


{
echo "================================"
echo " PLUGIN CANDIDATES"
echo "================================"
echo

grep -E \
"economic|digital|simulation|research|interface|connector" \
"$ARCH/module-classification.txt" 2>/dev/null || \
echo "Classification data unavailable"

} >> "$PLUGINS"


{
echo "================================"
echo " KERNEL FINAL CANDIDATES"
echo "================================"
echo

echo "ed-runtime"
echo "ed-executive-brain"
echo "ed-router"
echo "ed-agent-runtime"
echo "ed-memory"
echo "ed-knowledge"
echo "ed-learning"
echo "ed-security"
echo "ed-mission"

} >> "$KERNEL"


echo
echo "✓ Consolidation analysis complete"
echo
echo "Reports:"
echo "$REPORT"
echo "$MERGE"
echo "$PLUGINS"
echo "$KERNEL"

;;

status)

echo "================================"
echo " ED KERNEL CONSOLIDATION"
echo "================================"

if [ -f "$ARCH/consolidation-report.txt" ]; then
echo "Status: READY"
else
echo "Status: NOT RUN"
fi

;;

*)

echo "Commands:"
echo " analyze"
echo " status"

;;

esac

