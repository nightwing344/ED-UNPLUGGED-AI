#!/data/data/com.termux/files/usr/bin/bash

echo "========================================"
echo " ED Tool Registry Check"
echo "========================================"

REGISTRY=/storage/emulated/0/ED/Core/TOOL_REGISTRY.txt

if [ -f "$REGISTRY" ]; then
    echo "Registry: OK"
    echo
    cat "$REGISTRY"
else
    echo "Registry: MISSING"
fi

echo
echo "========================================"
echo " Tool Check Complete"
echo "========================================"
