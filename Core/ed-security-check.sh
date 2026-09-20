#!/data/data/com.termux/files/usr/bin/bash

echo "========================================"
echo " ED Security Check"
echo "========================================"

echo "[1] OpenClaw Config"

if [ -f "$HOME/.openclaw/openclaw.json" ]; then
    echo "OpenClaw config: FOUND"
else
    echo "OpenClaw config: MISSING"
fi

echo
echo "[2] Workspace"

if [ -d "/storage/emulated/0/ED" ]; then
    echo "ED workspace: FOUND"
else
    echo "ED workspace: MISSING"
fi

echo
echo "[3] Backup folders"

for DIR in Backups Snapshots
do
    if [ -d "/storage/emulated/0/ED/$DIR" ]; then
        echo "$DIR: OK"
    else
        echo "$DIR: MISSING"
    fi
done

echo
echo "========================================"
echo " Security Check Complete"
echo "========================================"
