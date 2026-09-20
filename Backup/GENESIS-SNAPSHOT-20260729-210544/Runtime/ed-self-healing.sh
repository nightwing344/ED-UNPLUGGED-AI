#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

HEALTH="$HOME/ED-Core/Health"
RUNTIME="$HOME/ED-Core/Runtime"

ACTION="${1:-status}"
shift || true


case "$ACTION" in


scan)

echo "================================"
echo " ED SELF-HEALING SCAN"
echo "================================"

REPORT="$HEALTH/health-$(date +%Y%m%d-%H%M%S).log"

echo "Scan started: $(date)" > "$REPORT"

FAILED=0

for FILE in "$RUNTIME"/ed-*.sh
do

    if [ -x "$FILE" ]; then

        bash -n "$FILE" 2>/dev/null

        if [ $? -eq 0 ]; then
            echo "OK $(basename "$FILE")" >> "$REPORT"
        else
            echo "FAILED $(basename "$FILE")" >> "$REPORT"
            FAILED=$((FAILED+1))
        fi

    fi

done


echo >> "$REPORT"
echo "Failures=$FAILED" >> "$REPORT"


cat "$REPORT"

;;


check)

MODULE="$1"

FILE="$RUNTIME/$MODULE"

echo "================================"
echo " MODULE CHECK"
echo "================================"

if [ -f "$FILE" ]; then

    echo "✓ Exists"

    if bash -n "$FILE"; then
        echo "✓ Syntax OK"
    else
        echo "✗ Syntax Error"
    fi

else

    echo "✗ Missing"

fi

;;


repair)

MODULE="$1"

echo "================================"
echo " ED REPAIR ENGINE"
echo "================================"

if [ -f "$RUNTIME/$MODULE" ]; then

cp "$RUNTIME/$MODULE" \
"$HEALTH/$MODULE.backup.$(date +%s)"

echo "✓ Backup checkpoint created"
echo "✓ Repair point ready"

else

echo "Module not found"

fi

;;


history)

ls "$HEALTH" 2>/dev/null || echo "No records"

;;


status)

COUNT=$(find "$HEALTH" -name "health-*" 2>/dev/null | wc -l)

echo "================================"
echo " ED SELF-HEALING v1.0"
echo "================================"
echo
echo "Health Reports: $COUNT"
echo "Status: ONLINE"

;;


*)

echo "Commands:"
echo " scan"
echo " check <module>"
echo " repair <module>"
echo " history"
echo " status"

;;

esac

