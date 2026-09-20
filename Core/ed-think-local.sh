#!/data/data/com.termux/files/usr/bin/bash

ED=/storage/emulated/0/ED
MODEL=$(ollama list | awk 'NR==2 {print $1}')

SESSION="$ED/Memory/Brain/Sessions/$(date +%Y%m%d-%H%M).txt"

echo "========================================"
echo " ED Local Reasoning"
echo "========================================"

if [ -z "$MODEL" ]; then
    echo "No local model found"
    exit 1
fi

echo "Model:"
echo "$MODEL"

echo

read -p "Task for ED: " TASK

CONTEXT=$(bash ~/ED-Core/Core/ed-load-context.sh)

PROMPT="
You are ED.

Use this context:
$CONTEXT

Task:
$TASK

Provide a practical solution.
"

echo "$PROMPT" > "$SESSION"

echo "$PROMPT" | ollama run "$MODEL" | tee -a "$SESSION"

echo
echo "Session saved:"
echo "$SESSION"

echo "========================================"
