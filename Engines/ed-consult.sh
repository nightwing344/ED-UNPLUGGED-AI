#!/data/data/com.termux/files/usr/bin/bash

set -euo pipefail

QUERY="${*:-}"

if [ -z "$QUERY" ]; then
    read -r -p "ED Consultation Request: " QUERY
fi


echo "========================================"
echo " DIRECTOR ED CONSULTATION"
echo "========================================"

echo
echo "Request:"
echo "$QUERY"

LOWER=$(echo "$QUERY" | tr '[:upper:]' '[:lower:]')


CONTEXT="/storage/emulated/0/ED/Memory/Context/Active/specialist-consultation.txt"


{
echo "ED SPECIALIST CONSULTATION"
echo "=========================="
echo
echo "Request:"
echo "$QUERY"
echo
echo "Consulted Departments:"
echo

if echo "$LOWER" | grep -Eq "court|legal|law|judge|motion|custody|filing"
then
echo "- Legal ED"
echo "- Pro Se AI ED"
echo "- Rogue Litigan Engine"
fi


if echo "$LOWER" | grep -Eq "code|software|app|ai|script"
then
echo "- Developer ED"
echo "- AI Research ED"
fi


if echo "$LOWER" | grep -Eq "build|repair|electrical|mechanical|diy"
then
echo "- Builder ED"
echo "- DIY ED"
fi


if echo "$LOWER" | grep -Eq "crypto|token|blockchain|web3"
then
echo "- Crypto ED"
fi


echo
echo "Instruction:"
echo "Specialists provide perspective."
echo "Director ED creates final response."

} > "$CONTEXT"


echo
echo "Context Created:"
echo "$CONTEXT"


if command -v ollama >/dev/null 2>&1
then

MODEL=$(ollama list | awk 'NR==2 {print $1}')

echo
echo "Using Brain:"
echo "$MODEL"

ollama run "$MODEL" "
You are Director ED.

You have consulted specialist departments.

Do not pretend to be separate personalities.
Integrate their expertise into one answer.

Consultation Context:

$(cat "$CONTEXT")

User Request:

$QUERY

Respond as ED Unplugged AI.
"

else

echo "Ollama not found."

fi


echo
echo "========================================"
echo " CONSULTATION COMPLETE"
echo "========================================"

