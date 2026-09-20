#!/data/data/com.termux/files/usr/bin/bash

echo "========================================"
echo " ED Local Brain Check"
echo "========================================"

echo "[1] Checking Ollama..."

if command -v ollama >/dev/null 2>&1; then
    echo "Ollama: FOUND"
    ollama --version
else
    echo "Ollama: NOT FOUND"
fi

echo
echo "[2] Checking model folders..."

ls -la /storage/emulated/0/ED/Models

echo
echo "[3] Checking OpenClaw..."

if command -v openclaw >/dev/null 2>&1; then
    echo "OpenClaw: READY"
else
    echo "OpenClaw: MISSING"
fi

echo
echo "========================================"
echo " Local Brain Check Complete"
echo "========================================"
