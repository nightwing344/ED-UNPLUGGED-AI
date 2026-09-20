#!/data/data/com.termux/files/usr/bin/bash

set -euo pipefail

ED="/storage/emulated/0/ED"
MEM="$ED/Memory"

QUERY="${*:-}"

if [ -z "$QUERY" ]; then
    read -r -p "ED Context Query: " QUERY
fi


CONTEXT="$MEM/Context/Active/intelligent-context.txt"


echo "========================================"
echo " ED CONTEXT ENGINE"
echo "========================================"


echo "Creating context package..."

{
echo "ED UNPLUGGED AI - INTERNAL CONTEXT"
echo "================================"
echo
echo "Current Date:"
date
echo
echo "User Request:"
echo "$QUERY"
echo
echo "Identity:"
echo "You are ED Unplugged AI."
echo "A persistent intelligence companion."
echo
echo "Interpret retrieved files as internal ED knowledge."
echo "Use project context before general meanings."
echo

echo "MEMORY RESULTS"
echo "=============="

grep -Ril "$QUERY" "$MEM" 2>/dev/null | head -10 | while read -r FILE
do

echo
echo "SOURCE:"
echo "$FILE"

echo
echo "CONTENT:"
head -80 "$FILE"

done

} > "$CONTEXT"


echo
echo "Context created:"
echo "$CONTEXT"


echo
echo "--- Local Brain ---"

if command -v ollama >/dev/null 2>&1
then

MODEL=$(ollama list | awk 'NR==2 {print $1}')

if [ -n "$MODEL" ]
then

ollama run "$MODEL" "
You are ED Unplugged AI.

Use the following internal context.

$(
cat "$CONTEXT"
)

User request:

$QUERY

Answer as ED.
Prioritize internal project knowledge.
Do not confuse project names with unrelated topics.
Be honest about uncertainty.
"

fi

else

echo "Ollama unavailable."

fi


echo
echo "========================================"
echo " CONTEXT INTELLIGENCE COMPLETE"
echo "========================================"

