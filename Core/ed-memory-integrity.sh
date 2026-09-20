#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED

echo "========================================"
echo " ED Memory Integrity Check"
echo "========================================"

echo "Primary memory:"
find "$ED/Memory" -type f | wc -l

echo "Mirror memory:"
find "$ED/Memory-Vault/Primary-Mirror" -type f | wc -l

echo

if [ "$(find "$ED/Memory" -type f | wc -l)" = "$(find "$ED/Memory-Vault/Primary-Mirror" -type f | wc -l)" ]; then
    echo "Memory Status: MATCH"
else
    echo "Memory Status: DIFFERENT"
fi

echo "========================================"
