#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED
LOG=$ED/Logs/memory-loop.log

echo "========================================"
echo " ED Memory Monitor"
echo "========================================"

echo

if ps -ef | grep ed-memory-loop.sh | grep -v grep >/dev/null; then
    echo "Memory Loop: RUNNING"
else
    echo "Memory Loop: STOPPED"
fi

echo

echo "Last Memory Activity:"
if [ -f "$LOG" ]; then
    tail -10 "$LOG"
else
    echo "No memory log found"
fi

echo
echo "========================================"
