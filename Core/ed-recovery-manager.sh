#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED

echo "========================================"
echo " ED Recovery Manager"
echo "========================================"

echo
echo "[1] Checking Snapshots"

LATEST_SNAPSHOT=$(ls -t "$ED"/Snapshots/*.tar.gz 2>/dev/null | head -1)

if [ -n "$LATEST_SNAPSHOT" ]; then
    echo "Latest Snapshot:"
    echo "$LATEST_SNAPSHOT"
else
    echo "No snapshots found"
fi

echo
echo "[2] Checking Backups"

LATEST_BACKUP=$(ls -t "$ED"/Backups/* 2>/dev/null | head -1)

if [ -n "$LATEST_BACKUP" ]; then
    echo "Latest Backup:"
    echo "$LATEST_BACKUP"
else
    echo "No backups found"
fi

echo
echo "[3] Checking Build Library"

if [ -d "$HOME/ED-Build/Scripts" ]; then
    echo "Build Library: OK"
    COUNT=$(ls "$HOME/ED-Build/Scripts" | wc -l)
    echo "Scripts Available: $COUNT"
else
    echo "Build Library: Missing"
fi

echo
echo "[4] Recovery Log"

LOG="$ED/Core/RECOVERY_LOG.txt"

if [ ! -f "$LOG" ]; then
    touch "$LOG"
fi

echo "$(date) Recovery check completed" >> "$LOG"

echo
echo "========================================"
echo " Recovery Check Complete"
echo "========================================"
