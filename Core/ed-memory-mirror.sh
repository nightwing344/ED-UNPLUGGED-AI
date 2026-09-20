#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED
PRIMARY=$ED/Memory
MIRROR=$ED/Memory-Vault/Primary-Mirror

echo "========================================"
echo " ED Memory Mirror"
echo "========================================"

cp -r "$PRIMARY/"* "$MIRROR/" 2>/dev/null || true

echo "Memory mirror updated:"
date

echo "$(date) Mirror completed" >> "$ED/Memory-Vault/Integrity/mirror.log"

echo "========================================"
