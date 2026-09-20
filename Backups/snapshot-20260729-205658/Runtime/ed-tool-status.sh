#!/data/data/com.termux/files/usr/bin/bash

echo "================================"
echo " ED TOOL STATUS"
echo "================================"

echo

for CMD in bash ollama node python; do

if command -v "$CMD" >/dev/null 2>&1; then
    echo "✓ $CMD : $(command -v $CMD)"
else
    echo "⚠ $CMD : NOT FOUND"
fi

done

