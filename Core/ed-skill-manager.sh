#!/data/data/com.termux/files/usr/bin/bash

BASE=/storage/emulated/0/ED/Skills

echo "========================================"
echo " ED Skill Manager"
echo "========================================"

echo "Installed Skills:"
ls -1 "$BASE/Installed" 2>/dev/null || echo "None"

echo
echo "Available Skills:"
ls -1 "$BASE/Available" 2>/dev/null || echo "None"

echo
echo "Registry:"
cat "$BASE/Registry/SKILL_REGISTRY.md"

echo
echo "========================================"
echo " Skill Manager Complete"
echo "========================================"
