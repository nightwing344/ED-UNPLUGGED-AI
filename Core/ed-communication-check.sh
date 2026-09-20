#!/data/data/com.termux/files/usr/bin/bash

echo "========================================"
echo " ED Communication Check"
echo "========================================"

echo "[1] OpenClaw Channels"

if command -v openclaw >/dev/null 2>&1; then
    openclaw channels status 2>/dev/null || echo "No channels configured"
else
    echo "OpenClaw missing"
fi

echo
echo "[2] Registry"

if [ -f /storage/emulated/0/ED/Core/COMMUNICATION_REGISTRY.txt ]; then
    echo "Communication registry: OK"
else
    echo "Communication registry: MISSING"
fi

echo
echo "========================================"
echo " Communication Check Complete"
echo "========================================"
