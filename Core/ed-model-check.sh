#!/data/data/com.termux/files/usr/bin/bash

echo "========================================"
echo " ED Model Check"
echo "========================================"

echo

if command -v ollama >/dev/null 2>&1; then
    echo "Ollama: INSTALLED"
    ollama list
else
    echo "Ollama: NOT INSTALLED"
fi

echo

if command -v openclaw >/dev/null 2>&1; then
    echo "OpenClaw:"
    openclaw --version
else
    echo "OpenClaw: NOT INSTALLED"
fi

echo

echo "Node:"
node -v 2>/dev/null || echo "Missing"

echo
echo "========================================"
echo " Model Check Complete"
echo "========================================"
