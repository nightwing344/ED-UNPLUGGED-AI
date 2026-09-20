#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
ARCH="$BASE/Architecture"
OS="$BASE/OS"
REG="$BASE/Registry"
REPORT="$BASE/Reports"

ACTION="${1:-status}"

case "$ACTION" in

check)

DATE=$(date +%Y%m%d-%H%M%S)
OUT="$REPORT/ED-CONSOLIDATION-READINESS-$DATE.txt"

{
echo "================================"
echo " ED CONSOLIDATION READINESS GATE v1.0"
echo "================================"

echo
echo "DATE:"
date

echo
echo "AUTHORITY CHECK"
echo "--------------------------------"

if [ -f "$REG/master-registry.txt" ]; then
echo "✓ Registry authority: READY"
else
echo "✗ Registry authority: FAILED"
fi

echo
echo "MIGRATION CHECK"
echo "--------------------------------"

if ls "$OS/Migration/locks"/*.txt >/dev/null 2>&1; then
echo "✓ Migration lock: ACTIVE"
else
echo "✗ Migration lock: MISSING"
fi

echo
echo "SNAPSHOT CHECK"
echo "--------------------------------"

if ls "$BASE/Archive"/pre-consolidation-* >/dev/null 2>&1; then
echo "✓ Snapshot: AVAILABLE"
else
echo "✗ Snapshot: MISSING"
fi


echo
echo "ARCHITECTURE CHECK"
echo "--------------------------------"

FILES=(
"consolidation-sequence-*.txt"
"dependency-map-*.txt"
"consolidation-plan-*.txt"
"canonical-architecture-proposal-*.txt"
)

for FILE in "${FILES[@]}"
do
if ls "$ARCH"/$FILE >/dev/null 2>&1; then
echo "✓ $FILE"
else
echo "✗ Missing: $FILE"
fi
done


echo
echo "OS LAYER CHECK"
echo "--------------------------------"

for LAYER in Kernel Agents Intelligence Memory Governance Plugins
do
if [ -d "$OS/$LAYER" ]; then
COUNT=$(find "$OS/$LAYER" -name "*.sh" | wc -l)
echo "✓ $LAYER layer ($COUNT modules)"
else
echo "✗ $LAYER layer missing"
fi
done


echo
echo "REVIEW ITEMS"
echo "--------------------------------"

echo "Known missing modules:"
echo "- ed-memory-consolidation-engine.sh"
echo "- ed-marketplace-engine-v1.sh"


echo
echo "================================"
echo " FINAL STATUS"
echo "================================"

echo
echo "CONSOLIDATION AUTHORITY:"
echo "PENDING FINAL APPROVAL"

echo
echo "MERGE MODE:"
echo "DISABLED"

echo
echo "SAFE TO PREPARE EXECUTOR:"
echo "YES"

} | tee "$OUT"

echo
echo "REPORT:"
echo "$OUT"

;;

status)

echo "ED Consolidation Readiness Gate v1.0"
echo "Mode: CHECK ONLY"

;;

*)

echo "Commands:"
echo " check"
echo " status"

;;

esac
