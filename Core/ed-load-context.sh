#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED
MEM=$ED/Memory

CONTEXT_FILE=$MEM/Brain/current-context.txt

echo "ED Context Package"
echo "=================="
echo

echo "Recent Memory:"
find "$MEM" -type f \( -name "*.md" -o -name "*.txt" \) \
| head -10

echo

echo "Active Context:"
if [ -f "$MEM/Context/Active/current-context.md" ]; then
    cat "$MEM/Context/Active/current-context.md"
else
    echo "No active context"
fi

