#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED
MEM=$ED/Memory

echo "========================================"
echo " ED Semantic Memory Scan"
echo "========================================"

echo
echo "Memory Files:"
find "$MEM" -type f | wc -l

echo
echo "Topics:"
find "$MEM/Semantic/Topics" -type f 2>/dev/null | wc -l

echo
echo "Tags:"
find "$MEM/Semantic/Tags" -type f 2>/dev/null | wc -l

echo
echo "Links:"
find "$MEM/Semantic/Links" -type f 2>/dev/null | wc -l

echo
echo "========================================"
echo " Semantic Scan Complete"
echo "========================================"
