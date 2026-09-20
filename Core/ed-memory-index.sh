#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED
MEM=$ED/Memory

echo "========================================"
echo " ED Memory Index Builder"
echo "========================================"

find "$MEM" -type f \
-name "*.txt" \
-o -name "*.md" \
> "$MEM/Retrieval/Index/memory-index.txt"

COUNT=$(wc -l < "$MEM/Retrieval/Index/memory-index.txt")

echo "Indexed files: $COUNT"

echo "$(date) Indexed $COUNT files" >> \
"$MEM/Retrieval/Logs/index.log"

echo "========================================"
echo " Index Complete"
echo "========================================"
