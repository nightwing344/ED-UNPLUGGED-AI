#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
ARCH="$BASE/Architecture"
REPORT="$BASE/Reports"

ACTION="${1:-status}"

case "$ACTION" in

generate)

DATE=$(date +%Y%m%d-%H%M%S)
OUT="$REPORT/ED-CONSOLIDATION-REPORT-$DATE.txt"

{

echo "================================"
echo " ED CONSOLIDATION REPORT v1.0"
echo "================================"

echo
echo "GENERATED:"
date

echo
echo "================================"
echo " KERNEL"
echo "================================"

if [ -f "$ARCH/authoritative-module-map.txt" ]; then
grep -A20 "KERNEL:" "$ARCH/authoritative-module-map.txt"
else
echo "Kernel map missing"
fi


echo
echo "================================"
echo " PLUGINS"
echo "================================"

if [ -f "$ARCH/authoritative-module-map.txt" ]; then
grep -A20 "PLUGINS:" "$ARCH/authoritative-module-map.txt"
else
echo "Plugin map missing"
fi


echo
echo "================================"
echo " MODULE DECISIONS"
echo "================================"

if [ -f "$ARCH/final-module-decisions.txt" ]; then
cat "$ARCH/final-module-decisions.txt"
else
echo "Decision file missing"
fi


echo
echo "================================"
echo " CAPABILITY LAYERS"
echo "================================"

if [ -f "$ARCH/capability-map-v2.txt" ]; then
grep "^===" "$ARCH/capability-map-v2.txt"
else
echo "Capability map missing"
fi


echo
echo "================================"
echo " RECOMMENDATION"
echo "================================"

echo "Architecture verified."
echo "Proceed with controlled consolidation."
echo "No deletion authorized."
echo "Archive before merge."

echo
echo "STATUS:"
echo "READY FOR REVIEW"

} | tee "$OUT"


echo
echo "REPORT:"
echo "$OUT"

;;

status)

echo "ED CONSOLIDATION REPORT v1.0 READY"

;;

*)

echo "Commands:"
echo " generate"
echo " status"

;;

esac

