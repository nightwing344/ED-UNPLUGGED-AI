#!/data/data/com.termux/files/usr/bin/bash

BASE=/storage/emulated/0/ED/Core

echo "========================================"
echo " ED Governance Check"
echo "========================================"

for FILE in \
ED-CONSTITUTION.md \
GOVERNANCE.md \
ED-AUDIT.log \
CHANGE_CONTROL.md

do
    if [ -f "$BASE/$FILE" ]; then
        echo "$FILE: OK"
    else
        echo "$FILE: MISSING"
    fi
done

echo
echo "Backup folders:"

if [ -d "/storage/emulated/0/ED/Backups" ]; then
    echo "Backups: OK"
else
    echo "Backups: MISSING"
fi

if [ -d "/storage/emulated/0/ED/Snapshots" ]; then
    echo "Snapshots: OK"
else
    echo "Snapshots: MISSING"
fi

echo
echo "========================================"
echo " Governance Check Complete"
echo "========================================"
