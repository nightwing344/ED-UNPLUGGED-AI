#!/data/data/com.termux/files/usr/bin/bash

REG="/storage/emulated/0/ED/Registry/ed-system-registry.txt"

echo "================================"
echo " ED REGISTRY STATUS"
echo "================================"

if [ -f "$REG" ]; then
    echo
    echo "✓ Master Registry Online"
    echo
    cat "$REG"
else
    echo "⚠ Registry Missing"
fi

