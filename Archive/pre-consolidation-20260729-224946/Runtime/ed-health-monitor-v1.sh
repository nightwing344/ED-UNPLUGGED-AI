#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

BASE="$HOME/ED-Core"
RUNTIME="$BASE/Runtime"
REPORTS="$BASE/Reports"
REGISTRY="$BASE/Registry"

ACTION="${1:-status}"


run_check() {

TOTAL=0
PASS=0
FAIL=0

REPORT="$REPORTS/ED-HEALTH-$(date +%Y%m%d-%H%M%S).txt"


{
echo "================================"
echo " ED HEALTH MONITOR v1.0"
echo "================================"
echo
echo "Time:"
date
echo

for FILE in "$RUNTIME"/*.sh
do

[ -e "$FILE" ] || continue

TOTAL=$((TOTAL+1))

NAME=$(basename "$FILE")

echo "Checking: $NAME"

if [ -x "$FILE" ]; then

if bash -n "$FILE" 2>/dev/null; then

echo " ✓ HEALTHY"
PASS=$((PASS+1))

else

echo " ✗ SYNTAX ERROR"
FAIL=$((FAIL+1))

fi

else

echo " ⚠ PERMISSION ISSUE"
FAIL=$((FAIL+1))

fi


done


echo
echo "================================"
echo " HEALTH SUMMARY"
echo "================================"

echo "Modules Checked: $TOTAL"
echo "Healthy: $PASS"
echo "Failed: $FAIL"


if [ "$FAIL" -eq 0 ]; then

echo "System Status: GREEN"

elif [ "$FAIL" -lt 5 ]; then

echo "System Status: YELLOW"

else

echo "System Status: RED"

fi


} | tee "$REPORT"


echo
echo "Report:"
echo "$REPORT"

}


case "$ACTION" in

scan)
run_check
;;

status)

echo "================================"
echo " ED HEALTH MONITOR v1.0"
echo "================================"

echo

if [ -d "$RUNTIME" ]; then
echo "Runtime: ONLINE"
else
echo "Runtime: MISSING"
fi

;;

*)

echo "Commands:"
echo " scan"
echo " status"

;;

esac

