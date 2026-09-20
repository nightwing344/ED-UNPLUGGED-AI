#!/data/data/com.termux/files/usr/bin/bash

BASE=/storage/emulated/0/ED/Projects

echo "========================================"
echo " ED Project Manager"
echo "========================================"

echo
echo "Active Projects:"
ls -1 "$BASE/Active" 2>/dev/null || echo "None"

echo
echo "Completed Projects:"
ls -1 "$BASE/Completed" 2>/dev/null || echo "None"

echo
echo "Registry:"
cat "$BASE/PROJECT_REGISTRY.md"

echo
echo "========================================"
echo " Project Manager Complete"
echo "========================================"
