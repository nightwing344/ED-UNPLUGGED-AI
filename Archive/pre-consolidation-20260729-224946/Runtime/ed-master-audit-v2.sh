#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
REPORT="$BASE/Reports"
ARCH="$BASE/Architecture"

ACTION="${1:-status}"

run()
{
echo
echo "================================"
echo "$1"
echo "================================"

shift

"$@" 2>&1 || echo "FAILED: $1"

}


case "$ACTION" in

run)

DATE=$(date +%Y%m%d-%H%M%S)
OUT="$REPORT/ED-MASTER-AUDIT-v2-$DATE.txt"

exec > >(tee "$OUT") 2>&1


echo "================================"
echo " ED MASTER AUDIT v2.0"
echo "================================"


run "KERNEL AUTHORITY ANALYSIS" \
"$RUNTIME/ed-kernel-authority-engine-v1.sh" analyze


run "MODULE DECISION ANALYSIS" \
"$RUNTIME/ed-module-decision-engine-v1.sh" analyze


run "CAPABILITY CLASSIFICATION" \
"$RUNTIME/ed-capability-classifier-v2.sh" analyze


run "GOVERNANCE STATUS" \
"$RUNTIME/ed-governance-security-authority-v1.sh" status


echo
echo "================================"
echo " ARCHITECTURE FILE CHECK"
echo "================================"


for FILE in \
authoritative-module-map.txt \
final-module-decisions.txt \
capability-map-v2.txt

do

if [ -f "$ARCH/$FILE" ]; then
echo "✓ $FILE"
else
echo "✗ Missing $FILE"
fi

done


echo
echo "================================"
echo " MASTER AUDIT COMPLETE"
echo "================================"

echo "REPORT:"
echo "$OUT"


;;

status)

echo "ED MASTER AUDIT v2.0 READY"

;;

*)

echo "Commands:"
echo " run"
echo " status"

;;

esac

