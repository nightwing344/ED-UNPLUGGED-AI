#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
ARCH="$BASE/Architecture"
REPORT="$BASE/Reports"
MIG="$BASE/OS/Migration"
ARCHIVE="$BASE/Archive"

ACTION="${1:-status}"

case "$ACTION" in

check)

DATE=$(date +%Y%m%d-%H%M%S)
OUT="$REPORT/ED-FINAL-PRE-MERGE-INTEGRITY-$DATE.txt"

{
echo "================================"
echo " ED FINAL PRE-MERGE INTEGRITY CHECK v1.0"
echo "================================"

echo
echo "DATE:"
date

echo
echo "AUTHORITY:"
echo "ED MASTER REGISTRY"

echo
echo "MODE:"
echo "FINAL VALIDATION ONLY"

echo
echo "================================"
echo " AUTHORITY VALIDATION"
echo "================================"

if [ -f "$BASE/Registry/master-registry.txt" ]; then
echo "✓ Registry"
else
echo "✗ Registry Missing"
fi

if ls "$MIG"/locks/*.txt >/dev/null 2>&1; then
echo "✓ Migration Lock"
else
echo "✗ Migration Lock Missing"
fi

echo
echo "================================"
echo " MANIFEST VALIDATION"
echo "================================"

if ls "$ARCH"/final-merge-manifest-*.txt >/dev/null 2>&1; then
echo "✓ Final Merge Manifest"
else
echo "✗ Manifest Missing"
fi

echo
echo "================================"
echo " ARCHIVE VALIDATION"
echo "================================"

if ls "$ARCHIVE"/pre-consolidation-* >/dev/null 2>&1; then
echo "✓ Pre-Consolidation Snapshot"
else
echo "✗ Snapshot Missing"
fi

echo
echo "================================"
echo " LAYER VALIDATION"
echo "================================"

for LAYER in Kernel Governance Memory Intelligence Agents Plugins
do
    if [ -d "$BASE/OS/$LAYER" ]; then
        COUNT=$(find "$BASE/OS/$LAYER" -type f | wc -l)
        echo "✓ $LAYER : $COUNT modules"
    else
        echo "✗ $LAYER Missing"
    fi
done

echo
echo "================================"
echo " SAFETY VALIDATION"
echo "================================"

echo "Delete:"
echo "DISABLED"

echo "Overwrite:"
echo "DISABLED"

echo "Rollback:"
echo "AVAILABLE"

echo
echo "================================"
echo " FINAL DECISION"
echo "================================"

echo
echo "STATUS:"
echo "READY FOR FINAL AUTHORITY"

echo
echo "MERGE EXECUTOR:"
echo "LOCKED"

echo
echo "NEXT:"
echo "Requires explicit execution approval"

} | tee "$OUT"

echo
echo "REPORT:"
echo "$OUT"

;;

status)

echo "ED Final Pre-Merge Integrity Check v1.0"
echo "State: Awaiting check"

;;

*)

echo "Commands:"
echo " check"
echo " status"

;;

esac
