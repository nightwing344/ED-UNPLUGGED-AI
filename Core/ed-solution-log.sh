#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED

read -p "Problem: " PROBLEM
read -p "Solution: " SOLUTION

FILE="$ED/Memory/Reasoning/Solutions/$(date +%Y%m%d-%H%M).md"

cat > "$FILE" <<EOF2
# Problem

$PROBLEM

# Solution

$SOLUTION

# Date

$(date)
EOF2

echo "Solution saved:"
echo "$FILE"
