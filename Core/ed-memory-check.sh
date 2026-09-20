#!/data/data/com.termux/files/usr/bin/bash

BASE=/storage/emulated/0/ED/Memory

echo "========================================"
echo " ED Memory Check"
echo "========================================"

for DIR in Long-Term Projects Lessons Decisions Temporary
do
    if [ -d "$BASE/$DIR" ]; then
        echo "$DIR: OK"
    else
        echo "$DIR: MISSING"
    fi
done

echo

if [ -f "$BASE/MEMORY_INDEX.md" ]; then
    echo "Memory index: OK"
else
    echo "Memory index: MISSING"
fi

echo
echo "========================================"
echo " Memory Check Complete"
echo "========================================"
