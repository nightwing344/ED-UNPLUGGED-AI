#!/data/data/com.termux/files/usr/bin/bash

set -euo pipefail

ED="/storage/emulated/0/ED"
MEM="$ED/Memory"

QUERY="${*:-}"

if [ -z "$QUERY" ]; then
    read -r -p "ED Query: " QUERY
fi


echo "========================================"
echo " ED MEMORY BRIDGE"
echo "========================================"

echo
echo "Query:"
echo "$QUERY"


CONTEXT="$MEM/Context/Active/current-context.txt"

echo "ED Context Package" > "$CONTEXT"
echo "" >> "$CONTEXT"
echo "Created:" >> "$CONTEXT"
date >> "$CONTEXT"
echo "" >> "$CONTEXT"

echo "User Request:" >> "$CONTEXT"
echo "$QUERY" >> "$CONTEXT"


echo
echo "--- Searching Memory ---"


RESULTS=$(grep -Ril "$QUERY" "$MEM" 2>/dev/null | head -10 || true)


if [ -n "$RESULTS" ]; then

    echo "Relevant Memory Found:"
    echo "$RESULTS"

    echo "" >> "$CONTEXT"
    echo "Related Memory:" >> "$CONTEXT"

    while read -r FILE
    do
        echo "$FILE" >> "$CONTEXT"
    done <<< "$RESULTS"

else

    echo "No direct memory match."

fi


echo
echo "--- Local Brain ---"


if command -v ollama >/dev/null 2>&1; then

    MODEL=$(ollama list | awk 'NR==2 {print $1}')

    if [ -n "$MODEL" ]; then

        echo "Using:"
        echo "$MODEL"

        PROMPT=$(cat <<EOF2
You are ED Unplugged AI.

You have access to persistent memory.

Relevant context:

$(cat "$CONTEXT")

User request:

$QUERY

Respond as ED:
- Be helpful.
- Use context when relevant.
- Explain reasoning.
- Identify uncertainty.
EOF2
)

        ollama run "$MODEL" "$PROMPT"

    fi

else

echo "Ollama unavailable."

fi


echo
echo "--- Saving Session ---"

SESSION="$MEM/Brain/Sessions/$(date +%Y%m%d-%H%M%S).txt"

{
echo "ED Session"
date
echo
echo "Request:"
echo "$QUERY"
} > "$SESSION"


echo
echo "========================================"
echo " MEMORY BRIDGE COMPLETE"
echo "========================================"

