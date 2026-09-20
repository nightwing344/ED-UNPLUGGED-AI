#!/data/data/com.termux/files/usr/bin/bash

echo "========================================"
echo " ED Recovery Check"
echo "========================================"

BASE=/storage/emulated/0/ED

for ITEM in Core Memory Skills Projects Backups Snapshots
do
    if [ -d "$BASE/$ITEM" ]; then
        echo "$ITEM: OK"
    else
        echo "$ITEM: MISSING"
    fi
done

echo
echo "Recovery check complete"
